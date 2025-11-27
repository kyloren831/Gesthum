import { useState, useCallback } from "react";
import type { Evaluation } from "../../../core/entities/Evaluation";
import { getEvaluationByApplicationId as getEvaluationUseCase } from "../../../core/usecases/evaluationsUses";

export const useGetEvaluationByApplicationId = () => {
  const [evaluation, setEvaluation] = useState<Evaluation | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluation = useCallback(async (applicationId: number): Promise<Evaluation | undefined> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvaluationUseCase(applicationId);
      setEvaluation(data);
      return data;
    } catch (err: any) {
      const message = err?.message ?? "Error al obtener la evaluación";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    evaluation,
    loading,
    error,
    fetchEvaluation,
  };
};