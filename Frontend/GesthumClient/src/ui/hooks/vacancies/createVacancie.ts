import { useState } from 'react';
import { createNewVacancy } from '../../../core/usecases/vacanciesUses';
import type { VacancyDto } from '../../../data/dtos/VacancyDto';
import type { Vacancy } from '../../../core/entities/Vacancy';

export const CreateVacancie = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Vacancy | null>(null);

  const createVacancie = async (vacancy: VacancyDto): Promise<Vacancy | undefined> => {
    try {
      setLoading(true);
      setError(null);
      const result = await createNewVacancy(vacancy);
      setCreated(result ?? null);
      return result;
    } catch (err: any) {
      const message = err?.message ?? 'Error al crear la vacante';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createVacancie,
    loading,
    error,
    created,
  };
};