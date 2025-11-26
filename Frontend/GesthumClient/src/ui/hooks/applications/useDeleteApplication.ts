import { useState } from "react";
import { deleteApplication } from "../../../core/usecases/applicationsUses";

export const useDeleteApplication = () => {
// Hook logic to fetch all applications would go here
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fetchDeleteApplication= async (applicationId: number): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            // Here you would call the usecase to delete the application by ID
            await deleteApplication(applicationId);
        } catch (err: any) {
            const message = err?.message ?? "Error al eliminar la aplicación";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        fetchDeleteApplication,
    };
};