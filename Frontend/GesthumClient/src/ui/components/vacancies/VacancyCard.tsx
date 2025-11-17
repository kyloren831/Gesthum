import type { Vacancy } from '../../../core/entities/Vacancy';
import Styles from './VacancyCard.module.css';

type VacancyProps = {
    key: number;
    v: Vacancy;
    handleViewDetails: (vacancy: Vacancy) => void;
};


const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const VacancyCard = ({ v, handleViewDetails, key }: VacancyProps ) => {
    return (
        <div className={Styles.VacancyCard} key={key}>
            <div className={Styles.CardHeader}>
                <h3 className={Styles.Title}>{v.title}</h3>
                <span
                    className={`${Styles.StatusBadge} ${v.state ? Styles.Open : Styles.Closed}`}
                    aria-label={`Estado: ${v.state ? 'Abierta' : 'Cerrada'}`}
                >
                    {v.state ? 'Abierta' : 'Cerrada'}
                </span>
            </div>

            <div className={Styles.Section}>
                <p className={Styles.Label}><strong>Descripción:</strong></p>
                <p className={Styles.Clamp3} aria-label={`Descripción de ${v.title}`}>{v.description}</p>
            </div>

            <div className={Styles.Section}>
                <p className={Styles.Label}><strong>Requisitos:</strong></p>
                <p className={Styles.Clamp3} aria-label={`Requisitos de ${v.title}`}>{v.requirements}</p>
            </div>

            <p className={Styles.Meta}><strong>Ubicación:</strong> {v.location}</p>
            <p className={Styles.Meta}>
                <strong>Publicado:</strong> {formatDate(v.postedDate)} &nbsp;|&nbsp;
                <strong>Cierra:</strong> {formatDate(v.closeDate)}
            </p>


            <button
                className={Styles.secondaryButton}
                onClick={() => handleViewDetails(v)}
                aria-label={`Ver detalles de la vacante ${v.title}`}
            >
                Ver detalles de la vacante
            </button>
        </div>
    );
};

export default VacancyCard;   