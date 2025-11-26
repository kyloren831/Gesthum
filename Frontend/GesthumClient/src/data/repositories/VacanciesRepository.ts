import type { Vacancy } from "../../core/entities/Vacancy";
import type { IVacanciesRepository } from "./IVacanciesRepository";
import { getVacancies, getVacancyById, createVacancy, updateVacancy, changeVacancyState } from "../datasources/vacanciesApi";
import type { VacancyDto } from "../dtos/VacancyDto";
export class VacanciesRepository implements IVacanciesRepository {
    async getAllVacancies(): Promise<Vacancy[]> {
        return await getVacancies();
    }
    async getVacancyById(id: number): Promise<Vacancy | undefined> {
        return await getVacancyById(id);
    }
    async createVacancy(vacancy: VacancyDto): Promise<Vacancy | undefined> {
        return await createVacancy(vacancy);
    }
    async updateVacancy(id: number, vacancy: Vacancy): Promise<Vacancy | undefined> {
        return await updateVacancy(id, vacancy);
    }
    async changeVacancyState(id: number): Promise<void> {
        return await changeVacancyState(id);
    }
    
}