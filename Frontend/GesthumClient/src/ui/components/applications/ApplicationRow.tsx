import React from 'react';
import type { Vacancy } from '../../../core/entities/Vacancy';
import type { Application } from '../../../core/entities/Application';
import styles from './ApplicationRow.module.css';
import AdminStyles from '../../pages/admins/AdminDashboard.module.css';

type Props = {
  vacancy?: Vacancy;
  application: Application;
  isAdmin: boolean;
  onWithdraw: (applicationId: number) => Promise<void> | void;
  onViewDetails?: (vacancy: Vacancy | undefined) => void;
};

const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

const ApplicationRow: React.FC<Props> = ({ vacancy, application, isAdmin, onWithdraw, onViewDetails }) => {
  const handleWithdrawClick = async () => {
    if (!application?.id) return;
    try {
      await onWithdraw(Number(application.id));
    } catch (e) {
      console.error(e);
    }
  };

  // Algunos DTOs pueden usar resumeId en vez de employeeId; intentar ambos
  const applicantIdentifier = (application as any).employeeId ?? (application as any).resumeId ?? '';

  return (
    <tr className={styles.row}>
      <td>{String(application.id)}</td>

      <td>{String(application.vacancyId)}</td>

      <td className={styles.colTitle}>
        <div className={styles.title}>{vacancy ? vacancy.title : '—'}</div>
        <div className={styles.desc} aria-hidden>{vacancy?.description?.slice(0, 100)}{vacancy?.description && vacancy.description.length > 100 ? '…' : ''}</div>
      </td>

      <td>{applicantIdentifier}</td>

      <td className={styles.colLocation}>{vacancy?.location ?? '—'}</td>

      <td>{formatDate(vacancy?.postedDate)}</td>

      <td>{formatDate(vacancy?.closeDate)}</td>

      <td>
        <span className={`${styles.badge} ${vacancy?.state ? styles.open : styles.closed}`}>
          {vacancy?.state ? 'Abierta' : 'Cerrada'}
        </span>
      </td>

      {!isAdmin && (
        <td>
          {application ? (
            <div>
              <div className={styles.appStatus}>{application.status}</div>
              <div className={styles.appDate}>{formatDate(application.applicationDate)}</div>
            </div>
          ) : (
            <div className={styles.muted}>—</div>
          )}
        </td>
      )}

      <td>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={AdminStyles.secondaryButton} onClick={() => onViewDetails ? onViewDetails(vacancy) : console.log('Ver', vacancy?.id)}>
            Ver detalles
          </button>

          {isAdmin ? (
            <button className={AdminStyles.primaryButton} onClick={() => console.log('Editar vacante', vacancy?.id)}>
              Editar
            </button>
          ) : (
            application?.id && (
              <button className={styles.withdrawButton} onClick={handleWithdrawClick} aria-label="Retirar postulación">
                Retirar
              </button>
            )
          )}
        </div>
      </td>
    </tr>
  );
};

export default ApplicationRow;