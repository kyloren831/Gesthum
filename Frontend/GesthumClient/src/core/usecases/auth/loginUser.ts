import { AuthRepository } from "../../../data/repositories/AuthRepository"
import type { UserClaims } from "../../entities/UserClaims";
export const loginUser = async (email: string, password:string) : Promise<UserClaims|undefined> =>{
    const repo = new AuthRepository();
    return await repo.login(email,password);
}