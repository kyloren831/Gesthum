import {  useEffect, useState, type ReactNode } from "react";
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
        debugger;
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
        debugger;
        await logoutUserHook();
        localStorage.removeItem('user');
        setUserClaims(null);
    }

    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        if(storedUser) setUserClaims(JSON.parse(storedUser));
    },[])

    return(
        <AuthContext.Provider value={{
            userClaims,
            setLoading,
            loading,
            error,
            login,
            logout,
            isAuthenticated: !!userClaims,
        }}>
            {children}
        </AuthContext.Provider>
    );

};