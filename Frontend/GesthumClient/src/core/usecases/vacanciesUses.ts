import { VacanciesRepository } from '../../data/repositories/VacanciesRepository';
import type { Vacancy } from '../entities/Vacancy';
import type { VacancyDto } from '../../data/dtos/VacancyDto';
export const getAllVacancies = async (): Promise<Vacancy[]> => {
    const repo = new VacanciesRepository();
    return await repo.getAllVacancies();
}
export const getVacancyDetails = async (id: number): Promise<Vacancy | undefined> => {
    const repo = new VacanciesRepository();
    return await repo.getVacancyById(id);
}
export const createNewVacancy = async (vacancy: VacancyDto): Promise<Vacancy | undefined> => {
    const repo = new VacanciesRepository();
    return await repo.createVacancy(vacancy);
}
export const updateVacancyDetails = async (id: number, vacancy: Vacancy): Promise<Vacancy | undefined> => {
    const repo = new VacanciesRepository();
    return await repo.updateVacancy(id, vacancy);
}
export const toggleVacancyState = async (id: number): Promise<void> => {
    const repo = new VacanciesRepository();
    return await repo.changeVacancyState(id);
}