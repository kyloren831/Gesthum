import { AuthRepository } from "../../../data/repositories/AuthRepository";

export const logoutUser = async () => {
    const repo = new AuthRepository();
    return await repo.logout();
}