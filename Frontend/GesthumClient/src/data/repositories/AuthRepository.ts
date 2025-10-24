import type { UserClaims } from '../../core/entities/UserClaims';
import {authApi, logoutApi} from '../datasources/authApi'
import type { IAuthRepository } from './IAuthRepository';

export class AuthRepository implements IAuthRepository{
    async login(email:string,password:string):Promise<UserClaims | undefined>{
        return await authApi(email,password);
    }
    async logout(){
        return await logoutApi();
    }
}