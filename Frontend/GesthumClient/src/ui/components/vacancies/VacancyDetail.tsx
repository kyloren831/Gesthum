import React from 'react';
import Styles from './VacancyDetail.module.css';
import type { Vacancy } from '../../../core/entities/Vacancy';
import { useAuth } from '../../hooks/useAuth';
import { FaMapMarkerAlt, FaCalendarAlt, FaPaperPlane } from 'react-icons/fa';

type Props = {
  vacancy: Vacancy;
  onApply?: (vacancyId: number) => Promise<void> | void;
};

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

const VacancyDetail: React.FC<Props> = ({ vacancy, onApply }) => {
  const { userClaims } = useAuth();

  const handleApply = async () => {
    try {
      if (onApply) await onApply(vacancy.id);
      else console.log('Aplicar a vacante', vacancy.id);
    } catch (e) {
      console.error(e);
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
        {showApplyButton && (
          <button className={Styles.applyButton} onClick={handleApply} aria-label="Postularme">
            <FaPaperPlane className={Styles.applyIcon} />
            Postularme
          </button>
        )}
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
    </div>
  );
};

export default VacancyDetail;