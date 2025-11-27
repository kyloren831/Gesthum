import React, { useState } from 'react';
import Styles from './VacancyDetail.module.css';
import AdminStyles from '../../pages/admins/AdminDashboard.module.css';
import type { Vacancy } from '../../../core/entities/Vacancy';
import { useAuth } from '../../hooks/useAuth';
import { FaMapMarkerAlt, FaCalendarAlt, FaPaperPlane } from 'react-icons/fa';
import { useCreateApplication } from '../../hooks/applications/useCreateApplication';

type Props = {
  vacancy: Vacancy;
  onApply?: (vacancyId: number) => Promise<void> | void;
  onEdit?: (vacancy: Vacancy) => void;
  // nuevos props opcionales para mostrar estado/evaluación cuando venga desde Applications
  applicationStatus?: string | null;
  applicationId?: number | null;
  // callback para ver la evaluación desde el padre (si se proporciona)
  onViewEvaluation?: (applicationId: number) => void;
  // callback para generar la evaluación desde el padre (si se proporciona)
  onGenerateEvaluation?: (applicationId: number) => Promise<void> | void;
};

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

const VacancyDetail: React.FC<Props> = ({ vacancy, onApply, onEdit, applicationStatus = null, applicationId = null, onViewEvaluation, onGenerateEvaluation }) => {
  const { userClaims } = useAuth();
  const isAdmin = userClaims?.role === 'Admin';

  const { createApplication, loading } = useCreateApplication();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const inApplicationContext = Boolean(applicationId); // detecta apertura desde ApplicationDetailPage

  const handleEdit = () => {
    if (onEdit) onEdit(vacancy);
  };

  const handleApplyClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApply = async () => {
    if (!userClaims) {
      alert('Debes estar autenticado para postularte.');
      setShowConfirmModal(false);
      return;
    }

    const employeeId = Number(userClaims.id);
    if (Number.isNaN(employeeId)) {
      alert('ID de empleado inválido.');
      setShowConfirmModal(false);
      return;
    }

    try {
      const payload = { employeeId, vacantId: vacancy.id };
      console.debug('Enviando aplicación:', payload);
      await createApplication(payload);
      if (onApply) {
        try {
          await onApply(vacancy.id);
        } catch (e) {
          console.error('onApply callback falló:', e);
        }
      }
      alert('Postulación completada correctamente.');
    } catch (err: any) {
      console.error(err);
      alert('Error al postular: ' + (err?.message ?? 'No se pudo completar la postulación'));
    } finally {
      setShowConfirmModal(false);
    }
  };

  // comportamiento antiguo: botón "Postularme" sólo para employees y si la vacante está activa
  const showApplyButton = userClaims?.role === 'Employee' && vacancy.state && !inApplicationContext;

  // intentar convertir requisitos en lista si vienen separados por saltos de línea
  const requirementsList = vacancy.requirements
    ? vacancy.requirements.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    : [];

  // en contexto de aplicación (ApplicationDetailPage) mostramos botones IA según rol:
  // - Admin: "Generar evaluación IA" (primary) + "Ver evaluación IA" (secondary)
  // - Employee: sólo "Ver evaluación IA" (secondary)
  const handleGenerateEvaluation = async () => {
    if (!applicationId) {
      alert('No hay identificación de solicitud disponible para generar la evaluación.');
      return;
    }
    // Si el padre proporcionó callback, delegar en él (ese callback debe crear y navegar)
    if (onGenerateEvaluation) {
      try {
        await onGenerateEvaluation(applicationId);
      } catch (err: any) {
        console.error('onGenerateEvaluation falló:', err);
        alert('Error al generar la evaluación: ' + (err?.message ?? 'Error desconocido'));
      }
      return;
    }

    console.log('Generar evaluación IA para application', applicationId);
    // fallback local (comportamiento actual mínimo)
    alert('Solicitud de generación de evaluación IA enviada.');
  };

  const handleViewEvaluationIA = () => {
    if (!applicationId) {
      console.log('No hay applicationId para ver evaluación IA');
      alert('No hay identificación de solicitud disponible para ver la evaluación.');
      return;
    }
    // Si el padre proporcionó callback, delegar en él para manejar navegación
    if (onViewEvaluation) {
      onViewEvaluation(applicationId);
      return;
    }
    console.log('Ver evaluación IA para application', applicationId);
    // comportamiento por defecto si no hay callback
    alert('Abrir vista de evaluación IA (pendiente implementar navegación).');
  };

  const showEvaluationButton = applicationStatus === 'Passed' || applicationStatus === 'Failed';

  const handleViewEvaluation = () => {
    if (!applicationId) return;
    if (onViewEvaluation) {
      onViewEvaluation(applicationId);
      return;
    }
    console.log('Ver evaluación para application', applicationId);
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.headerRow}>
        {/* ocultar breadcrumb cuando el componente se abre desde ApplicationDetailPage */}
        {!inApplicationContext && <div className={Styles.breadcrumb}>Vacantes &gt; {vacancy.title}</div>}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Ocultar botón Editar también cuando venimos desde ApplicationDetailPage */}
          {isAdmin && !inApplicationContext && (
            <button
              className={AdminStyles.primaryButton}
              onClick={handleEdit}
              aria-label={`Editar vacante ${vacancy.title}`}
            >
              Editar
            </button>
          )}

          {/* Si venimos desde ApplicationDetailPage, mostrar botones IA según rol */}
          {inApplicationContext ? (
            <>
              {isAdmin && (
                <>
                  <button
                    className={AdminStyles.primaryButton}
                    onClick={handleGenerateEvaluation}
                    aria-label="Generar evaluación IA"
                  >
                    Generar evaluación IA
                  </button>
                  <button
                    className={AdminStyles.secondaryButton}
                    onClick={handleViewEvaluationIA}
                    style={{ marginLeft: 8 }}
                    aria-label="Ver evaluación IA"
                  >
                    Ver evaluación IA
                  </button>
                </>
              )}

              {!isAdmin && userClaims?.role === 'Employee' && (
                <button
                  className={AdminStyles.secondaryButton}
                  onClick={handleViewEvaluationIA}
                  aria-label="Ver evaluación IA"
                >
                  Ver evaluación IA
                </button>
              )}
            </>
          ) : (
            // comportamiento original fuera del contexto de ApplicationDetailPage
            <>
              {showApplyButton && (
                <button className={Styles.applyButton} onClick={handleApplyClick} aria-label="Postularme">
                  <FaPaperPlane className={Styles.applyIcon} />
                  Postularme
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <h1 className={Styles.title}>{vacancy.title}</h1>
      <div className={Styles.subtitle}>{vacancy.location}</div>

      {/* Mostrar estado de aplicación si viene */}
      {applicationStatus && (
        <div style={{ margin: '8px 0' }}>
          <strong>Estado de tu solicitud:</strong>
          <span style={{ marginLeft: 8 }} className={applicationStatus === 'Passed' ? Styles.passedLabel : applicationStatus === 'Failed' ? Styles.failedLabel : ''}>
            {applicationStatus}
          </span>
        </div>
      )}

      <div className={Styles.infoCards}>
        <div className={`${Styles.infoCard} ${Styles.infoCardPublished}`}>
          <FaCalendarAlt className={Styles.infoIcon} />
          <div className={Styles.infoText}>
            <div className={Styles.infoLabel}>Fecha de publicación</div>
            <div className={`${Styles.infoValue} ${Styles.published}`}>{formatDate(vacancy.postedDate)}</div>
          </div>
        </div>

        <div className={`${Styles.infoCard} ${Styles.infoCardClose}`}>
          <FaCalendarAlt className={`${Styles.infoIcon} ${Styles.closeIcon}`} />
          <div className={Styles.infoText}>
            <div className={Styles.infoLabel}>Fecha de cierre</div>
            <div className={`${Styles.infoValue} ${Styles.close}`}>{formatDate(vacancy.closeDate)}</div>
          </div>
        </div>

        <div className={Styles.infoCard}>
          <FaMapMarkerAlt className={Styles.infoIcon} />
          <div className={Styles.infoText}>
            <div className={Styles.infoLabel}>Ubicación</div>
            <div className={Styles.infoValue}>{vacancy.location}</div>
          </div>
        </div>
      </div>

      <section className={Styles.contentCard}>
        <h3 className={Styles.sectionTitle}>Descripción Completa</h3>
        <p className={Styles.paragraph}>{vacancy.description}</p>
      </section>

      <section className={Styles.contentCard}>
        <h3 className={Styles.sectionTitle}>Requisitos Detallados</h3>
        {requirementsList.length > 0 ? (
          <ul className={Styles.requirementsList}>
            {requirementsList.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        ) : (
          <p className={Styles.paragraph}>{vacancy.requirements}</p>
        )}
      </section>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar postulación"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <div
            style={{
              width: 520,
              maxWidth: '95%',
              background: 'white',
              borderRadius: 8,
              padding: 20,
              boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Confirmar postulación</h2>
            <p>
              Vas a postularte a la vacante <strong>{vacancy.title}</strong> con el CV que tengas activo. ¿Deseas
              continuar?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className={AdminStyles.secondaryButton}
                style={{ minWidth: 120 }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmApply}
                disabled={loading}
                className={AdminStyles.primaryButton}
                style={{ minWidth: 120 }}
              >
                {loading ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacancyDetail;