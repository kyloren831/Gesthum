import {  useEffect, useState, type ReactNode, useCallback } from "react";
import type { UserClaims } from "../../core/entities/UserClaims";
import { useLogin } from "../../ui/hooks/useLogin";
import { AuthContext } from "../context/AuthContext";
interface Props{
    children:ReactNode;
}

export const AuthProvider = ({children}: Props)=>{
    const [userClaims, setUserClaims] = useState<UserClaims|null>(null);
    const {login: loginUserHook, logout : logoutUserHook,  error} = useLogin();
    const [loading,setLoading] = useState(false);

    const login = async (email:string,password:string) : Promise<UserClaims |null> => {
        setLoading(true);
        const user : UserClaims | undefined = await loginUserHook(email,password);
        if(user){
            localStorage.setItem('user', JSON.stringify(user));
            setUserClaims(user);
            return user;
        }
        return null;
    }

    const logout = async () => {
        await logoutUserHook();
        localStorage.removeItem('user');
        setUserClaims(null);
    }

    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        if(storedUser) setUserClaims(JSON.parse(storedUser));
    },[])

    const markFirstLoginDone = useCallback(() => {
        if(!userClaims) return;
        const updated = { ...userClaims, isFirstLogin: false };
        setUserClaims(updated);
        localStorage.setItem('user', JSON.stringify(updated));
    }, [userClaims]);

    return(
        <AuthContext.Provider value={{
            userClaims,
            setLoading,
            loading,
            error,
            login,
            logout,
            isAuthenticated: !!userClaims,
            markFirstLoginDone,
        }}>
            {children}
        </AuthContext.Provider>
    );

};