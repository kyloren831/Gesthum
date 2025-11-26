import { useState } from "react";
import { updateResume as updateResumeUseCase } from "../../../core/usecases/resumesUses";
import type { CreateResumeRequest } from "../../../data/dtos/CreateResumeDto";
import type { Resume } from "../../../core/entities/Resume";

export const useUpdateResume = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState<Resume | null>(null);

  const updateResume = async (resumeId: number, payload: CreateResumeRequest): Promise<Resume | undefined> => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateResumeUseCase(resumeId, payload);
      setUpdated(result ?? null);
      return result;
    } catch (err: any) {
      const message = err?.message ?? "Error al actualizar el CV";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateResume,
    loading,
    error,
    updated,
  };
};