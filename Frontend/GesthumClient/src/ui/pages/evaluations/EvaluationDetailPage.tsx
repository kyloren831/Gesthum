import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import LayoutStyles from '../admins/AdminDashboard.module.css';
import ResumeStyles from '../resumes/ResumesPage.module.css';
import type { Evaluation } from '../../../core/entities/Evaluation';
import { useGetEvaluationByApplicationId } from '../../hooks/evaluations/useGetEvaluationByApplicationId';

const EvaluationDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { evaluation?: Evaluation; applicationId?: number } | null;
  const evaluationFromState = state?.evaluation;
  const applicationIdFromState = state?.applicationId ?? state?.evaluation?.applicationId;

  const { evaluation, loading, error, fetchEvaluation } = useGetEvaluationByApplicationId();

  // Si no viene la evaluación completa por state, la traemos del backend usando applicationId
  useEffect(() => {
    if (!evaluationFromState && applicationIdFromState) {
      void fetchEvaluation(applicationIdFromState).catch((err: any) => {
        console.error('Error fetching evaluation:', err);
        alert('Error al obtener la evaluación: ' + (err?.message ?? 'Error desconocido'));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluationFromState, applicationIdFromState, fetchEvaluation]);

  const evalToShow = evaluationFromState ?? evaluation;

  return (
    <div className={LayoutStyles.body}>
      <div className={LayoutStyles.pageLayout}>
        <Sidebar />
        <div className={LayoutStyles.contentArea}>
          <Header />
          <main className={LayoutStyles.mainContent}>
            <div style={{ marginBottom: 12, color: '#6b7280', fontSize: 13 }}>
              Evaluaciones &gt; Detalle de evaluación
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Detalle de la evaluación #{evalToShow?.id ?? ''}</h2>
              <div>
                <button className={LayoutStyles.secondaryButton} onClick={() => navigate(-1)} aria-label="Volver">
                  ← Volver
                </button>
              </div>
            </div>

            {loading ? (
              <div className={ResumeStyles.message}>Cargando evaluación...</div>
            ) : error ? (
              <div className={ResumeStyles.error}>Error: {error}</div>
            ) : !evalToShow ? (
              <div className={ResumeStyles.message}>No hay detalle de evaluación disponible. Vuelve desde la creación para ver el resultado o pasa applicationId por state.</div>
            ) : (
              <section className={ResumeStyles.card}>
                <h2 className={ResumeStyles.cardTitle}>Resultado</h2>
                <div className={ResumeStyles.grid}>
                  <div className={ResumeStyles.field}>
                    <span className={ResumeStyles.label}>Resultado</span>
                    <span className={ResumeStyles.value}>{evalToShow.result}</span>
                  </div>

                  <div className={ResumeStyles.field}>
                    <span className={ResumeStyles.label}>Puntaje</span>
                    <span className={ResumeStyles.value}>{evalToShow.score}</span>
                  </div>

                  <div className={ResumeStyles.fieldFull}>
                    <span className={ResumeStyles.label}>Comentarios</span>
                    <p className={ResumeStyles.value}>{evalToShow.comments}</p>
                  </div>

                  <div className={ResumeStyles.fieldFull}>
                    <span className={ResumeStyles.label}>Fortalezas</span>
                    <p className={ResumeStyles.value}>{evalToShow.strengths}</p>
                  </div>

                  <div className={ResumeStyles.fieldFull}>
                    <span className={ResumeStyles.label}>Debilidades</span>
                    <p className={ResumeStyles.value}>{evalToShow.weaknesses}</p>
                  </div>

                  {evalToShow.reasons && (
                    <div className={ResumeStyles.fieldFull}>
                      <span className={ResumeStyles.label}>Razones (auditoría)</span>
                      <p className={ResumeStyles.value}>{evalToShow.reasons}</p>
                    </div>
                  )}

                  <div className={ResumeStyles.field}>
                    <span className={ResumeStyles.label}>Fecha</span>
                    <span className={ResumeStyles.value}>{new Date(evalToShow.evaluationDate).toLocaleString()}</span>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetailPage;