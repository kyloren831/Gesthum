import { useState } from "react";
import { deleteResume } from "../../../core/usecases/resumesUses";

export const useDeleteResume = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchDeleteResume = async (resumeId: number): Promise<void> => {
		try {
			setLoading(true);
			setError(null);
			await deleteResume(resumeId);
		} catch (err: any) {
			const message = err?.message ?? "Error al eliminar el resume";
            console.error(message);
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		fetchDeleteResume,
	};
};