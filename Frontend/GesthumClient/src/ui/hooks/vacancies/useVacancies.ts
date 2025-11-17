/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { getAllVacancies } from '../../../core/usecases/vacanciesUses';
import type { Vacancy } from '../../../core/entities/Vacancy';

export const useVacancies = () => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVacancies = async (): Promise<Vacancy[] | undefined> => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllVacancies();
            setVacancies(data);
            return data;
        } catch (err: any) {
            const message = err?.message ?? 'Error al obtener vacantes';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

   

    useEffect(() => {
        // Carga inicial al montar el hook
        void fetchVacancies();
    }, []);

    return {
        vacancies,
        loading,
        error,
        fetchVacancies
    };
};