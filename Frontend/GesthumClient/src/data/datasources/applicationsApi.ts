import type { Application } from '../../core/entities/Application';
import type { PostApplicationDto } from '../dtos/applications/PostApplication';

const mapApplicationDto = (dto: any): Application => {
	const id = dto.id ?? dto.Id;
	// vacant id puede venir en varias formas: plano (vacantId/vacancyId) o anidado en `vacant`
	const vacantIdRaw = dto.vacantId ?? dto.VacantId ?? dto.vacancyId ?? dto.VacancyId ?? dto.vacant?.id ?? dto.vacant?.Id;
	const resumeIdRaw = dto.resumeId ?? dto.ResumeId ?? dto.resume?.id ?? dto.Resume?.Id;
	const applicationDate = dto.applicationDate ?? dto.ApplicationDate;
	const status = dto.status ?? dto.Status;

	// Vacant puede estar anidado o en propiedades planas; tomar ambas opciones
	const vacant = dto.vacant ?? dto.Vacant ?? {};
	const vacantTitle = dto.vacantTitle ?? dto.VacantTitle ?? vacant.title ?? vacant.Title;
	const vacantLocation = dto.vacantLocation ?? dto.VacantLocation ?? vacant.location ?? vacant.Location;
	const vacantPostedDate = dto.vacantPostedDate ?? dto.VacantPostedDate ?? vacant.postedDate ?? vacant.PostedDate;
	const vacantCloseDate = dto.vacantCloseDate ?? dto.VacantCloseDate ?? vacant.closeDate ?? vacant.CloseDate;
	const vacantState = dto.vacantState ?? dto.VacantState ?? (vacant.state !== undefined ? vacant.state : undefined);

	// Normalizar valores numéricos y opcionales
	const vacancyIdNum = Number(vacantIdRaw ?? 0);

	return {
		id: Number(id),
		resumeId: resumeIdRaw !== undefined ? Number(resumeIdRaw) : undefined,
		vacancyId: vacancyIdNum,
		vacantId: vacantIdRaw !== undefined ? Number(vacantIdRaw) : undefined,
		applicationDate: applicationDate ? String(applicationDate) : '',
		status: String(status),
		vacantTitle: vacantTitle ?? undefined,
		vacantLocation: vacantLocation ?? undefined,
		vacantPostedDate: vacantPostedDate ? String(vacantPostedDate) : undefined,
		vacantCloseDate: vacantCloseDate ? String(vacantCloseDate) : undefined,
		vacantState: vacantState !== undefined ? Boolean(vacantState) : undefined,
	};
};

export const postApplication = async (application: PostApplicationDto): Promise<Application | undefined> => {
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
	const data = await response.json();
	return data ? mapApplicationDto(data) : undefined;
};

export const getApplicationById = async (applicationId: number): Promise<Application | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications/${applicationId}`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Get Application by ID failed');
	}
	const data = await response.json();
	// Mantener compatibilidad: devolver Application mapeada (caso legacy)
	return data ? mapApplicationDto(data) : undefined;
};

/**
 * Nuevo: obtiene el JSON completo de la aplicación, incluyendo `resume` y `vacant`.
 * Esta función la usamos para vistas que necesitan los objetos anidados.
 */
export const getApplicationDetails = async (applicationId: number): Promise<any | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications/${applicationId}`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Get Application details failed');
	}
	const data = await response.json();
	return data ?? undefined;
};

export const getApplicationsByEmployeeId = async (employeeId: number): Promise<Application[] | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications/employee/${employeeId}`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Get Applications by Employee ID failed');
	}
	const data = await response.json();
	if (!Array.isArray(data)) return undefined;
	// El endpoint puede devolver solo los campos reducidos (sin objetos anidados); mapApplicationDto normaliza ambos casos.
	return data.map(mapApplicationDto);
};

export const getApplicationsByEmployerId = async (employerId: number): Promise<Application[] | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications/employer/${employerId}`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Get Applications by Employer ID failed');
	}
	const data = await response.json();
	if (!Array.isArray(data)) return undefined;
	return data.map(mapApplicationDto);
};

export const getAllApplications = async (): Promise<Application[] | undefined> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications`, {
		method: 'GET',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Get All Applications failed');
	}
	const data = await response.json();
	if (!Array.isArray(data)) return undefined;
	// Manejar el caso donde la API devuelve solo el listado reducido con campos de vacante planos.
	return data.map(mapApplicationDto);
};

export const deleteApplication = async (applicationId: number): Promise<void> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Applications/${applicationId}`, {
		method: 'DELETE',
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Delete Application failed');
	}
};
