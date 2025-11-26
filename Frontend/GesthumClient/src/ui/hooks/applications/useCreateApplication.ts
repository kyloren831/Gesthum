import { useState } from "react";
import type { Application } from "../../../core/entities/Application";
import type { PostApplicationDto } from "../../../data/dtos/applications/PostApplication";
import { postApplication } from "../../../core/usecases/applicationsUses";

export const useCreateApplication = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdApplication, setCreatedApplication] = useState<Application | null>(null);

    const createApplication = async (postApp: PostApplicationDto): Promise<Application | undefined> => {
        try {
            setLoading(true);
            setError(null);
            const createdApp = await postApplication(postApp);
            setCreatedApplication(createdApp ?? null);
            return createdApp;
        } catch (err: any) {
            const message = err?.message ?? "Error al crear la aplicación";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    return {
        createApplication,
        loading,
        error,
        createdApplication,
    };
};


