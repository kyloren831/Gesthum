import React from 'react';
import styles from './ApplicationsList.module.css';

const EmptyState: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => (
  <div className={styles.empty}>
    {isAdmin ? (
      <>
        <h3>No hay vacantes Que revisar.</h3>
        <p style={{ color: '#6b7280' }}>Crea vacantes desde el panel de administración.</p>
      </>
    ) : (
      <>
        <h3>No hay postulaciones.</h3>
        <p style={{ color: '#6b7280' }}>Aún no te has postulado a ninguna vacante.</p>
      </>
    )}
  </div>
);

export default EmptyState;