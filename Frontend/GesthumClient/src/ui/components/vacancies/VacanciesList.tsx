import Styles from './VacanciesList.module.css';
import AdminStyles from '../../pages/admins/AdminDashboard.module.css';
import VacancyCard from './VacancyCard';
import { useVacancies } from '../../hooks/vacancies/useVacancies';
import { FaPlus } from 'react-icons/fa';
import type { Vacancy } from '../../../core/entities/Vacancy';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  onCreate?: () => void;
  onViewDetails?: (vacancy: Vacancy) => void;
}

const VacanciesList = ({ onCreate, onViewDetails }: Props) => {
    const { vacancies, loading, error } = useVacancies();
    const { userClaims } = useAuth();

    const handleViewDetails = (vacancy: Vacancy) => {
        if (onViewDetails) {
            onViewDetails(vacancy);
            return;
        }
        console.log('Ver detalles vacante', vacancy.id);
    };

    // Visibilidad decidida por el rol real del usuario (Admin)
    const showCreateButton = userClaims?.role === 'Admin';

    return (
        <div className={Styles.ListContainer}>
            <div className={Styles.headerRow}>
                <h2>Lista de Vacantes</h2>
            </div>

            {showCreateButton && (
              <button
                className={`${AdminStyles.primaryButton} ${Styles.createButtonFixed}`}
                onClick={onCreate}
                aria-label="Crear vacante"
              >
                <FaPlus className={Styles.iconSpacing} />
                Crear Vacante
              </button>
            )}

            {loading ? (
                <div className={Styles.loaderContainer}>
                    <img
                        className={Styles.loaderImg}
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
                        alt="Cargando..."
                    />
                </div>
            ) : (
                <div className={Styles.ListGrid}>
                    {!loading && vacancies.length === 0 && !error && <p>No hay vacantes disponibles.</p>}
                    {error && <p>Error al cargar vacantes: {error}</p>}
                    {vacancies.map(v => (
                        <VacancyCard key={v.id} v={v} handleViewDetails={handleViewDetails}/>
                    ))}
                </div>
            )}
        </div>
    );
}
export default VacanciesList;