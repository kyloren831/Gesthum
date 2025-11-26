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
};

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

const VacancyDetail: React.FC<Props> = ({ vacancy, onApply, onEdit }) => {
  const { userClaims } = useAuth();
  const isAdmin = userClaims?.role === 'Admin';

  const { createApplication, loading } = useCreateApplication();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      // notificar al padre si lo desea
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

  const showApplyButton = userClaims?.role === 'Employee' && vacancy.state;

  // intentar convertir requisitos en lista si vienen separados por saltos de línea
  const requirementsList = vacancy.requirements
    ? vacancy.requirements.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className={Styles.container}>
      <div className={Styles.headerRow}>
        <div className={Styles.breadcrumb}>Vacantes &gt; {vacancy.title}</div>

        {/* Acciones: editar para Admin, postular para Employee */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isAdmin && (
            <button
              className={AdminStyles.primaryButton}
              onClick={handleEdit}
              aria-label={`Editar vacante ${vacancy.title}`}
            >
              Editar
            </button>
          )}

          {showApplyButton && (
            <button className={Styles.applyButton} onClick={handleApplyClick} aria-label="Postularme">
              <FaPaperPlane className={Styles.applyIcon} />
              Postularme
            </button>
          )}
        </div>
      </div>

      <h1 className={Styles.title}>{vacancy.title}</h1>
      <div className={Styles.subtitle}>{vacancy.location}</div>

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