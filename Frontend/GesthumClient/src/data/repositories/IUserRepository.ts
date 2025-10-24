import type { Admin } from "../../core/entities/Admin";
import type { Employee } from "../../core/entities/Employee";

export interface IUserRepository{
    getAdminInfo(id:number) :Promise<Admin | undefined>;
    getEmployeeInfo(id:number) :Promise<Employee | undefined>;
}