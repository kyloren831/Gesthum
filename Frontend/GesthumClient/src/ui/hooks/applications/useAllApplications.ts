import { useState, useCallback } from "react";
import type { Application } from "../../../core/entities/Application";
import { getAllApplications } from "../../../core/usecases/applicationsUses";

export const useAllApplications = () => {
    const [applications, setApplications] = useState<Application[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllApplications = useCallback(async (): Promise<Application[] | undefined> => {
        try {
            setLoading(true);
            setError(null);
            const data: Application[] | undefined = await getAllApplications();
            setApplications(data);
            return data;
        } catch (err: any) {
            const message = err?.message ?? "Error al obtener todas las aplicaciones";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        applications,
        loading,
        error,
        fetchAllApplications,
    };
};