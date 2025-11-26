import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from '../../pages/vacancies/CreateVacancy.module.css';
import AdminStyles from '../../pages/admins/AdminDashboard.module.css';
import { useCreateResume } from '../../hooks/resumes/useCreateResume';
import { useUpdateResume } from '../../hooks/resumes/useUpdateResume';
import { useAuth } from '../../hooks/useAuth';
import type { CreateResumeRequest } from '../../../data/dtos/CreateResumeDto';
import type { WorkExperience, Resume } from '../../../core/entities/Resume';

interface Props {
  onCancel: () => void;
  onSaved?: () => void;
  mode?: 'create' | 'edit';
  initialResume?: Resume | null;
}

const emptyWorkExp = (): WorkExperience => ({
  id: 0,
  resumeId: 0,
  companyName: '',
  position: '',
  description: '',
  startDate: '',
  endDate: null,
});

const normalizeWorkExpFromServer = (r: any): WorkExperience[] => {
  // soportar diferentes nombres devueltos por backend (workExperience / WorkExpList / WorkExperience)
  const list = r?.WorkExpList ?? r?.workExperience ?? r?.WorkExperience ?? [];
  return Array.isArray(list)
    ? list.map((we: any) => ({
        id: we.id ?? 0,
        resumeId: we.resumeId ?? we.resumeId ?? 0,
        companyName: we.companyName ?? we.company ?? '',
        position: we.position ?? '',
        description: we.description ?? '',
        startDate: we.startDate ? (we.startDate as string).slice(0, 10) : '',
        endDate: we.endDate ? (we.endDate as string).slice(0, 10) : null,
      }))
    : [];
};

