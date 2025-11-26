import React from 'react';
import type { Vacancy } from '../../../core/entities/Vacancy';
import type { Application } from '../../../core/entities/Application';
import styles from './ApplicationsList.module.css';
import rowStyles from './ApplicationRow.module.css';
import ApplicationRow from './ApplicationRow';

type Props = {
  applications: Application[];
  vacancies: Vacancy[];
  isAdmin: boolean;
  onWithdraw: (applicationId: number) => Promise<void> | void;
  onViewDetails?: (vacancy: Vacancy) => void;
};

const ApplicationsTable: React.FC<Props> = ({ applications, vacancies, isAdmin, onWithdraw, onViewDetails }) => {
  const vacancyMap = React.useMemo(() => {
    const m = new Map<number, Vacancy>();
    for (const v of vacancies || []) m.set(v.id, v);
    return m;
  }, [vacancies]);

  return (
    <div className={styles.tableWrapper} role="region" aria-label="Tabla de solicitudes">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Id Solicitud</th>
            <th>Id Vacante</th>
            <th>Vacante</th>
            <th>Empleado</th>
            <th className={rowStyles.colLocation}>Ubicación</th>
            <th>Publicado</th>
            <th>Cierra</th>
            <th>Estado vacante</th>
            {!isAdmin && <th>Solicitud</th>}
            <th className={rowStyles.colActions}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => {
            const vacancy = vacancyMap.get(app.vacancyId);
            return (
              <ApplicationRow
                key={String(app.id)}
                vacancy={vacancy}
                application={app}
                isAdmin={isAdmin}
                onWithdraw={onWithdraw}
                onViewDetails={onViewDetails}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;