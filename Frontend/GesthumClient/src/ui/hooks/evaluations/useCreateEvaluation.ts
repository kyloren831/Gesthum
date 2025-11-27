import { useState } from 'react';
import { createEvaluation as createEvaluationUseCase } from '../../../core/usecases/evaluationsUses';
import type { Evaluation } from '../../../core/entities/Evaluation';

export const useCreateEvaluation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Evaluation | null>(null);

  const createEvaluation = async (applicationId: number): Promise<Evaluation | undefined> => {
    try {
      setLoading(true);
      setError(null);
      const res = await createEvaluationUseCase(applicationId);
      setCreated(res ?? null);
      return res;
    } catch (err: any) {
      const message = err?.message ?? 'Error al crear evaluación';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvaluation,
    loading,
    error,
    created,
  };
};