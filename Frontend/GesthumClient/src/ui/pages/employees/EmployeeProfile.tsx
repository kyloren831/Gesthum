import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import Styles from "./EmployeeProfile.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useUserInfo } from "../../hooks/useUserInfo";
import type { Employee } from "../../../core/entities/Employee";
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

const EmployeeProfile: React.FC = () => {
  const { userClaims } = useAuth();
  const { employeeInfo } = useUserInfo();
  const [employee, setEmployee] = useState<Employee | undefined>(undefined);

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
    const load = async () => {
      if (!userClaims) return;
      try {
        const emp = await employeeInfo(Number.parseInt(userClaims.id));
        setEmployee(emp);
      } catch {
        setEmployee(undefined);
      }
    };
    void load();
  }, [userClaims, employeeInfo]);

  // Inicializar hook con id/role y preparar preview cuando cambie employee
  useEffect(() => {
    if (!userClaims) return;
    setUserId(Number.parseInt(userClaims.id));
    setRole(userClaims.role as "Admin" | "Employee");
    const publicPhoto = (employee as any)?.photoUrl ?? (userClaims as any)?.photoUrl;
    if (publicPhoto && /^https?:\/\//i.test(publicPhoto)) {
      setPreviewFromUrl(publicPhoto);
    } else {
      setPreviewFromUrl(defaultAvatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userClaims, employee]);

  const handleOpenPhotoModal = () => {
    if (!userClaims) return;
    openModal({ id: Number.parseInt(userClaims.id), role: userClaims.role as "Admin" | "Employee" });
    // asegurar preview actualizado
    const publicPhoto = (employee as any)?.photoUrl ?? (userClaims as any)?.photoUrl;
    if (publicPhoto && /^https?:\/\//i.test(publicPhoto)) {
      setPreviewFromUrl(publicPhoto);
    } else {
      setPreviewFromUrl(defaultAvatar);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    await handleFile(f ?? null);
  };

  const handleSave = async () => {
    try {
      await upload(undefined, undefined, async () => {
        // refrescar employee tras subida
        if (userClaims) {
          try {
            const emp = await employeeInfo(Number.parseInt(userClaims.id));
            setEmployee(emp);
          } catch {
            // ignorar
          }
        }
      });
    } catch (err) {
      // error ya expuesto por hook
      console.error(err);
    }
  };

  return (
    <div className={Styles.body}>
      <div className={Styles.pageLayout}>
        <Sidebar />
        <div className={Styles.contentArea}>
          <Header
            name={employee?.name}
            jobPosition={employee?.position}
            photo={employee?.photoUrl}
          />
          <main className={Styles.mainContent} aria-label="Perfil personal">
            <section className={Styles.card} aria-labelledby="profile-title">
              <h1 id="profile-title" className={Styles.pageTitle} style={{ marginBottom: 16 }}>
                Perfil
              </h1>

              <div className={Styles.profileHeader} style={{ alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <img
                    className={Styles.avatar}
                    src={
                      employee?.photoUrl ??
                      `https://via.placeholder.com/96?text=${encodeURIComponent((employee?.name ?? "U").charAt(0))}`
                    }
                    alt={`Foto de ${employee?.name ?? "empleado"}`}
                    width={96}
                    height={96}
                  />
                  <button
                    type="button"
                    className={AdminStyles.secondaryButton}
                    onClick={handleOpenPhotoModal}
                    aria-label="Editar foto"
                    style={{ padding: "6px 10px", fontSize: 13 }}
                  >
                    Editar foto
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>ID</div>
                    <div style={{ fontWeight: 700 }}>{employee?.id ?? "-"}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Nombre</div>
                    <div style={{ fontWeight: 700 }}>{employee?.name ?? "-"}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Email</div>
                    <div style={{ fontWeight: 700 }}>{employee?.email ?? "-"}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Posición</div>
                    <div style={{ fontWeight: 700 }}>{employee?.position ?? "-"}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Departamento</div>
                    <div style={{ fontWeight: 700 }}>{employee?.department ?? "-"}</div>
                  </div>
                </div>
              </div>
            </section>

            {isOpen && (
              <div style={modalOverlayStyle} role="dialog" aria-modal="true" aria-label="Editar foto de perfil">
                <div style={modalStyle}>
                  <h3>Editar foto de perfil</h3>
                  <p>Sube una foto para tu perfil.</p>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img src={preview || defaultAvatar} alt="Previsualización" style={imgStyle} />
                    <input type="file" accept="image/*" onChange={handleFileChange} aria-label="Seleccionar foto" />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button className={AdminStyles.primaryButton} onClick={handleSave} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button className={AdminStyles.secondaryButton} onClick={closeModal} disabled={loading}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;