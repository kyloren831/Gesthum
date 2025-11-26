import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from '../../pages/vacancies/CreateVacancy.module.css';
import AdminStyles from '../../pages/admins/AdminDashboard.module.css';
import { CreateVacancie } from '../../hooks/vacancies/createVacancie';
import { useUpdateVacancy } from '../../hooks/vacancies/useUpdateVacancy';
import type { VacancyDto } from '../../../data/dtos/VacancyDto';
import type { Vacancy } from '../../../core/entities/Vacancy';

interface Props {
  onCancel: () => void;
  onSaved?: () => void;
  mode?: 'create' | 'edit';
  initialVacancy?: Vacancy | null;
}

const CreateVacancyForm = ({ onCancel, onSaved, mode = 'create', initialVacancy = null }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [postedDate, setPostedDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [state, setState] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { createVacancie, loading: creating, error: createError } = CreateVacancie();
  const { updateVacancy, loading: updating, error: updateError } = useUpdateVacancy();

  // precargar datos si venimos en modo edit
  useEffect(() => {
    if (initialVacancy) {
      setTitle(initialVacancy.title ?? '');
      setDescription(initialVacancy.description ?? '');
      setRequirements(initialVacancy.requirements ?? '');
      setLocation(initialVacancy.location ?? '');
      setPostedDate(initialVacancy.postedDate ? new Date(initialVacancy.postedDate).toISOString().slice(0,16) : '');
      setCloseDate(initialVacancy.closeDate ? new Date(initialVacancy.closeDate).toISOString().slice(0,16) : '');
      setState(initialVacancy.state ?? true);
    } else {
      // limpiar cuando no hay vacante inicial
      setTitle('');
      setDescription('');
      setRequirements('');
      setLocation('');
      setPostedDate('');
      setCloseDate('');
      setState(true);
    }
  }, [initialVacancy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const vacancyDto: VacancyDto = {
      title,
      description,
      requirements,
      location,
      postedDate: postedDate ? new Date(postedDate).toISOString() : new Date().toISOString(),
      closeDate: new Date(closeDate).toISOString(),
      state,
    };

    try {
      if (mode === 'edit' && initialVacancy) {
        // construir objeto Vacancy para update
        const updated: Vacancy = {
          id: initialVacancy.id,
          title: vacancyDto.title,
          description: vacancyDto.description,
          requirements: vacancyDto.requirements,
          location: vacancyDto.location,
          postedDate: vacancyDto.postedDate,
          closeDate: vacancyDto.closeDate,
          state: vacancyDto.state,
        };
        await updateVacancy(initialVacancy.id, updated);
      } else {
        await createVacancie(vacancyDto);
      }
      setShowModal(true);
    } catch {
      // errores se gestionan en los hooks; opcional mostrar feedback
    }
  };

  const handleAcceptModal = () => {
    setShowModal(false);
    if (onSaved) {
      onSaved();
    } else {
      navigate('/vacantes');
    }
  }

  const loading = creating || updating;
  const error = createError ?? updateError;

  return (
    <div className={Styles.pageContainer}>
      {/* Breadcrumb igual que en VacancyDetail */}
      <div className={Styles.breadcrumb}>
        Vacantes &gt; {initialVacancy?.title ?? (mode === 'edit' ? 'Editar vacante' : 'Nueva vacante')}
      </div>

      <h2>{mode === 'edit' ? 'Editar Vacante' : 'Crear Vacante'}</h2>

      <form className={Styles.form} onSubmit={handleSubmit}>
        <label>
          Título del puesto
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>

        <label>
          Descripción
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </label>

        <label>
          Requisitos
          <input value={requirements} onChange={e => setRequirements(e.target.value)} required />
        </label>

        <label>
          Ubicación
          <input value={location} onChange={e => setLocation(e.target.value)} required />
        </label>

        <label>
          Fecha de publicación
          <input type="datetime-local" value={postedDate} onChange={e => setPostedDate(e.target.value)} />
        </label>

        <label>
          Fecha de cierre
          <input type="datetime-local" value={closeDate} onChange={e => setCloseDate(e.target.value)} required />
        </label>

        <label className={Styles.checkboxLabel}>
          <input type="checkbox" checked={state} onChange={e => setState(e.target.checked)} />
          Activa
        </label>

        {error && <div className={Styles.errorMessage}>Error: {error}</div>}

        <div className={Styles.buttons}>
          <button type="button" className={AdminStyles.secondaryButton} onClick={onCancel} disabled={loading}>Cancelar</button>
          <button type="submit" className={AdminStyles.primaryButton} disabled={loading}>
            {loading ? (mode === 'edit' ? 'Actualizando...' : 'Guardando...') : (mode === 'edit' ? 'Actualizar' : 'Guardar')}
          </button>
        </div>
      </form>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '420px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)', textAlign: 'center'
          }}>
            <h3>{mode === 'edit' ? 'Vacante actualizada' : 'Vacante creada'}</h3>
            <p>{mode === 'edit' ? 'Los cambios se han guardado correctamente.' : 'La vacante se ha creado correctamente.'}</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button
                onClick={handleAcceptModal}
                className={AdminStyles.primaryButton}
                style={{ padding: undefined }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateVacancyForm;