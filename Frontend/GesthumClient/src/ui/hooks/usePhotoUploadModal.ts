import { useCallback, useState } from "react";
import { updateUserPhoyo } from "../../core/usecases/usersInfo";

type Role = "Admin" | "Employee";

interface OpenOptions {
  id?: number;
  role?: Role;
}

export const usePhotoUploadModal = (initial?: OpenOptions) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.id ? null : null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | undefined>(initial?.id);
  const [role, setRole] = useState<Role | undefined>(initial?.role);

  const openModal = useCallback((opts?: OpenOptions) => {
    if (opts?.id !== undefined) setUserId(opts.id);
    if (opts?.role) setRole(opts.role);
    setError(null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setLoading(false);
    setError(null);
    setPreview(null);
    setDataUrl(null);
  }, []);

  const handleFile = useCallback((file?: File | null) => {
    if (!file) {
      setPreview(null);
      setDataUrl(null);
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        setDataUrl(result);
        resolve();
      };
      reader.onerror = (e) => {
        const msg = "Error leyendo el fichero";
        setError(msg);
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const setPreviewFromUrl = useCallback((url: string) => {
    setPreview(url);
    setDataUrl(url);
  }, []);

  const upload = useCallback(
    async (overrideId?: number, overrideRole?: Role, onSuccess?: () => void) => {
      const targetId = overrideId ?? userId;
      const targetRole = overrideRole ?? role;
      if (!targetId || !targetRole) {
        const msg = "Falta id o role para realizar la subida";
        setError(msg);
        throw new Error(msg);
      }
      if (!dataUrl) {
        const msg = "No hay imagen seleccionada";
        setError(msg);
        throw new Error(msg);
      }
      setLoading(true);
      setError(null);
      try {
        // Llama al caso de uso; este caso ya realiza la subida a Cloudinary si recibe dataURL
        await updateUserPhoyo(targetId, targetRole, dataUrl);
        setLoading(false);
        if (onSuccess) onSuccess();
        closeModal();
      } catch (err: any) {
        setError(err?.message ?? "Error al actualizar la foto");
        setLoading(false);
        throw err;
      }
    },
    [dataUrl, userId, role, closeModal]
  );

  return {
    isOpen,
    loading,
    error,
    preview,
    openModal,
    closeModal,
    handleFile,
    setPreviewFromUrl,
    upload,
    setUserId,
    setRole,
  };
};

export default usePhotoUploadModal;