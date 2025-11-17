import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updateUserPhoto } from "../../../data/datasources/usersApi";

const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp&s=200";

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  padding: 24,
  borderRadius: 8,
  width: 400,
  maxWidth: '90%',
  boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
};

const imgStyle: React.CSSProperties = {
  width: 120,
  height: 120,
  objectFit: 'cover',
  borderRadius: '50%',
  border: '1px solid #ddd',
  marginBottom: 12,
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 14px',
  marginRight: 8,
  cursor: 'pointer',
};

const UpdatePhotoModal = () => {
    const { userClaims, markFirstLoginDone } = useAuth();
    const [open, setOpen] = useState<boolean>(false);
    const [preview, setPreview] = useState<string>(defaultAvatar);
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
      setOpen(!!userClaims && userClaims.isFirstLogin);
      if(!userClaims) return;
      // Si el usuario ya tiene foto (no gestionado aquí), podríamos cargarla; por ahora fallback.
      setPreview(defaultAvatar);
    },[userClaims]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const f = e.target.files && e.target.files[0];
      if(!f) return;
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(String(reader.result));
      };
      reader.readAsDataURL(f);
    }

    const closeModal = () => {
      setOpen(false);
      markFirstLoginDone();
    }

    const handleSave = async () => {
      if(!userClaims) return;
      setSaving(true);
      setError(null);
      try {
        // Si no se seleccionó archivo, mandamos una cadena vacía o el preview por defecto.
        const payload = preview || "";
        await updateUserPhoto(Number.parseInt(userClaims.id), userClaims.role, payload);
        // marcar primer login como completado
        markFirstLoginDone();
        setOpen(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error al guardar la foto");
      } finally {
        setSaving(false);
      }
    }

    if(!open) return null;

    return (
      <div style={modalOverlayStyle} role="dialog" aria-modal="true" aria-label="Completar perfil">
        <div style={modalStyle}>
          <h3>Configura tu foto de perfil</h3>
          <p>Sube una foto o pulsa Omitir para continuar.</p>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <img src={preview || defaultAvatar} alt="Previsualización" style={imgStyle} />
            <input type="file" accept="image/*" onChange={handleFileChange} aria-label="Seleccionar foto" />
            {error && <p style={{color:'red'}}>{error}</p>}
            <div style={{marginTop:16}}>
              <button style={buttonStyle} onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button style={buttonStyle} onClick={closeModal} disabled={saving}>
                Omitir
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

export default UpdatePhotoModal;