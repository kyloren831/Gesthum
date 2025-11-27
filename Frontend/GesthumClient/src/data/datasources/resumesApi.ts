import type { Resume } from "../../core/entities/Resume";
import type { CreateResumeRequest } from "../dtos/CreateResumeDto";

async function extractBackendMessage(response: Response): Promise<string> {
  try {
    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.Message === "string" && parsed.Message.length > 0) {
        return parsed.Message;
      }
      if (parsed && typeof parsed.message === "string" && parsed.message.length > 0) {
        return parsed.message;
      }
    } catch {
      // no es JSON
    }
    return text || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

export const createResume = async (resume: CreateResumeRequest): Promise<Resume | undefined> => {
    console.log('Creating resume with data:', resume);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Resumes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resume),
    });
    if (!response.ok) {
        const backendMessage = await extractBackendMessage(response);
        console.error('Create Resume error response:', response.status, backendMessage);
        throw new Error(backendMessage);
    }
    const data: Resume = await response.json();
    return data;
};

export const updateResume = async (resumeId: number, resume: CreateResumeRequest): Promise<Resume | undefined> => {
  console.log(`Updating resume ${resumeId} with data:`, resume);
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Resumes/${resumeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(resume),
  });

  if (!response.ok) {
    const backendMessage = await extractBackendMessage(response);
    console.error('Update Resume error response:', response.status, backendMessage);
    throw new Error(backendMessage);
  }

  const data: Resume = await response.json();
  return data;
};

export const getResumeByEmployeeId = async (employeeId: number): Promise<Resume | undefined> => {
    console.log('Fetching resume for employee ID:', employeeId);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Resumes/${employeeId}`, {
        method: 'GET',
        credentials: 'include',
    });

    // Si el backend devuelve 404 => no existe CV activo, devolver undefined en vez de lanzar
    if (response.status === 404) {
        console.info(`Resume not found for employee ${employeeId} (404).`);
        return undefined;
    }

    if (!response.ok) {
        const backendMessage = await extractBackendMessage(response);
        console.error('Get Resume error response:', response.status, backendMessage);
        throw new Error(backendMessage);
    }

    const data: Resume = await response.json();
    return data;
}

export const deleteResume = async (resumeId: number): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Resumes/id/${resumeId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        const backendMessage = await extractBackendMessage(response);
        console.error('Delete Resume error response:', response.status, backendMessage);
        throw new Error(backendMessage);
    };
};

export const getResumeByApplicationId = async (applicationId: number): Promise<Resume | undefined> => {
    if (!applicationId || applicationId <= 0) return undefined;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Resumes/application/${applicationId}`, {
        method: 'GET',
        credentials: 'include',
    });

    // si devuelve 404 -> no hay resume asociado
    if (response.status === 404) {
        console.info(`Resume not found for application ${applicationId} (404).`);
        return undefined;
    }

    if (!response.ok) {
        const backendMessage = await extractBackendMessage(response);
        console.error('Get Resume by Application ID error response:', response.status, backendMessage);
        throw new Error(backendMessage);
    }

    const data: Resume = await response.json();
    return data;
};