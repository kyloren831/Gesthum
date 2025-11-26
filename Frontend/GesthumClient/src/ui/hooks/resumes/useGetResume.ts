import { useState, useEffect } from 'react';
import { getResumeByEmployeeId } from '../../../core/usecases/resumesUses';
import type { Resume, WorkExperience } from '../../../core/entities/Resume';

const normalizeWorkExp = (rawList: any): WorkExperience[] => {
  if (!rawList || !Array.isArray(rawList)) return [];
  return rawList.map((w: any) => ({
    id: w.id ?? 0,
    resumeId: w.resumeId ?? w.ResumeId ?? 0,
    companyName: w.companyName ?? w.company ?? w.CompanyName ?? '',
    position: w.position ?? w.Position ?? '',
    description: w.description ?? w.Description ?? '',
    // Normalizar a formato yyyy-mm-dd para inputs; backend acepta ISO
    startDate: w.startDate ? String(w.startDate).slice(0, 10) : '',
    endDate: w.endDate ? String(w.endDate).slice(0, 10) : null,
  }));
};

const normalizeResume = (raw: any): Resume => {
  if (!raw) return null as unknown as Resume;
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

export const useGetResume = (employeeId?: number) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResume = async (id?: number): Promise<Resume | undefined> => {
    // Si id inválido: considerar que no hay CV (estado inicial)
    if (!id || id <= 0) {
      setResume(null);
      setError(null);
      return undefined;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getResumeByEmployeeId(id);
      // Si backend devuelve undefined => no hay CV activo; mostrar estado inicial sin error
      if (!data) {
        setResume(null);
        return undefined;
      }
      // Normalizar cualquier forma que venga desde el backend
      const normalized = normalizeResume(data);
      setResume(normalized ?? null);
      return normalized;
    } catch (err: any) {
      const message = err?.message ?? 'Error al obtener el resume';
      // Si el backend devuelve not found o 404 debemos tratarlo como "no hay CV" y no mostrar error
      if (message.toLowerCase().includes('not found') || message.includes('404')) {
        setResume(null);
        setError(null);
        return undefined;
      }
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId && employeeId > 0) {
      void fetchResume(employeeId);
    } else {
      // si no hay employeeId, asegurar estado inicial
      setResume(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  return {
    resume,
    loading,
    error,
    fetchResume,
  };
};