import type { Application } from '../../core/entities/Application';
import type { PostApplicationDto } from '../dtos/applications/PostApplication';

export const postApplication = async (application: PostApplicationDto): Promise <Application | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(application),
	});
	if (!response.ok) {
		throw new Error('Post Application failed');
	}
	const data: Application = await response.json();
	return data;
}

export const getApplicationsByEmployeeId = async (employeeId: number): Promise<Application[] | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications/employee/${employeeId}`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Get Applications by Employee ID failed');
	}
	const data: Application[] = await response.json();
	return data;
}

export const getApplicationsByEmployerId = async (employerId: number): Promise<Application[] | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications/employer/${employerId}`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Get Applications by Employer ID failed');
	}
	const data: Application[] = await response.json();
	return data;
}

export const getAllApplications = async (): Promise<Application[] | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Get All Applications failed');
	}
	const data: Application[] = await response.json();
	return data;
}

export const deleteApplication = async (applicationId: number): Promise<void> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications/${applicationId}`, {
		method: 'DELETE',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Delete Application failed');
	}
}

