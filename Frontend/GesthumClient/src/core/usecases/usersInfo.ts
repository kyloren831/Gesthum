import { UserRepository } from "../../data/repositories/UserRepository"
import type { Admin } from "../entities/Admin";
import type { Employee } from "../entities/Employee";

export const getAdminInfo = async (id:number): Promise<Admin | undefined>=>{
    const repo = new UserRepository();
    return await repo.getAdminInfo(id);
}

export const getEmployeeInfo = async (id:number) : Promise<Employee | undefined>=>{
    const repo = new UserRepository();
    return await repo.getEmployeeInfo(id);
}

export const updateUserPhoyo = async (id: number, role: 'Admin' | 'Employee',photo: string): Promise<void> => {
    const repo = new UserRepository();
    return await repo.updateUserPhoto(id, role, photo);
}