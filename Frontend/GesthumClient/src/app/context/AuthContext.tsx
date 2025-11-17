import { createContext, type Dispatch, type SetStateAction } from "react";
import type { UserClaims } from "../../core/entities/UserClaims";

export interface AuthContextType{
    userClaims: UserClaims | null;
    loading:boolean;
    setLoading:Dispatch<SetStateAction<boolean>>;
    error:string | null;
    login:(email:string,password:string)=> Promise<UserClaims |null>;
    logout:()=>void;
    isAuthenticated:boolean;
    // marca que el primer login ya fue completado (cierra modal y actualiza localStorage)
    markFirstLoginDone: () => void;
}

// noop con el tipo correcto para evitar errores de asignación en createContext
const noopSetLoading = (() => {}) as unknown as Dispatch<SetStateAction<boolean>>;
const noopLogin = async () : Promise<UserClaims | null> => null;

export const AuthContext = createContext<AuthContextType>({
    userClaims: null,
    loading: false,
    setLoading: noopSetLoading,
    error: null,
    login: noopLogin,
    logout: () => {},
    isAuthenticated: false,
    markFirstLoginDone: () => {},
});