import type { Evaluation } from "../../core/entities/Evaluation";

async function extractBackendMessage(response: Response): Promise<string> {
  try {
    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.Message === "string" && parsed.Message.length > 0) {
        return parsed.Message;
      }
      if (parsed && typeof parsed.message === "string" && parsed.message.length > 0) {
        return parsed.message;
      }
    } catch {
      // no es JSON
    }
    return text || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

const mapEvaluationDto = (dto: any): Evaluation => {
  return {
    id: Number(dto.id ?? dto.Id ?? 0),
    applicationId: Number(dto.applicationId ?? dto.ApplicationId ?? 0),
    score: Number(dto.score ?? dto.Score ?? 0),
    result: String(dto.result ?? dto.Result ?? ""),
    comments: String(dto.comments ?? dto.Comments ?? ""),
    strengths: String(dto.strengths ?? dto.Strengths ?? ""),
    weaknesses: String(dto.weaknesses ?? dto.Weaknesses ?? ""),
    reasons: dto.reasons ?? dto.Reasons ?? undefined,
    evaluationDate: dto.evaluationDate ?? dto.EvaluationDate ?? new Date().toISOString(),
  };
};

export const createEvaluationForApplication = async (applicationId: number): Promise<Evaluation | undefined> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Evaluations/${applicationId}`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const backendMessage = await extractBackendMessage(response);
    throw new Error(backendMessage || 'Create Evaluation failed');
  }

  const data: any = await response.json();
  return data ? mapEvaluationDto(data) : undefined;
};

/**
 * Obtiene la evaluación asociada a una application.
 * Intenta endpoints posibles: /api/Evaluations/application/{applicationId} y /api/Evaluations/{applicationId}
 */
export const getEvaluationByApplicationId = async (applicationId: number): Promise<Evaluation | undefined> => {
  if (!applicationId || applicationId <= 0) return undefined;

  // Primero intento ruta específica (más semántica)
  let response = await fetch(`${import.meta.env.VITE_API_URL}/api/Evaluations/application/${applicationId}`, {
    method: 'GET',
    credentials: 'include',
  });

  // Si 404 => devolver undefined
  if (response.status === 404) return undefined;

  // Si no ok, intentar fallback a /api/Evaluations/{applicationId}
  if (!response.ok) {
    response = await fetch(`${import.meta.env.VITE_API_URL}/api/Evaluations/${applicationId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.status === 404) return undefined;
    if (!response.ok) {
      const backendMessage = await extractBackendMessage(response);
      throw new Error(backendMessage || 'Get Evaluation failed');
    }
  }

  const data: any = await response.json();
  return data ? mapEvaluationDto(data) : undefined;
};