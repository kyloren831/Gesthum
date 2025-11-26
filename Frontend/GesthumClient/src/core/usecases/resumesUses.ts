import type { Resume } from "../entities/Resume";
import type { CreateResumeRequest } from "../../data/dtos/CreateResumeDto";
import { ResumesRepository } from "../../data/repositories/ResumesRepository";

export const createResume = async (createResumeRequest: CreateResumeRequest): Promise<Resume | undefined> => {
	const repo = new ResumesRepository();
	return await repo.createResume(createResumeRequest);
};

export const getResumeByEmployeeId = async (employeeId: number): Promise<Resume | undefined> => {
	const repo = new ResumesRepository();
	return await repo.getResumeByEmployeeId(employeeId);
};

export const deleteResume = async (resumeId: number): Promise<void> => {
	const repo = new ResumesRepository();
	return await repo.deleteResume(resumeId);
};

export const updateResume = async (resumeId: number, updateResumeRequest: CreateResumeRequest): Promise<Resume | undefined> => {
	const repo = new ResumesRepository();
	return await repo.updateResume(resumeId, updateResumeRequest);
};