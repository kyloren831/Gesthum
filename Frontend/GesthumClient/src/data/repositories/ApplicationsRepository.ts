import type { Application } from "../../core/entities/Application";
import type { PostApplicationDto } from "../dtos/applications/PostApplication";
import { postApplication, getApplicationsByEmployeeId, getAllApplications, deleteApplication, getApplicationDetails } from "../datasources/applicationsApi";
import type { IApplicationsRepository } from "./IApplicationsRepository";

export class ApplicationsRepository implements IApplicationsRepository {
    async postApplication(postApp: PostApplicationDto): Promise<Application | undefined> {
        return await postApplication(postApp);
    }
    async getApplicationsByEmployeeId(employeeId: number): Promise<Application[] | undefined> {
        return await getApplicationsByEmployeeId(employeeId);
    }
    async getAllApplications(): Promise<Application[] | undefined> {
        return await getAllApplications();
    }
    async deleteApplication(applicationId: number): Promise<void> {
        return await deleteApplication(applicationId);
    }

    // Nuevo: devuelve el JSON completo con resume y vacant
    async getApplicationDetails(applicationId: number): Promise<any | undefined> {
        return await getApplicationDetails(applicationId);
    }
}