import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import type { Vacancy } from '../../../core/entities/Vacancy';
import Styles from './VacancyCard.module.css';
import AdminStyles from '../../pages/admins/AdminDashboard.module.css';
import { useUpdateVacancy } from '../../hooks/vacancies/useUpdateVacancy';
import { useAuth } from '../../hooks/useAuth';

type VacancyProps = {
    v: Vacancy;
    handleViewDetails: (vacancy: Vacancy) => void;
    onEdit?: (vacancy: Vacancy) => void;
};

const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (typeof document === 'undefined') return null;
    return ReactDOM.createPortal(children, document.body);
};

const VacancyCard = ({ v, handleViewDetails, onEdit }: VacancyProps) => {
    const { toggleStatus, loading, error } = useUpdateVacancy();
    const { userClaims } = useAuth();
    const isAdmin = userClaims?.role === 'Admin';

    const [localState, setLocalState] = useState<boolean>(v.state);
    const [showConfirm, setShowConfirm] = useState(false);
    const [opError, setOpError] = useState<string | null>(null);

    useEffect(() => {
        setLocalState(v.state);
    }, [v.state]);

    useEffect(() => {
        if (showConfirm) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
        return;
    }, [showConfirm]);

    useEffect(() => {
        if (!showConfirm) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowConfirm(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showConfirm]);

    const openConfirm = () => {
        setOpError(null);
        setShowConfirm(true);
    };

    const closeConfirm = () => {
        setOpError(null);
        setShowConfirm(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isAdmin) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openConfirm();
        }
    };

    const handleConfirmChange = async () => {
        try {
            setOpError(null);
            await toggleStatus(v.id);
            setLocalState(prev => !prev);
            setShowConfirm(false);
        } catch (err: any) {
            const msg = err?.message ?? 'No se pudo cambiar el estado';
            setOpError(msg);
        }
    };

    const handleEditClick = () => {
        if (onEdit) onEdit(v);
    };

    return (
        <div className={Styles.VacancyCard}>
            <div className={Styles.CardHeader}>
                <h3 className={Styles.Title}>{v.title}</h3>

                {isAdmin ? (
                    <span
                        className={`${Styles.StatusBadge} ${localState ? Styles.Open : Styles.Closed}`}
                        aria-label={`Estado: ${localState ? 'Abierta' : 'Cerrada'}. Pulse para cambiar.`}
                        role="button"
                        tabIndex={0}
                        onClick={openConfirm}
                        onKeyDown={handleKeyDown}
                        title={localState ? 'Hacer clic para cambiar a Cerrada' : 'Hacer clic para cambiar a Abierta'}
                    >
                        {localState ? 'Abierta' : 'Cerrada'}
                    </span>
                ) : (
                    <span
                        className={`${Styles.StatusBadge} ${localState ? Styles.Open : Styles.Closed}`}
                        aria-label={`Estado: ${localState ? 'Abierta' : 'Cerrada'}`}
                    >
                        {localState ? 'Abierta' : 'Cerrada'}
                    </span>
                )}
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

            <div className={Styles.Actions}>
                <button
                    className={Styles.secondaryButton}
                    onClick={() => handleViewDetails(v)}
                    aria-label={`Ver detalles de la vacante ${v.title}`}
                >
                    Ver detalles
                </button>

                {isAdmin && (
                    <button
                        className={AdminStyles.primaryButton}
                        onClick={handleEditClick}
                        aria-label={`Editar la vacante ${v.title}`}
                    >
                        Editar
                    </button>
                )}
            </div>

            {showConfirm && isAdmin && (
                <ModalPortal>
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            background: '#fff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '420px',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.2)', textAlign: 'center'
                        }}>
                            <h3>{localState ? 'Cerrar vacante' : 'Abrir vacante'}</h3>
                            <p>¿Desea {localState ? 'cerrar' : 'abrir'} la vacante <strong>{v.title}</strong>?</p>

                            {opError && <p style={{ color: '#b91c1c' }}>Error: {opError}</p>}
                            {error && <p style={{ color: '#b91c1c' }}>Error: {error}</p>}

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                                <button
                                    onClick={closeConfirm}
                                    className={AdminStyles.secondaryButton}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmChange}
                                    className={AdminStyles.primaryButton}
                                    disabled={loading}
                                    aria-disabled={loading}
                                >
                                    {loading ? 'Procesando...' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div>
    );
};

export default VacancyCard;