export interface UserClaims{
    id:string;
    role: 'Admin' | 'Employee';
    isFirstLogin:boolean;
}