import Styles from './Header.module.css'
import AdminStyles from '../../pages/admins/AdminDashboard.module.css'
import { FaChevronDown } from 'react-icons/fa';
import { LuLogOut } from 'react-icons/lu';
import { CgProfile } from 'react-icons/cg';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserInfo } from '../../hooks/useUserInfo';
import type { Admin } from '../../../core/entities/Admin';
import type { Employee } from '../../../core/entities/Employee';
import usePhotoUploadModal from '../../hooks/usePhotoUploadModal';
import { EMPLOYEE_PROFILE_ROUTE } from '../../../app/routes/PrivateRoute';

interface props{
    jobPosition?: string;
    name?: string;
    photo?: string;
}
const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp&s=200";

const Header = ({jobPosition, name, photo}:props) => {

    const {userClaims, logout} = useAuth();
    const { adminInfo, employeeInfo } = useUserInfo();
    const navegate = useNavigate();
    const handleLogout = async () =>{
        try {
            await logout();
            navegate('/');
        } catch (error) {
            console.log(error)
        }
    }

    const [computedName, setComputedName] = useState<string | undefined>(name);
    const [computedPhoto, setComputedPhoto] = useState<string | undefined>(photo);
    const [computedJobPosition, setComputedJobPosition] = useState<string>(jobPosition ?? '');

    // Hook para gestionar modal/subida
    const {
      isOpen,
      loading,
      error,
      preview,
      openModal,
      closeModal,
      handleFile,
      upload,
      setUserId,
      setRole,
      setPreviewFromUrl
    } = usePhotoUploadModal();

    useEffect(() => {
        const resolveHeader = async () => {
            // fallback inicial: props o claims
            setComputedName(name ?? "No name");
            setComputedPhoto(photo);

            if (!userClaims) {
                setComputedJobPosition(jobPosition ?? '');
                return;
            }

            if (userClaims.role === 'Admin') {
                // Admin -> obtener info completa (incluye foto)
                setComputedJobPosition('Administrador de RH');
                try {
                    const adm: Admin | undefined = await adminInfo(Number.parseInt(userClaims.id));
                    if (adm) {
                        setComputedName(adm.name);
                        setComputedPhoto(adm.photo);
                    }
                } catch (e) {
                    // mantener valores por defecto si falla
                }
                return;
            }

            if (userClaims.role === 'Employee') {
                // Employee -> obtener puesto y nombre
                try {
                    const emp: Employee | undefined = await employeeInfo(Number.parseInt(userClaims.id));
                    if (emp) {
                        setComputedName(emp.name ?? (name ?? ""));
                        setComputedJobPosition(emp.position ?? (jobPosition ?? 'Empleado'));
                        setComputedPhoto(emp.photoUrl ?? photo);
                    } else {
                        setComputedJobPosition(jobPosition ?? 'Empleado');
                    }
                } catch {
                    setComputedJobPosition(jobPosition ?? 'Empleado');
                }
                return;
            }

            // otros roles
            setComputedJobPosition(jobPosition ?? '');
        };

        void resolveHeader();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userClaims, jobPosition, name, photo]);

    // Inicializa hook con id y role cuando cambian los claims
    useEffect(() => {
      if (!userClaims) return;
      const idNum = Number.parseInt(userClaims.id);
      setUserId(idNum);
      setRole(userClaims.role as "Admin" | "Employee");
      // si ya hay foto pública usarla como preview
      const existingPhoto = (userClaims as any)?.photoUrl ?? undefined;
      if (existingPhoto && /^https?:\/\//i.test(existingPhoto)) {
        setPreviewFromUrl(existingPhoto);
      } else {
        setPreviewFromUrl(defaultAvatar);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userClaims]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files && e.target.files[0];
      await handleFile(f ?? null);
    };

    const handleOpenModal = () => {
      if (!userClaims) return;
      openModal({ id: Number.parseInt(userClaims.id), role: userClaims.role as "Admin" | "Employee" });
    };

    const handleSave = async () => {
      if (!userClaims) return;
      try {
        await upload(undefined, undefined, async () => {
          // al subir con éxito, recargar info del admin para actualizar la imagen del header
          try {
            if (userClaims.role === 'Admin') {
              const adm = await adminInfo(Number.parseInt(userClaims.id));
              if (adm) setComputedPhoto(adm.photo);
            } else if (userClaims.role === 'Employee') {
              const emp = await employeeInfo(Number.parseInt(userClaims.id));
              if (emp) setComputedPhoto(emp.photoUrl ?? undefined);
            }
          } catch {
            // ignorar fallo al recargar info; preview mantiene cambio temporal
          }
        });
      } catch (err) {
        // el hook gestiona error; aquí solo evitar excepción no manejada
        console.error(err);
      }
    };

  return (
    <div className={Styles.headerContainer}>
        <img
            className={Styles.userImage}
            src={ computedPhoto ?? `https://via.placeholder.com/40?text=${encodeURIComponent((computedName ?? 'U').charAt(0))}` }
            alt="userImage"
        />
        <div className={Styles.userInfo}>
            <h1 className={Styles.userJobPosition}>{computedJobPosition}</h1>
            <div className={Styles.menu}>
                <div className={Styles.userNameContainer}>
                    <h2 className={Styles.userName}>{computedName}</h2>
                    <FaChevronDown className={Styles.iconColor}></FaChevronDown>
                </div>
                <ul  className={Styles.subMenu}>
                    {userClaims?.role === "Employee" && (
                      <li
                        key={"Perfil"}
                        className={Styles.subMenuItem}
                        role="button"
                        tabIndex={0}
                        onClick={() => { navegate(EMPLOYEE_PROFILE_ROUTE); }}
                      >
                        <CgProfile/>Perfil
                      </li>
                    )}
                     <li key={"editPhoto"} className={Styles.subMenuItem} onClick={handleOpenModal} role="button" tabIndex={0}>
                       <CgProfile/>Editar foto
                     </li>
                    <li key={"logout"} className={Styles.subMenuItem} onClick={handleLogout}><LuLogOut/>Cerrar Sesión</li>
                </ul>
            </div>
        </div>

        { /* Modal de edición de foto (renderizado aquí usando el hook) */ }
        {isOpen && (
          <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }} role="dialog" aria-modal="true" aria-label="Editar foto de perfil">
            <div style={{
              background: '#fff', padding: 24, borderRadius: 8, width: 420, maxWidth: '95%',
              boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
            }}>
              <h3>Editar foto de perfil</h3>
              <p>Sube una foto para tu perfil.</p>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <img src={preview || defaultAvatar} alt="Previsualización" style={{
                  width: 120, height: 120, objectFit: 'cover', borderRadius: '50%', border: '1px solid #ddd', marginBottom: 12
                }} />
                <input type="file" accept="image/*" onChange={handleFileChange} aria-label="Seleccionar foto" />
                {error && <p style={{color:'red'}}>{error}</p>}
                <div style={{marginTop:16, display: 'flex', gap: 8, justifyContent: 'center'}}>
                  <button className={AdminStyles.primaryButton} onClick={handleSave} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button className={AdminStyles.secondaryButton} onClick={() => { closeModal(); }} disabled={loading}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Header