import React from 'react';
import type { Vacancy } from '../../../core/entities/Vacancy';
import type { Application } from '../../../core/entities/Application';
import styles from './ApplicationRow.module.css';
import AdminStyles from '../../pages/admins/AdminDashboard.module.css';
import { useNavigate } from 'react-router-dom';

type Props = {
  vacancy?: Vacancy;
  application: Application;
  isAdmin: boolean;
  onWithdraw: (applicationId: number) => Promise<void> | void;
  onViewDetails?: (vacancy: Vacancy | undefined) => void;
};

const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

const ApplicationRow: React.FC<Props> = ({ vacancy, application, isAdmin, onWithdraw, onViewDetails }) => {
  const navigate = useNavigate();

  const handleWithdrawClick = async () => {
    if (!application?.id) return;
    try {
      await onWithdraw(Number(application.id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewDetails = async () => {
    // Navegar a la nueva página de detalle de application
    if (!application?.id) {
      if (onViewDetails) onViewDetails(vacancy);
      return;
    }

    navigate(`/applications/${application.id}`);
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

      <td>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={AdminStyles.secondaryButton} onClick={handleViewDetails}>
            Ver detalles
          </button>

          {!isAdmin && application?.id && (
            <button className={styles.withdrawButton} onClick={handleWithdrawClick} aria-label="Retirar postulación">
              Retirar
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ApplicationRow;