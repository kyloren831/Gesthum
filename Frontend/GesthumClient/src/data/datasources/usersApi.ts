import type { Admin } from "../../core/entities/Admin";
import type { Employee } from "../../core/entities/Employee";

/**
 * Código para subir a Cloudinary desde cliente usando upload preset sin firmar.
 * Si la variable de entorno falta, se lanza un error claro y se hace console.error de import.meta.env.
 */

export const getAdminInfo = async (id:number):Promise<Admin|undefined> =>{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Users/${id}/admin`,{
        credentials:'include'
    });
    if(!response.ok){
        throw new Error('Get ADMIN info faild');
    }
    const data : Admin = await response.json();
    return data;
}

export const getEmployeeInfo = async (id:number):Promise<Employee|undefined> =>{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Users/${id}/employee`,{
        credentials:'include'
    });
    if(!response.ok){
        throw new Error('Get EMPLOYEE info faild');
    }
    const data : Employee = await response.json();
    return data;
}

/**
 * Sube la foto a Cloudinary y devuelve la URL pública (secure_url).
 * Si `photo` ya es una URL (http/https) la devuelve sin subir.
 */
const uploadPhotoToCloudinary = async (photo: string): Promise<string> => {
   const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // requerido para uploads sin firmar

  if (!cloudName) {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME no está configurada en .env');
  }

  // Si ya es una URL pública, devolverla directamente
  if (/^https?:\/\//i.test(photo)) {
    return photo;
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const form = new FormData();
  form.append('file', photo); // acepta dataURL/base64 o File
  if (uploadPreset) {
    form.append('upload_preset', uploadPreset);
  } else {
    throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET no está configurada en .env (necesaria para uploads sin firmar)');
  }

  // carpeta en Cloudinary
  form.append('folder', 'Users/profilesPhotos');

  const res = await fetch(endpoint, {
    method: 'POST',
    body: form
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${txt}`);
  }

  const data = await res.json();
  return data.secure_url || data.url;
}

/**
 * Actualiza la foto del usuario (Admin o Employee).
 * Sube a Cloudinary si recibe dataURL/base64 y envía la URL resultante al backend.
 */
export const updateUserPhoto = async ({ id, role, photoUrl }: { id: number; role: 'Admin' | 'Employee'; photoUrl: string; }): Promise<void> => {
    const endpoint = role === 'Admin' ? `${import.meta.env.VITE_API_URL}/api/Users/${id}/admin` : `${import.meta.env.VITE_API_URL}/api/Users/${id}/employee`;

    let urlToSend: string;
    try {
      urlToSend = await uploadPhotoToCloudinary(photoUrl);
    } catch (err) {
      throw new Error(`Upload to Cloudinary failed: ${(err as Error).message}`);
    }

    const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(urlToSend) // backend espera un string
    });
    if(!response.ok){
        const txt = await response.text();
        throw new Error(`Update photo failed: ${txt}`);
    }
}