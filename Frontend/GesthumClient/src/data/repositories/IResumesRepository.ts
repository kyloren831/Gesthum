import type { Resume } from "../../core/entities/Resume";
import type { CreateResumeRequest } from "../dtos/CreateResumeDto";
export interface IResumesRepository {
    createResume(createResumeRequest: CreateResumeRequest): Promise<Resume | undefined>;
    getResumeByEmployeeId(employeeId: number): Promise<Resume | undefined>;
    deleteResume(resumeId: number): Promise<void>;
    updateResume(resumeId: number, updateResumeRequest: CreateResumeRequest): Promise<Resume | undefined>;
}