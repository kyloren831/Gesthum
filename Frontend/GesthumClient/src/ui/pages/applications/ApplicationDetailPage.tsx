import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import LayoutStyles from '../admins/AdminDashboard.module.css';
import ResumeStyles from '../resumes/ResumesPage.module.css';
import VacancyDetail from '../../components/vacancies/VacancyDetail';
import { useGetApplicationById } from '../../hooks/applications/useGetApplicationById';
import { FaEdit } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useCreateEvaluation } from '../../hooks/evaluations/useCreateEvaluation';

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userClaims } = useAuth();
  const { application, resume, vacancy, loading, error, fetchApplication } = useGetApplicationById();
  const { createEvaluation, loading: creatingEvaluation } = useCreateEvaluation();

  useEffect(() => {
    if (!id) return;
    void fetchApplication(Number(id));
  }, [id, fetchApplication]);

  const goBack = () => navigate(-1);

  // ahora acepta applicationId opcional para poder ser llamado desde el hijo
  const handleCreateEvaluation = async (applicationIdParam?: number) => {
    const appId = applicationIdParam ?? application?.id;
    if (!appId) {
      alert('No hay id de solicitud disponible para crear la evaluación.');
      return;
    }
    if (!userClaims || userClaims.role !== 'Admin') {
      alert('Solo administradores pueden crear evaluaciones.');
      return;
    }
    try {
      const evalResult = await createEvaluation(appId);
      if (evalResult) {
        // navegar a la página de detalle de evaluación pasando el objeto creado por state
        navigate('/evaluations/detail', { state: { evaluation: evalResult, applicationId: appId } });
      } else {
        alert('Evaluación creada pero no se recibió el detalle desde el servidor.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error al crear la evaluación: ' + (err?.message ?? 'Error desconocido'));
    }
  };

  const handleViewEvaluation = (applicationId: number) => {
    // navegar a la página de detalle de evaluación pasando applicationId en state
    navigate('/evaluations/detail', { state: { applicationId } });
  };

  return (
    <div className={LayoutStyles.body}>
      <div className={LayoutStyles.pageLayout}>
        <Sidebar />
        <div className={LayoutStyles.contentArea}>
          <Header />
          <main className={LayoutStyles.mainContent}>
            <div style={{ marginBottom: 12, color: '#6b7280', fontSize: 13 }}>
              Solicitudes &gt; Detalle de solicitud
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Detalle de la solicitud #{application?.id ?? id}</h2>
              <div>
                <button className={LayoutStyles.secondaryButton} onClick={goBack} aria-label="Volver">
                  ← Volver
                </button>
               
              </div>
            </div>

            {/* Vacancy detail (reutiliza componente existente, pasando estado/ids de la application) */}
            {vacancy ? (
              <div style={{ marginBottom: 20 }}>
                <VacancyDetail
                  vacancy={vacancy}
                  applicationStatus={application?.status ?? null}
                  applicationId={application?.id ?? null}
                  onViewEvaluation={handleViewEvaluation}
                  onGenerateEvaluation={handleCreateEvaluation}
                />
              </div>
            ) : (
              <div style={{ marginBottom: 20, color: '#6b7280' }}>Cargando datos de la vacante...</div>
            )}

            {/* Resume section usando estilos de ResumesPage */}
            <section className={ResumeStyles.card}>
              <h2 className={ResumeStyles.cardTitle}>Currículum asociado</h2>
              {loading && <div className={ResumeStyles.message}>Cargando...</div>}
              {error && <div className={ResumeStyles.error}>Error: {error}</div>}
              {!loading && !resume && <div className={ResumeStyles.message}>No se encontró el CV asociado.</div>}
              {!loading && resume && (
                <>
                  <div className={ResumeStyles.grid}>
                    <div className={ResumeStyles.fieldFull}>
                      <span className={ResumeStyles.label}>Perfil</span>
                      <p className={ResumeStyles.value}>{resume.profileSummary}</p>
                    </div>

                    <div className={ResumeStyles.field}>
                      <span className={ResumeStyles.label}>Formación Académica</span>
                      <span className={ResumeStyles.value}>{resume.academicTraining}</span>
                    </div>

                    <div className={ResumeStyles.field}>
                      <span className={ResumeStyles.label}>Habilidades</span>
                      <span className={ResumeStyles.value}>{resume.skills}</span>
                    </div>

                    <div className={ResumeStyles.field}>
                      <span className={ResumeStyles.label}>Idiomas</span>
                      <span className={ResumeStyles.value}>{resume.languages}</span>
                    </div>

                    <div className={ResumeStyles.field}>
                      <span className={ResumeStyles.label}>Creado</span>
                      <span className={ResumeStyles.value}>{new Date(resume.creationDate).toLocaleString()}</span>
                    </div>
                  </div>

                  <section className={ResumeStyles.card} style={{ marginTop: 16 }}>
                    <h3 className={ResumeStyles.cardTitle}>Experiencia Laboral</h3>
                    {resume.WorkExpList && resume.WorkExpList.length > 0 ? (
                      <ul className={ResumeStyles.workList}>
                        {resume.WorkExpList.map((w: any) => (
                          <li key={w.id} className={ResumeStyles.workItem}>
                            <div className={ResumeStyles.workHeader}>
                              <strong>{w.position}</strong> — <span className={ResumeStyles.company}>{w.companyName}</span>
                            </div>
                            <div className={ResumeStyles.workMeta}>
                              <span>{new Date(w.startDate).toLocaleDateString()}</span>
                              {' — '}
                              <span>{w.endDate ? new Date(w.endDate).toLocaleDateString() : 'Actual'}</span>
                            </div>
                            <p className={ResumeStyles.workDescription}>{w.description}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={ResumeStyles.message}>No hay experiencia laboral registrada.</p>
                    )}
                  </section>
                </>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;