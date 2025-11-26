import React, { useEffect, useMemo, useState } from 'react';
import { useVacancies } from '../../hooks/vacancies/useVacancies';
import { useAppsByEmployee } from '../../hooks/applications/useAppsByEmployee';
import { useAllApplications } from '../../hooks/applications/useAllApplications';
import { useDeleteApplication } from '../../hooks/applications/useDeleteApplication';
import { useAuth } from '../../hooks/useAuth';
import ApplicationsTable from './ApplicationsTable';
import Loader from './Loader';
import EmptyState from './EmptyState';
import styles from './ApplicationsList.module.css';

const ApplicationsList: React.FC = () => {
  const { userClaims } = useAuth();
  const isAdmin = userClaims?.role === 'Admin';

  const { vacancies, loading: loadingVacancies, error: errorVacancies } = useVacancies();
  const { applications: appsByEmployee, fetchApplicationsByEmployee, loading: loadingAppsByEmployee, error: errorAppsByEmployee } = useAppsByEmployee();
  const { applications: allApplications, fetchAllApplications, loading: loadingAllApps, error: errorAllApps } = useAllApplications();
  const { fetchDeleteApplication, loading: loadingDelete, error: errorDelete } = useDeleteApplication();

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(null);
    if (!userClaims) return;

    if (isAdmin) {
      void fetchAllApplications().catch(err => setLocalError(err?.message ?? 'Error cargando solicitudes'));
    } else {
      const id = Number.parseInt(userClaims.id, 10) || 0;
      void fetchApplicationsByEmployee(id).catch(err => setLocalError(err?.message ?? 'Error cargando solicitudes'));
    }
  }, [userClaims, isAdmin, fetchAllApplications, fetchApplicationsByEmployee]);

  const applications = isAdmin ? allApplications ?? [] : appsByEmployee ?? [];
  const loading = loadingVacancies || loadingAppsByEmployee || loadingAllApps || loadingDelete;
  const error = errorVacancies ?? errorAppsByEmployee ?? errorAllApps ?? errorDelete ?? localError;

  // Vacantes visibles: admin = todas, employee = solo vacantes donde el empleado tiene aplicaciones
  const visibleVacancies = useMemo(() => {
    if (!vacancies) return [];
    if (isAdmin) return vacancies;
    if (!applications || applications.length === 0) return [];
    const ids = new Set((applications || []).map(a => a.vacancyId));
    return vacancies.filter(v => ids.has(v.id));
  }, [vacancies, isAdmin, applications]);

  const handleWithdraw = async (applicationId: number) => {
    try {
      await fetchDeleteApplication(applicationId);
      // recargar apps del empleado
      if (!isAdmin && userClaims) {
        void fetchApplicationsByEmployee(Number.parseInt(userClaims.id, 10) || 0);
      } else if (isAdmin) {
        void fetchAllApplications();
      }
    } catch (err: any) {
      setLocalError(err?.message ?? 'No se pudo eliminar la solicitud');
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 12, color: '#6b7280', fontSize: 13 }}>Solicitudes &gt; Lista</div>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Solicitudes</h2>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : visibleVacancies.length === 0 && applications.length === 0 ? (
        <EmptyState isAdmin={!!isAdmin} />
      ) : (
        <ApplicationsTable
          applications={applications}
          vacancies={visibleVacancies}
          isAdmin={!!isAdmin}
          onWithdraw={handleWithdraw}
          onViewDetails={(v) => console.log('Ver detalles vacante', v?.id)}
        />
      )}
    </div>
  );
};

export default ApplicationsList;