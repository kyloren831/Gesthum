import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import LayoutStyles from '../../pages/admins/AdminDashboard.module.css';
import Styles from './ResumesPage.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useGetResume } from '../../hooks/resumes/useGetResume';
import { useUserInfo } from '../../hooks/useUserInfo';
import type { Employee } from '../../../core/entities/Employee';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useDeleteResume } from '../../hooks/resumes/useDeleteResume';

const generateInitialAvatar = (initial: string, size = 96) => {
  const bg = '#e5e7eb';
  const fg = '#111827';
  const fontSize = Math.round(size * 0.5);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='100%' height='100%' fill='${bg}' rx='12' ry='12'/><text x='50%' y='50%' font-family='Arial, Helvetica, sans-serif' font-size='${fontSize}' fill='${fg}' dominant-baseline='middle' text-anchor='middle'>${initial}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const ResumesPage: React.FC = () => {
  const navigate = useNavigate();
  const { userClaims } = useAuth();
  const employeeId = userClaims && userClaims.role === 'Employee' ? Number.parseInt(userClaims.id) : undefined;
  const { resume, loading, error, fetchResume } = useGetResume(employeeId);

  const { employeeInfo } = useUserInfo();
  const [employee, setEmployee] = useState<Employee | undefined>(undefined);

  // Delete hook
  const { loading: deleting, error: deleteError, fetchDeleteResume } = useDeleteResume();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [opError, setOpError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!userClaims || userClaims.role !== 'Employee') return;
      try {
        const emp = await employeeInfo(Number.parseInt(userClaims.id));
        setEmployee(emp);
      } catch {
        setEmployee(undefined);
      }
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userClaims]);

  const handleCreate = () => navigate('/resumes/create');
  const handleUpdate = () => {
    if (!resume) return;
    // navegar a la misma ruta de creación pero con estado para edición
    navigate('/resumes/create', { state: { mode: 'edit', resume } });
  };

  const openDeleteConfirm = () => {
    setOpError(null);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setOpError(null);
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    if (!resume) return;
    try {
      setOpError(null);
      await fetchDeleteResume(resume.id);
      // refrescar el resume (podría quedar desactivado o eliminado)
      await fetchResume(employeeId);
      setShowDeleteConfirm(false);
    } catch (err: any) {
      const msg = err?.message ?? 'Error al eliminar el CV';
      setOpError(msg);
    }
  };

  const isNotFoundError = !!error && error.includes('Get Resume by Employee ID failed');

  return (
    <div className={LayoutStyles.body}>
      <div className={LayoutStyles.pageLayout}>
        <Sidebar />
        <div className={LayoutStyles.contentArea}>
          <Header name={employee?.name} photo={employee?.photoUrl} />
          <main className={LayoutStyles.mainContent}>
            <div style={{ marginBottom: 12, color: '#6b7280', fontSize: 13 }}>Currículum &gt; Mi CV</div>
            <div className={Styles.titleRow}>
              <h2 className={Styles.pageTitle}>Mi CV</h2>

              <div className={Styles.actionsRow}>
                {/* Mostrar crear/actualizar según el estado (se mantiene la UX previa) */}
                <button
                  className={`${LayoutStyles.secondaryButton} ${Styles.actionBtn}`}
                  onClick={handleUpdate}
                  aria-label="Actualizar currículum"
                >
                  <FaEdit />
                  Actualizar CV
                </button>

                <button
                  className={`${LayoutStyles.primaryButton} ${Styles.createButtonInline}`}
                  onClick={handleCreate}
                  aria-label="Crear currículum"
                >
                  <FaPlus />
                  Crear CV
                </button>

                {/* Botón para eliminar sólo si existe un resume */}
                {resume && (
                  <button
                    className={`${LayoutStyles.secondaryButton} ${Styles.actionBtn}`}
                    onClick={openDeleteConfirm}
                    aria-label="Eliminar currículum"
                    disabled={deleting}
                    style={{ marginLeft: 8 }}
                  >
                    <FaTrash />
                    Eliminar CV
                  </button>
                )}
              </div>
            </div>

            {employee && (
              <section className={Styles.card}>
                <div className={Styles.profileHeader}>
                  <img
                    className={Styles.avatar}
                    src={employee.photoUrl ?? generateInitialAvatar((employee.name ?? 'U').charAt(0), 96)}
                    alt="Foto de perfil"
                  />
                  <div>
                    <h2 className={Styles.name}>{employee.name}</h2>
                    <p className={Styles.position}>{employee.position ?? ''}{employee.department ? `, ${employee.department}` : ''}</p>
                  </div>
                </div>
              </section>
            )}

            {loading && <div className={Styles.message}>Cargando CV...</div>}

            {!loading && isNotFoundError && !resume && (
              <div className={Styles.message}>
                No se encontró ningún CV activo para este usuario.
                <div style={{ marginTop: 12 }}>
                  <button
                    className={`${LayoutStyles.primaryButton} ${Styles.createButtonInline}`}
                    onClick={handleCreate}
                    aria-label="Crear currículum"
                  >
                    <FaPlus className={Styles.iconSpacing} />
                    Crear CV
                  </button>
                </div>
              </div>
            )}

            {!loading && error && !isNotFoundError && (
              <div className={Styles.error}>Error: {error}</div>
            )}

            {!loading && !error && !resume && (
              <div className={Styles.message}>
                No se encontró ningún CV activo para este usuario.
                <div style={{ marginTop: 12 }}>
                  <button
                    className={`${LayoutStyles.primaryButton} ${Styles.createButtonInline}`}
                    onClick={handleCreate}
                    aria-label="Crear currículum"
                  >
                    <FaPlus className={Styles.iconSpacing} />
                    Crear CV
                  </button>
                </div>
              </div>
            )}

            {resume && (
              <>
                <section className={Styles.card}>
                  <h2 className={Styles.cardTitle}>Resumen</h2>
                  <div className={Styles.grid}>
                    <div className={Styles.fieldFull}>
                      <span className={Styles.label}>Perfil</span>
                      <p className={Styles.value}>{resume.profileSummary}</p>
                    </div>

                    <div className={Styles.field}>
                      <span className={Styles.label}>Formación Académica</span>
                      <span className={Styles.value}>{resume.academicTraining}</span>
                    </div>

                    <div className={Styles.field}>
                      <span className={Styles.label}>Habilidades</span>
                      <span className={Styles.value}>{resume.skills}</span>
                    </div>

                    <div className={Styles.field}>
                      <span className={Styles.label}>Idiomas</span>
                      <span className={Styles.value}>{resume.languages}</span>
                    </div>

                    <div className={Styles.field}>
                      <span className={Styles.label}>Creado</span>
                      <span className={Styles.value}>{new Date(resume.creationDate).toLocaleString()}</span>
                    </div>
                  </div>
                </section>

                <section className={Styles.card}>
                  <h2 className={Styles.cardTitle}>Experiencia Laboral</h2>
                                  {resume.WorkExpList && resume.WorkExpList.length > 0 ? (
                    <ul className={Styles.workList}>
                                          {resume.WorkExpList.map((w) => (
                        <li key={w.id} className={Styles.workItem}>
                          <div className={Styles.workHeader}>
                            <strong>{w.position}</strong> — <span className={Styles.company}>{w.companyName}</span>
                          </div>
                          <div className={Styles.workMeta}>
                            <span>{new Date(w.startDate).toLocaleDateString()}</span>
                            {' — '}
                            <span>{w.endDate ? new Date(w.endDate).toLocaleDateString() : 'Actual'}</span>
                          </div>
                          <p className={Styles.workDescription}>{w.description}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={Styles.message}>No hay experiencia laboral registrada.</p>
                  )}
                </section>
              </>
            )}

            {/* Modal de confirmación eliminación */}
            {showDeleteConfirm && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 1000
              }}>
                <div style={{
                  background: '#fff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '420px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.2)', textAlign: 'center'
                }}>
                  <h3>Eliminar CV</h3>
                  <p>¿Está seguro de que desea eliminar su currículum? Si existen aplicaciones asociadas, el CV se desactivará en lugar de eliminarse.</p>

                  {(opError || deleteError) && <p style={{ color: '#b91c1c' }}>Error: {opError ?? deleteError}</p>}

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                    <button
                      onClick={closeDeleteConfirm}
                      className={LayoutStyles.secondaryButton}
                      disabled={deleting}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className={LayoutStyles.primaryButton}
                      disabled={deleting}
                      aria-disabled={deleting}
                    >
                      {deleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
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

export default ResumesPage;