const CreateResumeForm = ({ onCancel, onSaved, mode = 'create', initialResume = null }: Props) => {
  const { userClaims } = useAuth();
  const loggedEmployeeId = userClaims && userClaims.role === 'Employee' ? Number.parseInt(userClaims.id) : undefined;

  const [academicTraining, setAcademicTraining] = useState('');
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState('');
  const [profileSummary, setProfileSummary] = useState('');
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // errores de validación del frontend (en español)
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessages, setErrorModalMessages] = useState<string[] | null>(null);

  const navigate = useNavigate();

  const { createResume, loading: creating, error: createError } = useCreateResume();
  const { updateResume, loading: updating, error: updateError } = useUpdateResume();

  // precargar datos si venimos en modo edit y tenemos initialResume
  useEffect(() => {
    if (mode === 'edit' && initialResume) {
      setAcademicTraining(initialResume.academicTraining ?? '');
      setSkills(initialResume.skills ?? '');
      setLanguages(initialResume.languages ?? '');
      setProfileSummary(initialResume.profileSummary ?? '');
      setWorkExperience(normalizeWorkExpFromServer(initialResume));
    } else if (mode === 'create') {
      // limpiar cuando se crea
      setAcademicTraining('');
      setSkills('');
      setLanguages('');
      setProfileSummary('');
      setWorkExperience([]);
    }
  }, [mode, initialResume]);

  const addWorkExp = () => setWorkExperience(prev => [...prev, emptyWorkExp()]);
  const removeWorkExp = (index: number) =>
    setWorkExperience(prev => prev.filter((_, i) => i !== index));
  const updateWorkExp = (index: number, patch: Partial<WorkExperience>) =>
    setWorkExperience(prev => prev.map((w, i) => (i === index ? { ...w, ...patch } : w)));

  // Validación en frontend (mismos checks que el backend)
  const runClientValidation = (): string[] => {
    const msgs: string[] = [];

    if (!loggedEmployeeId || loggedEmployeeId <= 0) {
      msgs.push('ID de empleado inválido. Inicia sesión de nuevo.');
    }

    if (!profileSummary || profileSummary.trim() === '') {
      msgs.push('El resumen del perfil no puede estar vacío.');
    } else if (profileSummary.length > 2000) {
      msgs.push('El resumen del perfil no puede exceder 2000 caracteres.');
    }

    if (!academicTraining || academicTraining.trim() === '') {
      msgs.push('La formación académica no puede estar vacía.');
    } else if (academicTraining.length > 2000) {
      msgs.push('La formación académica no puede exceder 2000 caracteres.');
    }

    if (!skills || skills.trim() === '') {
      msgs.push('Las habilidades no pueden estar vacías.');
    }

    if (!languages || languages.trim() === '') {
      msgs.push('Los idiomas no pueden estar vacíos.');
    }

    if (!workExperience || workExperience.length === 0) {
      msgs.push('Añade al menos una experiencia laboral.');
    } else {
      workExperience.forEach((we, idx) => {
        const nr = idx + 1;
        if (!we.companyName || we.companyName.trim() === '') {
          msgs.push(`Experiencia ${nr}: el nombre de la empresa no puede estar vacío.`);
        }
        if (!we.position || we.position.trim() === '') {
          msgs.push(`Experiencia ${nr}: el puesto no puede estar vacío.`);
        }
        if (!we.description || we.description.trim() === '') {
          msgs.push(`Experiencia ${nr}: la descripción no puede estar vacía.`);
        }
        if (!we.startDate || we.startDate.trim() === '') {
          msgs.push(`Experiencia ${nr}: la fecha de inicio es obligatoria.`);
        }
        if (we.startDate && we.endDate) {
          const s = new Date(we.startDate);
          const e = new Date(we.endDate);
          if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && s > e) {
            msgs.push(`Experiencia ${nr}: la fecha de inicio no puede ser posterior a la fecha de fin.`);
          }
        }
      });
    }

    return msgs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLocalError(null);
    setErrorModalMessages(null);
    setShowErrorModal(false);

    const clientErrors = runClientValidation();
    if (clientErrors.length > 0) {
      setErrorModalMessages(clientErrors);
      setShowErrorModal(true);
      const el = document.querySelector('section');
      if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const payload: CreateResumeRequest = {
      employeeId: loggedEmployeeId!,
      academicTraining,
      skills,
      languages,
      profileSummary,
      WorkExpList: workExperience.map(w => ({
        id: w.id ?? 0,
        resumeId: w.resumeId ?? 0,
        companyName: w.companyName,
        position: w.position,
        description: w.description,
        startDate: w.startDate,
        endDate: w.endDate,
      })),
    };

    try {
      if (mode === 'edit' && initialResume && initialResume.id) {
        await updateResume(initialResume.id, payload);
      } else {
        await createResume(payload);
      }
      setShowModal(true);
    } catch (err: any) {
      console.error('Error al crear/actualizar CV (backend):', err);
      setLocalError('Error al guardar el CV. Inténtalo de nuevo más tarde.');
    }
  };

  const handleAcceptModal = () => {
    setShowModal(false);
    if (onSaved) onSaved();
    else navigate('/resumes');
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorModalMessages(null);
  };

  const displayError = localError ?? createError ?? updateError;
  const loading = creating || updating;

  return (
    <div className={Styles.pageContainer}>
      <div className={Styles.breadcrumb}>CV &gt; {mode === 'edit' ? 'Actualizar CV' : 'Nuevo CV'}</div>

      <h2>{mode === 'edit' ? 'Actualizar CV' : 'Crear CV'}</h2>

      <form className={Styles.form} onSubmit={handleSubmit}>
        {/* Employee ID se toma del contexto de autenticación; no se pregunta al usuario */}

        <label>
          Resumen del perfil
          <textarea
            value={profileSummary}
            onChange={e => setProfileSummary(e.target.value)}
            required
          />
        </label>

        <label>
          Formación académica
          <textarea
            value={academicTraining}
            onChange={e => setAcademicTraining(e.target.value)}
            required
          />
        </label>

        <label>
          Habilidades (coma separadas o texto)
          <input value={skills} onChange={e => setSkills(e.target.value)} required />
        </label>

        <label>
          Idiomas
          <input value={languages} onChange={e => setLanguages(e.target.value)} required />
        </label>

        <section style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Experiencia laboral</strong>
            <button type="button" className={AdminStyles.secondaryButton} onClick={addWorkExp}>
              Añadir experiencia
            </button>
          </div>

          {workExperience.length === 0 && <p style={{ marginTop: 8 }}>No hay experiencias añadidas.</p>}

          {workExperience.map((we, idx) => (
            <fieldset key={idx} style={{ marginTop: 12, padding: 12, borderRadius: 6 }} aria-labelledby={`we-${idx}`}>
              <legend id={`we-${idx}`}>Experiencia {idx + 1}</legend>

              <label>
                Empresa
                <input
                  value={we.companyName}
                  onChange={e => updateWorkExp(idx, { companyName: e.target.value })}
                  required
                />
              </label>

              <label>
                Puesto
                <input
                  value={we.position}
                  onChange={e => updateWorkExp(idx, { position: e.target.value })}
                  required
                />
              </label>

              <label>
                Descripción
                <textarea
                  value={we.description}
                  onChange={e => updateWorkExp(idx, { description: e.target.value })}
                  required
                />
              </label>

              <label>
                Fecha inicio
                <input
                  type="date"
                  value={we.startDate?.slice(0, 10) ?? ''}
                  onChange={e => updateWorkExp(idx, { startDate: e.target.value })}
                  required
                />
              </label>

              <label>
                Fecha fin (vacío si continúa)
                <input
                  type="date"
                  value={we.endDate ? (we.endDate as string).slice(0, 10) : ''}
                  onChange={e => updateWorkExp(idx, { endDate: e.target.value || null })}
                />
              </label>

              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className={AdminStyles.secondaryButton}
                  onClick={() => removeWorkExp(idx)}
                >
                  Eliminar
                </button>
              </div>
            </fieldset>
          ))}
        </section>

        {displayError && <div className={Styles.errorMessage}>Error: {displayError}</div>}

        <div className={Styles.buttons}>
          <button type="button" className={AdminStyles.secondaryButton} onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className={AdminStyles.primaryButton} disabled={loading}>
            {loading ? (mode === 'edit' ? 'Guardando...' : 'Guardando...') : (mode === 'edit' ? 'Actualizar CV' : 'Guardar CV')}
          </button>
        </div>
      </form>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}
        >
          <div
            style={{
              background: '#fff', padding: '24px', borderRadius: '8px',
              width: '90%', maxWidth: '420px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)', textAlign: 'center'
            }}
          >
            <h3>{mode === 'edit' ? 'CV actualizado' : 'CV creado'}</h3>
            <p>{mode === 'edit' ? 'Los cambios se han guardado correctamente.' : 'El currículum se ha creado correctamente.'}</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button onClick={handleAcceptModal} className={AdminStyles.primaryButton}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && errorModalMessages && (
        <div
          role="alertdialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}
        >
          <div
            style={{
              background: '#fff', padding: '20px', borderRadius: '8px',
              width: '90%', maxWidth: '480px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
            }}
          >
            <h3 style={{ marginTop: 0, color: '#c0392b' }}>Errores de validación</h3>
            <ul style={{ marginTop: 8, paddingLeft: 18 }}>
              {errorModalMessages.map((m, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{m}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <button className={AdminStyles.primaryButton} onClick={handleCloseErrorModal}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateResumeForm;