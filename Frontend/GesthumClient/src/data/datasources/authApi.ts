import type { UserClaims } from "../../core/entities/UserClaims";

export const authApi = async(email:string,password:string):Promise<UserClaims | undefined> =>{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Auth/login`,{
      method: 'POST',
      headers:{
        'Content-type':'application/json'
      },
      credentials: "include",
      body:JSON.stringify({email: email, password: password})
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    const data : UserClaims = await response.json();
    console.log(data);
    return data;
};

export const logoutApi = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Auth/logout`,{
      method: 'POST',
      headers:{
        'Content-type':'application/json'
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error('Logout failed');
    }
}