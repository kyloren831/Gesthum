import type { UserClaims } from "../../core/entities/UserClaims";

export interface IAuthRepository{
    login(email:string,password:string):Promise<UserClaims | undefined>;
    logout():void;
}