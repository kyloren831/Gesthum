/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { createResume as createResumeUseCase } from '../../../core/usecases/resumesUses';
import type { CreateResumeRequest } from '../../../data/dtos/CreateResumeDto';
import type { Resume } from '../../../core/entities/Resume';

export const useCreateResume = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Resume | null>(null);

  const createResume = async (payload: CreateResumeRequest): Promise<Resume | undefined> => {
    try {
      setLoading(true);
      setError(null);
      const result = await createResumeUseCase(payload);
      setCreated(result ?? null);
      return result;
    } catch (err: any) {
      const message = err?.message ?? 'Error al crear el resume';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createResume,
    loading,
    error,
    created,
  };
};