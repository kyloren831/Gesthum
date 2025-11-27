export interface Application {
    id: number;
    // Identificador del resume (backend usa ResumeId)
    resumeId?: number;
    // Alias/compatibilidad: algunos lugares usan vacancyId, el backend expone VacantId
    vacancyId: number;
    vacantId?: number;
    // Compatibilidad histórica (si existiera)
    employeeId?: string;

    // Fecha en ISO (serializada desde DateTime del backend)
    applicationDate: string;

    // Estado (permitimos string para ser flexible con posibles nuevos valores)
    status: 'Pending' | 'Passed' | 'Failed' | string;

    // Datos de la vacante incluidos en el DTO del backend
    vacantTitle?: string;
    vacantLocation?: string;
    vacantPostedDate?: string;
    vacantCloseDate?: string;
    vacantState?: boolean;
}