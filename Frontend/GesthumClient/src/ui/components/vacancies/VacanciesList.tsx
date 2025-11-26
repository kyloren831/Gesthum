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
  onEdit?: (vacancy: Vacancy) => void;
}

const VacanciesList = ({ onCreate, onViewDetails, onEdit }: Props) => {
    const { vacancies, loading, error } = useVacancies();
    const { userClaims } = useAuth();

    const handleViewDetails = (vacancy: Vacancy) => {
        if (onViewDetails) {
            onViewDetails(vacancy);
            return;
        }
        console.log('Ver detalles vacante', vacancy.id);
    };

    const handleEdit = (vacancy: Vacancy) => {
        if (onEdit) onEdit(vacancy);
    };

    // Visibilidad decidida por el rol real del usuario (Admin)
    const showCreateButton = userClaims?.role === 'Admin';

    // Si el usuario es Employee, mostrar solo vacantes activas
    const visibleVacancies = userClaims?.role === 'Employee'
      ? vacancies.filter(v => v.state)
      : vacancies;

    return (
        <div className={Styles.ListContainer}>
            <div style={{ marginBottom: 12, color: '#6b7280', fontSize: 13 }}>
                Vacantes &gt; Lista
            </div>
            <div className={Styles.headerRow}>
                <h2>Vacantes</h2>
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
                    {!loading && visibleVacancies.length === 0 && !error && (
                      <p>{userClaims?.role === 'Employee' ? 'No hay vacantes activas.' : 'No hay vacantes disponibles.'}</p>
                    )}
                    {error && <p>Error al cargar vacantes: {error}</p>}
                    {visibleVacancies.map(v => (
                        <VacancyCard key={v.id} v={v} handleViewDetails={handleViewDetails} onEdit={handleEdit} />
                    ))}
                </div>
            )}
        </div>
    );
}
export default VacanciesList;