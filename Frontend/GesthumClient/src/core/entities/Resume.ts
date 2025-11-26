export interface WorkExperience {
    id: number;
    resumeId: number;
    companyName: string;
    position: string;
    description: string;
    startDate: string; // ISO 8601, p. ej. "2025-03-31T02:26:41.583"
    endDate: string | null; // puede ser null si continúa
}

export interface Resume {
    id: number;
    employeeId: number;
    creationDate: string; // ISO 8601
    academicTraining: string;
    skills: string;
    languages: string;
    profileSummary: string;
    WorkExpList: WorkExperience[];
    isActive: boolean;
}

