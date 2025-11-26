import { useState, useCallback } from "react";
import type { Application } from "../../../core/entities/Application";
import { getApplicationsByEmployeeId } from "../../../core/usecases/applicationsUses";

export const useAppsByEmployee = () => {
    const [applications, setApplications] = useState<Application[] | undefined >(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchApplicationsByEmployee = useCallback(async (employeeId: number): Promise<Application[] | undefined> => {
        try {
            setLoading(true);
            setError(null);
            const data: Application[] | undefined = await getApplicationsByEmployeeId(employeeId);
            setApplications(data);
            return data;
        } catch (err: any) {
            const message = err?.message ?? "Error al obtener las aplicaciones por empleado";
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
        fetchApplicationsByEmployee,
    };
};