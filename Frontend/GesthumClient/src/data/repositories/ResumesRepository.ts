import type { Resume } from "../../core/entities/Resume";
import { createResume, deleteResume, getResumeByEmployeeId, updateResume } from "../datasources/resumesApi";
import type { CreateResumeRequest } from "../dtos/CreateResumeDto";
import type { IResumesRepository } from "./IResumesRepository";

export class ResumesRepository implements IResumesRepository {
	// Implementar los métodos del repositorio de resúmenes aquí
	async createResume(createResumeRequest: CreateResumeRequest): Promise<Resume | undefined> {
		// Lógica para crear un resumen
		return await createResume(createResumeRequest);
	}
	async getResumeByEmployeeId(employeeId: number): Promise<Resume | undefined> {
		// Lógica para obtener un resumen por ID de empleado
		return await getResumeByEmployeeId(employeeId);
	}
	async deleteResume(resumeId: number): Promise<void> {
		// Lógica para eliminar un resumen
		return await deleteResume(resumeId);
	}
	async updateResume(resumeId: number, updateResumeRequest: CreateResumeRequest): Promise<Resume | undefined> {
		// Lógica para actualizar un resumen
		return await updateResume(resumeId, updateResumeRequest);
	}
}