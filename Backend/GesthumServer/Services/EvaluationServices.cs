using GesthumServer.Models;
using Google.GenAI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace GesthumServer.Services
{
    public interface IEvaluationServices
    {
        Task<Evaluation> CreateEvaluationForApplicationAsync(int applicationId, string model = "gemini-2.0-flash", CancellationToken cancellationToken = default);
    }

    public class EvaluationServices : IEvaluationServices
    {
        private readonly DbContextGesthum dbContext;
        private readonly IConfiguration config;
        private readonly ILogger<EvaluationServices> logger;
        private readonly string apiKey;

        public EvaluationServices(DbContextGesthum dbContext, IConfiguration config, ILogger<EvaluationServices> logger)
        {
            this.dbContext = dbContext;
            this.config = config;
            this.logger = logger;
            apiKey = config["GeminiApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                logger.LogWarning("GeminiApiKey no está configurada en appsettings.json. Las llamadas a la API de Gemini fallarán.");
            }
        }

        /// <summary>
        /// Crea una evaluación para la aplicación indicada comparando la vacante con el resume adjunto en la aplicación,
        /// persiste un registro en la tabla Evaluations y devuelve la entidad persistida.
        /// </summary>
        public async Task<Evaluation> CreateEvaluationForApplicationAsync(int applicationId, string model = "gemini-2.0-flash", CancellationToken cancellationToken = default)
        {
            // Cargar la aplicación con Resume y Vacancy
            var application = await dbContext.Set<Application>()
                .Include(a => a.Resume)
                    .ThenInclude(r => r.WorkExperience)
                .Include(a => a.Vacant)
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == applicationId, cancellationToken);

            if (application == null)
                throw new KeyNotFoundException($"Application with id {applicationId} not found.");

            if (application.Resume == null)
                throw new InvalidOperationException($"Application {applicationId} has no resume attached.");

            if (application.Vacant == null)
                throw new InvalidOperationException($"Application {applicationId} has no vacancy attached.");

            // Construir prompt indicando explícitamente salida JSON
            var prompt = BuildEvaluationPrompt(application.Vacant, application.Resume);

            string rawText = string.Empty;
            int score = 0;
            string comments = string.Empty;
            var reasonsList = new List<string>();
            var strengthsList = new List<string>();
            var weaknessesList = new List<string>();
            string modelResult = string.Empty;

            try
            {
                // Configurar API key para el SDK (si el SDK usa variable de entorno)
                if (!string.IsNullOrWhiteSpace(apiKey))
                {
                    Environment.SetEnvironmentVariable("GOOGLE_API_KEY", apiKey);
                }

                var client = new Client();

                var response = await client.Models.GenerateContentAsync(
                    model: model,
                    contents: prompt
                );

                rawText = response?.Candidates?.FirstOrDefault()?
                                   .Content?.Parts?.FirstOrDefault()?
                                   .Text ?? string.Empty;

                if (string.IsNullOrWhiteSpace(rawText))
                {
                    logger.LogWarning("Gemini returned empty content for application {ApplicationId}.", applicationId);
                }
                else
                {
                    // Extraer sólo el JSON del texto devuelto por el modelo (quita fences y texto adicional)
                    var jsonCandidate = ExtractJsonContent(rawText);

                    try
                    {
                        using var doc = JsonDocument.Parse(jsonCandidate);
                        var root = doc.RootElement;

                        if (root.TryGetProperty("result", out var resultProp) && resultProp.ValueKind == JsonValueKind.String)
                            modelResult = resultProp.GetString() ?? string.Empty;

                        if (root.TryGetProperty("score", out var scoreProp) && scoreProp.ValueKind == JsonValueKind.Number)
                            score = scoreProp.GetInt32();

                        if (root.TryGetProperty("comments", out var commentsProp) && commentsProp.ValueKind == JsonValueKind.String)
                            comments = commentsProp.GetString() ?? string.Empty;
                        else if (root.TryGetProperty("summary", out var summaryProp) && summaryProp.ValueKind == JsonValueKind.String)
                            comments = summaryProp.GetString() ?? string.Empty;

                        if (root.TryGetProperty("reasons", out var reasonsProp) && reasonsProp.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var r in reasonsProp.EnumerateArray())
                            {
                                if (r.ValueKind == JsonValueKind.String)
                                    reasonsList.Add(r.GetString() ?? string.Empty);
                            }
                        }

                        if (root.TryGetProperty("strengths", out var strengthsProp) && strengthsProp.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var s in strengthsProp.EnumerateArray())
                            {
                                if (s.ValueKind == JsonValueKind.String)
                                    strengthsList.Add(s.GetString() ?? string.Empty);
                            }
                        }

                        if (root.TryGetProperty("weaknesses", out var weaknessesProp) && weaknessesProp.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var w in weaknessesProp.EnumerateArray())
                            {
                                if (w.ValueKind == JsonValueKind.String)
                                    weaknessesList.Add(w.GetString() ?? string.Empty);
                            }
                        }
                    }
                    catch (JsonException)
                    {
                        // Si no parsea, intentamos una extracción más agresiva y volvemos a parsear
                        var fallback = AggressiveJsonExtract(rawText);
                        try
                        {
                            using var doc = JsonDocument.Parse(fallback);
                            var root = doc.RootElement;

                            if (root.TryGetProperty("result", out var resultProp2) && resultProp2.ValueKind == JsonValueKind.String)
                                modelResult = resultProp2.GetString() ?? string.Empty;

                            if (root.TryGetProperty("score", out var scoreProp2) && scoreProp2.ValueKind == JsonValueKind.Number)
                                score = scoreProp2.GetInt32();

                            if (root.TryGetProperty("comments", out var commentsProp2) && commentsProp2.ValueKind == JsonValueKind.String)
                                comments = commentsProp2.GetString() ?? string.Empty;
                        }
                        catch (JsonException)
                        {
                            // Si sigue fallando, guardamos el texto crudo (sin fences) en comments para auditoría
                            comments = StripCodeFences(rawText).Trim();
                            logger.LogWarning("Respuesta de Gemini no es JSON válido tras intentos de extracción para application {ApplicationId}.", applicationId);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error al llamar al modelo Gemini para application {ApplicationId}", applicationId);
                // En caso de error en la llamada al modelo, persistimos una evaluación pendiente con el error en comments
                var errorEval = new Evaluation
                {
                    ApplicationId = applicationId,
                    Result = "Pending",
                    Comments = $"Error calling model: {ex.Message}",
                    Strengths = string.Empty,
                    Weaknesses = string.Empty,
                    Score = 0,
                    Reasons = string.Empty,
                    EvaluationDate = DateTime.UtcNow
                };

                await dbContext.Set<Evaluation>().AddAsync(errorEval, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                return errorEval;
            }

            // Si no vienen strengths/weaknesses derivarlos desde reasons
            if (!strengthsList.Any() && !weaknessesList.Any() && reasonsList.Any())
            {
                var negativeKeywords = new[] { "no ", "not ", "lack", "insufficient", "weak", "missing", "falta", "sin " };
                foreach (var reason in reasonsList)
                {
                    var lower = reason.ToLowerInvariant();
                    if (negativeKeywords.Any(k => lower.Contains(k)))
                        weaknessesList.Add(reason);
                    else
                        strengthsList.Add(reason);
                }
            }

            // Determinar result (preferir valor explícito del modelo)
            string result;
            if (!string.IsNullOrWhiteSpace(modelResult))
            {
                result = modelResult;
            }
            else
            {
                var clampedScore = Math.Clamp(score, 0, 100);
                const int passThreshold = 70;
                if (clampedScore >= passThreshold)
                    result = "Passed";
                else if (clampedScore > 0)
                    result = "Failed";
                else
                    result = "Pending";
            }

            var clamped = Math.Clamp(score, 0, 100);
            var evaluation = new Evaluation
            {
                ApplicationId = applicationId,
                Result = result,
                Comments = string.IsNullOrWhiteSpace(comments) ? "No comments provided by model." : comments,
                Strengths = strengthsList.Any() ? string.Join(" | ", strengthsList) : string.Empty,
                Weaknesses = weaknessesList.Any() ? string.Join(" | ", weaknessesList) : string.Empty,
                Score = clamped,
                Reasons = reasonsList.Any() ? string.Join(" | ", reasonsList) : string.Empty,
                EvaluationDate = DateTime.UtcNow
            };

            await dbContext.Set<Evaluation>().AddAsync(evaluation, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);

            return evaluation;
        }

        private static string StripCodeFences(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;

            var t = text.Trim();

            // Eliminar bloques ```...```
            if (t.StartsWith("```"))
            {
                // quitar la primera línea (```json o ``` )
                var firstNewline = t.IndexOf('\n');
                if (firstNewline >= 0)
                    t = t.Substring(firstNewline + 1);
            }

            // quitar trailing fences si existen
            var closingFence = t.LastIndexOf("```");
            if (closingFence >= 0)
                t = t.Substring(0, closingFence);

            return t.Trim();
        }

        private static string ExtractJsonContent(string text)
        {
            var cleaned = StripCodeFences(text);

            var firstBrace = cleaned.IndexOf('{');
            var lastBrace = cleaned.LastIndexOf('}');

            if (firstBrace >= 0 && lastBrace > firstBrace)
                return cleaned.Substring(firstBrace, lastBrace - firstBrace + 1);

            // si no se encuentran llaves bien, devolver el cleaned text (intentaremos parsear de todas formas)
            return cleaned;
        }

        private static string AggressiveJsonExtract(string text)
        {
            // like ExtractJsonContent but intenta eliminar cualquier prefijo/sufijo y localizar el JSON más grande posible
            var cleaned = StripCodeFences(text);

            // buscar primer '{' y el '}' correspondiente buscando hacia el final
            var first = cleaned.IndexOf('{');
            var last = cleaned.LastIndexOf('}');
            if (first >= 0 && last > first)
                return cleaned.Substring(first, last - first + 1);

            // fallback: si hay corchetes ([]) devolver su contenido
            var firstArr = cleaned.IndexOf('[');
            var lastArr = cleaned.LastIndexOf(']');
            if (firstArr >= 0 && lastArr > firstArr)
                return cleaned.Substring(firstArr, lastArr - firstArr + 1);

            return cleaned;
        }

        private static string BuildEvaluationPrompt(Vacancy vacancy, Resume resume)
        {
            // Crear una representación compacta y clara de la vacante y el CV
            var vacancyText = $@"Vacancy:
Title: {vacancy.Title}
Description: {vacancy.Description}
Requirements: {vacancy.Requirements}
Location: {vacancy.Location}
";

            var resumeWorkExp = resume.WorkExperience != null && resume.WorkExperience.Any()
                ? string.Join("\n", resume.WorkExperience.Select(w => $"- {w.Position} at {w.CompanyName} ({w.StartDate:yyyy-MM} - {(w.EndDate.HasValue ? w.EndDate.Value.ToString("yyyy-MM") : "Present")}): {w.Description}"))
                : "No work experience provided.";

            var resumeText = $@"Resume:
ProfileSummary: {resume.ProfileSummary}
Skills: {resume.Skills}
Languages: {resume.Languages}
WorkExperience:
{resumeWorkExp}
";

            // Instrucciones: exigir SOLO el JSON necesario para crear la entidad Evaluation
            var instructions = @"
Devuelve ÚNICAMENTE un JSON válido (sin texto adicional) con estas propiedades:
 - result: string, uno de ""Passed"", ""Failed"" o ""Pending"". (necesario)
 - comments: string breve que será guardado en Evaluation.Comments. (necesario)
 - strengths: array de strings (0-5) mapeado a Evaluation.Strengths. (recomendado)
 - weaknesses: array de strings (0-5) mapeado a Evaluation.Weaknesses. (recomendado)
 - score: entero 0-100 (opcional)
 - reasons: array de strings (opcional, para auditoría)
Ejemplo (respuesta EXACTA esperada, sin fences ni texto extra):
{ ""result"": ""Passed"", ""comments"": ""Buen ajuste en habilidades técnicas."", ""strengths"": [""C#"", "".NET""], ""weaknesses"": [""Poca experiencia en cloud""], ""score"": 85, ""reasons"": [""Coinciden las habilidades X, Y""] }
IMPORTANTE: NO incluyas explicaciones, encabezados, ni bloques de código. SOLO el JSON arriba descrito.
";

            return $"{instructions}\n{vacancyText}\n{resumeText}";
        }
    }
}
