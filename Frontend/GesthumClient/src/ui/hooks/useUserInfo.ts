import { useState } from "react";
import type { Admin } from "../../core/entities/Admin";
import { getAdminInfo, getEmployeeInfo } from "../../core/usecases/usersInfo";
import type { Employee } from "../../core/entities/Employee";

export function useUserInfo(){
    const [error,setError]= useState<string|null>(null);
    const adminInfo = async (id:number) : Promise<Admin | undefined> => {
        try {
            setError(null);
            const admin :Admin | undefined = await getAdminInfo(id);
            return admin;
        } catch (error:any) {
            setError(error.message || 'Error al traer informacion del Admin')
        }
    }
    const employeeInfo = async (id:number) : Promise<Employee | undefined> => {
        try {
            setError(null);
            const employee :Employee | undefined = await getEmployeeInfo(id);
            return employee;
        } catch (error:any) {
            setError(error.message || 'Error al traer informacion del Empleado')
        }
    }
    return {error, adminInfo, employeeInfo}
}