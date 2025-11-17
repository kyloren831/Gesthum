import type { Vacancy } from "../../core/entities/Vacancy";
import type { VacancyDto } from "../dtos/VacancyDto";

export interface IVacanciesRepository {
    getAllVacancies(): Promise<Vacancy[]>;
    getVacancyById(id: number): Promise<Vacancy | undefined>;
    createVacancy(vacancy: VacancyDto): Promise<Vacancy | undefined>;
}