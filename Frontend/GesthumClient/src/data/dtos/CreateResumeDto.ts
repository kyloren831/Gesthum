import type { WorkExperience } from "../../core/entities/Resume";

export interface CreateResumeRequest {
    employeeId: number;
    academicTraining: string;
    skills: string;
    languages: string;
    profileSummary: string;
    WorkExpList: WorkExperience[];
}