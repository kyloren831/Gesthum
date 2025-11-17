import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from '../../pages/vacancies/CreateVacancy.module.css';
import AdminStyles from '../../pages/admins/AdminDashboard.module.css';
import { CreateVacancie } from '../../hooks/vacancies/createVacancie';
import type { VacancyDto } from '../../../data/dtos/VacancyDto';

interface Props {
  onCancel: () => void;
  onSaved?: () => void;
}

const CreateVacancyForm = ({ onCancel, onSaved }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [postedDate, setPostedDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [state, setState] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { createVacancie, loading, error } = CreateVacancie();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const vacancy: VacancyDto = {
      title,
      description,
      requirements,
      location,
      postedDate: postedDate ? new Date(postedDate).toISOString() : new Date().toISOString(),
      closeDate: new Date(closeDate).toISOString(),
      state,
    };

    try {
      await createVacancie(vacancy);
      setShowModal(true);
    } catch {
      // el estado error se gestiona dentro del hook; opcionalmente puede mostrarse en el UI
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

  return (
    <div className={Styles.pageContainer}>
      <h2>Crear Vacante</h2>
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
            {loading ? 'Guardando...' : 'Guardar'}
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
            <h3>Vacante creada</h3>
            <p>La vacante se ha creado correctamente.</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button
                onClick={handleAcceptModal}
                style={{
                  padding: '8px 16px', borderRadius: '6px', background: '#0b5fff',
                  color: '#fff', border: 'none', cursor: 'pointer'
                }}
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