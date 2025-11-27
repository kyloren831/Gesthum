import type { Application } from "../../core/entities/Application";
import type { PostApplicationDto } from "../dtos/applications/PostApplication";
export interface IApplicationsRepository {
    postApplication(postApp: PostApplicationDto): Promise<Application | undefined>;
    getApplicationsByEmployeeId(employeeId: number): Promise<Application[] | undefined>;
    getAllApplications(): Promise<Application[] | undefined>;
    deleteApplication(applicationId: number): Promise<void>;
    // Nuevo: obtener detalle completo (incluye resume y vacant en el JSON)
    getApplicationDetails(applicationId: number): Promise<any | undefined>;
}