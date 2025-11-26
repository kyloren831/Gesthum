/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import usePhotoUploadModal from "../../hooks/usePhotoUploadModal";
import AdminStyles from '../../pages/admins/AdminDashboard.module.css';

const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp&s=200";

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  padding: 24,
  borderRadius: 8,
  width: 400,
  maxWidth: "90%",
  boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
};

const imgStyle: React.CSSProperties = {
  width: 120,
  height: 120,
  objectFit: "cover",
  borderRadius: "50%",
  border: "1px solid #ddd",
  marginBottom: 12,
};

const UpdatePhotoModal = () => {
  const { userClaims, markFirstLoginDone } = useAuth();
  const {
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
  } = usePhotoUploadModal();

  useEffect(() => {
    if (!userClaims) return;

    const idNum = Number.parseInt(userClaims.id);
    // Inicializar hook con id/role por si se abre posteriormente
    setUserId(idNum);
    setRole(userClaims.role as "Admin" | "Employee");

    // Si es primer login abrir modal
    if (userClaims.isFirstLogin) {
      // si el usuario ya tiene foto pública, usarla como preview:
      if ((userClaims as any).photoUrl && /^https?:\/\//i.test((userClaims as any).photoUrl)) {
        setPreviewFromUrl((userClaims as any).photoUrl);
      } else {
        setPreviewFromUrl(defaultAvatar);
      }
      openModal({ id: idNum, role: userClaims.role as "Admin" | "Employee" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userClaims]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    await handleFile(f ?? null);
  };

  const handleSave = async () => {
    if (!userClaims) return;
    try {
      await upload(undefined, undefined, () => {
        // marcado como completado tras subida exitosa
        markFirstLoginDone();
      });
    } catch (err) {
      // el hook ya expone `error`; aquí solo prevenir excepción no manejada
      console.error(err);
    }
  };

  const handleSkip = () => {
    // cerrar y marcar primer login hecho
    closeModal();
    markFirstLoginDone();
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle} role="dialog" aria-modal="true" aria-label="Completar perfil">
      <div style={modalStyle}>
        <h3>Configura tu foto de perfil</h3>
        <p>Sube una foto o pulsa Omitir para continuar.</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={preview || defaultAvatar} alt="Previsualización" style={imgStyle} />
          <input type="file" accept="image/*" onChange={handleFileChange} aria-label="Seleccionar foto" />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className={AdminStyles.primaryButton} onClick={handleSave} disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button className={AdminStyles.secondaryButton} onClick={handleSkip} disabled={loading}>
              Omitir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePhotoModal;