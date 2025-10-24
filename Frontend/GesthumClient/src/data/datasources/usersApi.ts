import type { Admin } from "../../core/entities/Admin";
import type { Employee } from "../../core/entities/Employee";

export const getAdminInfo = async (id:number):Promise<Admin|undefined> =>{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Users/${id}/admin`,{
        credentials:'include'
    });
    if(!response.ok){
        throw new Error('Get ADMIN info faild');
    }
    const data : Admin = await response.json();
    return data;
}

export const getEmployeeInfo = async (id:number):Promise<Employee|undefined> =>{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Users/${id}/employee`,{
        credentials:'include'
    });
    if(!response.ok){
        throw new Error('Get EMPLOYEE info faild');
    }
    const data : Employee = await response.json();
    return data;
}