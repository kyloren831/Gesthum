/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { loginUser } from "../../core/usecases/auth/loginUser";
import {logoutUser} from '../../core/usecases/auth/logoutUser';
import type { UserClaims } from "../../core/entities/UserClaims";



export function useLogin(){
    const [error,setError]= useState<string|null>(null);
    
    const login = async (email:string,password:string)  : Promise<UserClaims | undefined>=> {
        try {
            setError(null);
            const userClaims: UserClaims | undefined  = await loginUser(email,password);
            if(userClaims != undefined){
                return userClaims;
            }
        } catch (error:any) {
            setError(error.message || "Error al iniciar sesión");
            throw error;
        }
    }
    const logout = async () =>{
        await logoutUser();
    }
    return {login,logout,error}
}