import type { Admin } from "../../core/entities/Admin";
import type { Employee } from "../../core/entities/Employee";
import type { IUserRepository } from "./IUserRepository";
import { getAdminInfo, getEmployeeInfo, updateUserPhoto } from '../datasources/usersApi'

export class UserRepository implements IUserRepository {
    async getAdminInfo(id: number): Promise<Admin | undefined> {
        return await getAdminInfo(id);
    }
    async getEmployeeInfo(id: number): Promise<Employee | undefined> {
        return await getEmployeeInfo(id);
    }
    async updateUserPhoto(id: number, role: 'Admin' | 'Employee', photo: string): Promise<void> {
        return await updateUserPhoto({ id, role, photoUrl: photo });
    }

}