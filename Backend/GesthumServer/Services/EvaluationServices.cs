using GesthumServer.Models;
using Google.GenAI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace GesthumServer.Services
{
    public class EvaluationServices
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
            string summary = string.Empty;
            var reasonsList = new List<string>();

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
                    // Intentar parsear JSON estricto desde la respuesta (esperamos JSON con score, summary, reasons)
                    try
                    {
                        using var doc = JsonDocument.Parse(rawText);
                        var root = doc.RootElement;

                        if (root.TryGetProperty("score", out var scoreProp) && scoreProp.ValueKind == JsonValueKind.Number)
                            score = scoreProp.GetInt32();

                        summary = root.TryGetProperty("summary", out var summaryProp) && summaryProp.ValueKind == JsonValueKind.String
                            ? summaryProp.GetString() ?? string.Empty
                            : string.Empty;

                        if (root.TryGetProperty("reasons", out var reasonsProp) && reasonsProp.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var r in reasonsProp.EnumerateArray())
                            {
                                if (r.ValueKind == JsonValueKind.String)
                                    reasonsList.Add(r.GetString() ?? string.Empty);
                            }
                        }
                    }
                    catch (JsonException)
                    {
                        // No es JSON válido: usar todo el texto crudo como summary
                        summary = rawText;
                        logger.LogWarning("Respuesta de Gemini no es JSON válido para application {ApplicationId}.", applicationId);
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
                    EvaluationDate = DateTime.UtcNow
                };

                await dbContext.Set<Evaluation>().AddAsync(errorEval, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                return errorEval;
            }

            // Clasificar razones en strengths/weaknesses por heurística simple
            var strengths = new List<string>();
            var weaknesses = new List<string>();
            var negativeKeywords = new[] { "no ", "not ", "lack", "insufficient", "weak", "missing", "falta", "sin " };

            foreach (var reason in reasonsList)
            {
                var lower = reason.ToLowerInvariant();
                if (negativeKeywords.Any(k => lower.Contains(k)))
                    weaknesses.Add(reason);
                else
                    strengths.Add(reason);
            }

            // Determinar resultado según score (umbral configurable aquí)
            var clampedScore = Math.Clamp(score, 0, 100);
            string result;
            const int passThreshold = 70;
            if (clampedScore >= passThreshold)
                result = "Passed";
            else if (clampedScore > 0)
                result = "Failed";
            else
                result = "Pending";

            // Crear entidad Evaluation y persistir
            var evaluation = new Evaluation
            {
                ApplicationId = applicationId,
                Result = result,
                Comments = string.IsNullOrWhiteSpace(summary) ? "No summary provided by model." : summary,
                Strengths = strengths.Any() ? string.Join(" | ", strengths) : string.Empty,
                Weaknesses = weaknesses.Any() ? string.Join(" | ", weaknesses) : string.Empty,
                EvaluationDate = DateTime.UtcNow
            };

            await dbContext.Set<Evaluation>().AddAsync(evaluation, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);

            return evaluation;
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

            // Instrucciones: pedir JSON estricto para facilitar parsing
            var instructions = @"
Compara la vacante con el currículum. Evalúa el ajuste entre la vacante y el candidato.
Devuelve UN ÚNICO JSON válido con las propiedades:
 - score: número entero 0-100 que indique el grado de ajuste (100 = perfecto).
 - summary: texto corto explicando la evaluación.
 - reasons: array de strings con las razones más importantes (3 como máximo).
Ejemplo de respuesta válida:
{ ""score"": 78, ""summary"": ""Buen ajuste en habilidades técnicas"", ""reasons"": [""Coinciden las habilidades X, Y"", ""Experiencia en el sector Z""] }
No incluyas texto adicional fuera del JSON.
";

            return $"{instructions}\n{vacancyText}\n{resumeText}";
        }
    }
}
