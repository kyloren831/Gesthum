import type { Vacancy } from '../../core/entities/Vacancy';
import type { VacancyDto } from '../dtos/VacancyDto';

export const getVacancies = async (): Promise<Vacancy[]> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Vacancies`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Get Vacancies failed');
	}
	const data: Vacancy[] = await response.json();
	return data;
}

export const getVacancyById = async (id: number): Promise<Vacancy | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Vacancies/${id}`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Get Vacancy by ID failed');
	}
	const data: Vacancy = await response.json();
	return data;
}

export const createVacancy = async (vacancy: VacancyDto): Promise<Vacancy | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Vacancies`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(vacancy),
	});
	if (!response.ok) {
		throw new Error('Create Vacancy failed');
	}
	const data: Vacancy = await response.json();
	return data;
}

export const updateVacancy = async (id: number, vacancy: Vacancy): Promise<Vacancy | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Vacancies/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(vacancy),
	});
	if (!response.ok) {
		throw new Error('Update Vacancy failed');
	}
	const data: Vacancy = await response.json();
    return data;
}

export const changeVacancyState = async (id: number): Promise<void> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Vacancies/${id}/status`, {
		method: 'PATCH',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Change Vacancy State failed');
	}
	return;
}