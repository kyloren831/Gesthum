import { createContext, type Dispatch, type SetStateAction } from "react";
import type { UserClaims } from "../../core/entities/UserClaims";

export interface AuthContextType{
    userClaims: UserClaims | null;
    loading:boolean,
    setLoading:Dispatch<SetStateAction<boolean>>,
    error:string | null,
    login:(email:string,password:string)=> Promise<UserClaims |null>;
    logout:()=>void;
    isAuthenticated:boolean;
}

export const AuthContext = createContext<AuthContextType>({
    userClaims:null,
    loading:false,
    setLoading(){},
    error : null,
    login:async()=>Promise.resolve(null),
    logout:()=>{},
    isAuthenticated:false,
});