import { useState, useCallback } from 'react';
import { getApplicationById } from '../../../core/usecases/applicationsUses';
import type { Application } from '../../../core/entities/Application';
import type { Resume, WorkExperience } from '../../../core/entities/Resume';
import type { Vacancy } from '../../../core/entities/Vacancy';

/**
 * Hook para obtener detalle completo de una aplicación por id.
 * Devuelve { application, resume, vacancy, loading, error, fetch }.
 * Normaliza el objeto `resume` para garantizar que siempre exista `WorkExpList`.
 */
export const useGetApplicationById = () => {
  const [application, setApplication] = useState<Application | undefined>(undefined);
  const [resume, setResume] = useState<Resume | undefined>(undefined);
  const [vacancy, setVacancy] = useState<Vacancy | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeWorkExp = (rawList: any): WorkExperience[] => {
    if (!rawList || !Array.isArray(rawList)) return [];
    return rawList.map((w: any) => ({
      id: w.id ?? w.Id ?? 0,
      resumeId: w.resumeId ?? w.ResumeId ?? 0,
      companyName: w.companyName ?? w.company ?? w.CompanyName ?? '',
      position: w.position ?? w.Position ?? '',
      description: w.description ?? w.Description ?? '',
      startDate: w.startDate ? String(w.startDate) : '',
      endDate: w.endDate ? String(w.endDate) : null,
    }));
  };

  const normalizeResume = (raw: any): Resume | undefined => {
    if (!raw) return undefined;
    const workExp =
      raw.WorkExpList ??
      raw.WorkExperience ??
      raw.workExperience ??
      raw.workExpList ??
      raw.WorkExp ??
      [];
    return {
      id: raw.id ?? raw.Id ?? 0,
      employeeId: raw.employeeId ?? raw.EmployeeId ?? 0,
      creationDate: raw.creationDate ?? raw.CreationDate ?? new Date().toISOString(),
      academicTraining: raw.academicTraining ?? raw.AcademicTraining ?? '',
      skills: raw.skills ?? raw.Skills ?? '',
      languages: raw.languages ?? raw.Languages ?? '',
      profileSummary: raw.profileSummary ?? raw.ProfileSummary ?? '',
      WorkExpList: normalizeWorkExp(workExp),
      isActive: raw.isActive ?? raw.IsActive ?? true,
    };
  };

  const normalizeVacancy = (raw: any): Vacancy | undefined => {
    if (!raw) return undefined;
    return {
      id: Number(raw.id ?? raw.Id ?? raw.vacantId ?? raw.VacantId ?? raw.vacancyId ?? raw.VacancyId ?? 0),
      title: raw.title ?? raw.Title ?? raw.vacantTitle ?? raw.VacantTitle ?? '',
      description: raw.description ?? raw.Description ?? raw.vacantDescription ?? raw.VacantDescription ?? '',
      requirements: raw.requirements ?? raw.Requirements ?? raw.vacantRequirements ?? raw.VacantRequirements ?? '',
      location: raw.location ?? raw.Location ?? raw.vacantLocation ?? raw.VacantLocation ?? '',
      postedDate: raw.postedDate ?? raw.PostedDate ?? raw.vacantPostedDate ?? raw.VacantPostedDate ?? undefined,
      closeDate: raw.closeDate ?? raw.CloseDate ?? raw.vacantCloseDate ?? raw.VacantCloseDate ?? undefined,
      state: raw.state ?? raw.State ?? raw.vacantState ?? raw.VacantState ?? undefined,
      // si tu entidad Vacancy tiene más campos, añadirlos aquí
    } as Vacancy;
  };

  const fetch = useCallback(async (applicationId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data: any = await getApplicationById(applicationId);
      if (!data) {
        setApplication(undefined);
        setResume(undefined);
        setVacancy(undefined);
        return;
      }

      // Normalizar application (campos planos)
      const app: Application = {
        id: Number(data.id ?? data.Id ?? 0),
        resumeId: data.resumeId ?? data.ResumeId ?? data.resume?.id ?? undefined,
        vacancyId: Number(data.vacantId ?? data.VacantId ?? data.vacancyId ?? data.VacancyId ?? data.vacant?.id ?? 0),
        vacantId: data.vacantId ?? data.VacantId ?? data.vacant?.id ?? undefined,
        applicationDate: String(data.applicationDate ?? data.ApplicationDate ?? ''),
        status: String(data.status ?? data.Status ?? ''),
        vacantTitle: (data.vacantTitle ?? data.VacantTitle) ?? data.vacant?.title,
        vacantLocation: (data.vacantLocation ?? data.VacantLocation) ?? data.vacant?.location,
        vacantPostedDate: (data.vacantPostedDate ?? data.VacantPostedDate) ?? data.vacant?.postedDate,
        vacantCloseDate: (data.vacantCloseDate ?? data.VacantCloseDate) ?? data.vacant?.closeDate,
        vacantState: (data.vacantState ?? data.VacantState) ?? data.vacant?.state,
      };
      setApplication(app);

      // Normalizar y establecer resume y vacancy completos (si vienen)
      const rawResume = data.resume ?? data.Resume ?? data.Resume ?? data.resumeDto ?? undefined;
      const normalizedResume = normalizeResume(rawResume ?? data.vacant?.resume ?? data.application?.resume ?? rawResume);
      setResume(normalizedResume);

      const rawVacant = data.vacant ?? data.Vacant ?? data.vacancy ?? data.Vacancy ?? undefined;
      const normalizedVacancy = normalizeVacancy(rawVacant ?? data);
      setVacancy(normalizedVacancy);
    } catch (err: any) {
      const msg = err?.message ?? 'Error al obtener el detalle de la aplicación';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    application,
    resume,
    vacancy,
    loading,
    error,
    fetchApplication: fetch,
  };
};