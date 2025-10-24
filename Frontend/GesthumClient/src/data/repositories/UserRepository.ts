import type { Admin } from "../../core/entities/Admin";
import type { Employee } from "../../core/entities/Employee";
import type { IUserRepository } from "./IUserRepository";
import {getAdminInfo,getEmployeeInfo} from '../datasources/usersApi'

export class UserRepository implements IUserRepository {
    async getAdminInfo(id: number): Promise<Admin | undefined> {
        return await getAdminInfo(id);
    }
    async getEmployeeInfo(id: number): Promise<Employee | undefined> {
        return await getEmployeeInfo(id);
    }

}