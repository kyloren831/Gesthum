/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { updateVacancyDetails, toggleVacancyState } from '../../../core/usecases/vacanciesUses';
import type { Vacancy } from '../../../core/entities/Vacancy';
export const useUpdateVacancy = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateVacancy = async (id: number, vacancy: Vacancy): Promise<Vacancy | undefined> => {
        try {
            setLoading(true);
            setError(null);
            return await updateVacancyDetails(id, vacancy);
        } catch (err: any) {
            const message = err?.message ?? 'Error al actualizar la vacante';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: number): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await toggleVacancyState(id);
        } catch (err: any) {
            const message = err?.message ?? 'Error al cambiar el estado de la vacante';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };


    return {
        loading,
        error,
        updateVacancy,
        toggleStatus
    };
};