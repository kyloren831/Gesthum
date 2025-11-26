import type { PostApplicationDto } from "../../data/dtos/applications/PostApplication";
import type { Application } from "../entities/Application";
import { ApplicationsRepository } from "../../data/repositories/ApplicationsRepository";

export const postApplication = async (postApp: PostApplicationDto): Promise<Application | undefined> => {
    const repo = new ApplicationsRepository();
    return await repo.postApplication(postApp);
}

export const getApplicationsByEmployeeId = async (employeeId: number): Promise<Application[] | undefined> => {
    const repo = new ApplicationsRepository();
    return await repo.getApplicationsByEmployeeId(employeeId);
}
export const getAllApplications = async (): Promise<Application[] | undefined> => {
    const repo = new ApplicationsRepository();
    return await repo.getAllApplications();
}
export const deleteApplication = async (applicationId: number): Promise<void> => {
    const repo = new ApplicationsRepository();
    return await repo.deleteApplication(applicationId);
}
