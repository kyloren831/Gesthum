import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVacancies } from '../../hooks/vacancies/useVacancies';
import { useAppsByEmployee } from '../../hooks/applications/useAppsByEmployee';
import { useAllApplications } from '../../hooks/applications/useAllApplications';
import { useDeleteApplication } from '../../hooks/applications/useDeleteApplication';
import { useAuth } from '../../hooks/useAuth';
import ApplicationsTable from './ApplicationsTable';
import Loader from './Loader';
import EmptyState from './EmptyState';
import styles from './ApplicationsList.module.css';
import AdminStyles from '../../pages/admins/AdminDashboard.module.css';
import loginStyles from '../../pages/login.module.css';

const ApplicationsList: React.FC = () => {
  const navigate = useNavigate();
  const { userClaims } = useAuth();
  const isAdmin = userClaims?.role === 'Admin';

  const { vacancies, loading: loadingVacancies, error: errorVacancies } = useVacancies();
  const { applications: appsByEmployee, fetchApplicationsByEmployee, loading: loadingAppsByEmployee, error: errorAppsByEmployee } = useAppsByEmployee();
  const { applications: allApplications, fetchAllApplications, loading: loadingAllApps, error: errorAllApps } = useAllApplications();
  const { fetchDeleteApplication, loading: loadingDelete, error: errorDelete } = useDeleteApplication();

  const [localError, setLocalError] = useState<string | null>(null);

  // filtros de UI
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | string>('All');
  const [filterEmployeeId, setFilterEmployeeId] = useState(''); // solo para admin

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

  // Detectar caso específico cuando el backend responde "Get Applications by Employee ID failed"
  const noAppsErrorMessage = 'Get Applications by Employee ID failed';
  const isNoAppsError = !isAdmin && (
    Boolean(errorAppsByEmployee && errorAppsByEmployee.includes(noAppsErrorMessage)) ||
    Boolean(localError && localError.includes(noAppsErrorMessage))
  );

  // Mapa de vacantes para búsqueda rápida por id
  const vacancyMap = useMemo(() => {
    const m = new Map<number, typeof vacancies extends (infer U)[] ? U : any>();
    for (const v of vacancies || []) m.set(v.id, v);
    return m;
  }, [vacancies]);

  // Aplicaciones filtradas según los controles:
  // - Todos: admins filtran por vacante, estado o id empleado
  // - Empleado: filtra por vacante y estado
  const filteredApplications = useMemo(() => {
    const q = (filterText || '').trim().toLowerCase();
    const statusFilter = (filterStatus || 'All').trim();
    const empIdFilter = (filterEmployeeId || '').trim();

    return (applications || []).filter(app => {
      // filtro por estado
      if (statusFilter && statusFilter !== 'All') {
        if ((app.status ?? '').toString().toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // filtro por nombre de vacante (buscar en vacancy.title o en campos incluidos en el DTO)
      if (q) {
        const vac = vacancyMap.get(app.vacancyId);
        const title = (vac?.title ?? app.vacantTitle ?? '').toString().toLowerCase();
        if (!title.includes(q)) return false;
      }

      // filtro por id de empleado (solo para admin)
      if (isAdmin && empIdFilter) {
        const applicantIdentifier = (app as any).employeeId ?? (app as any).resumeId ?? '';
        if (!String(applicantIdentifier).toLowerCase().includes(empIdFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [applications, vacancyMap, filterText, filterStatus, filterEmployeeId, isAdmin]);

  // Vacantes que se mostrarán en la tabla: si hay filtros aplicados, limitar a las vacantes referenciadas por las apps filtradas.
  const anyFilterApplied = Boolean(filterText.trim() || (filterStatus && filterStatus !== 'All') || (isAdmin && filterEmployeeId.trim()));
  const displayedVacancies = useMemo(() => {
    if (!vacancies) return [];
    if (!anyFilterApplied) {
      // comportamiento previo: admin => todas; empleado => solo vacantes donde tiene aplicaciones
      if (isAdmin) return vacancies;
      const ids = new Set((applications || []).map(a => a.vacancyId));
      return vacancies.filter(v => ids.has(v.id));
    }
    const ids = new Set((filteredApplications || []).map(a => a.vacancyId));
    return vacancies.filter(v => ids.has(v.id));
  }, [vacancies, applications, filteredApplications, isAdmin, anyFilterApplied]);

  const handleWithdraw = async (applicationId: number) => {
    try {
      await fetchDeleteApplication(applicationId);
      // recargar apps del empleado o admin
      if (!isAdmin && userClaims) {
        void fetchApplicationsByEmployee(Number.parseInt(userClaims.id, 10) || 0);
      } else if (isAdmin) {
        void fetchAllApplications();
      }
    } catch (err: any) {
      setLocalError(err?.message ?? 'No se pudo eliminar la solicitud');
    }
  };

  const clearFilters = () => {
    setFilterText('');
    setFilterStatus('All');
    setFilterEmployeeId('');
  };

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 12, color: '#6b7280', fontSize: 13 }}>Solicitudes &gt; Lista</div>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Solicitudes</h2>
      </div>

      {/* Controles de filtrado */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input
          className={loginStyles.mainContent}
          placeholder="Filtrar por nombre de vacante..."
          aria-label="Filtrar por vacante"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ minWidth: 240 }}
        />

        <select
          className={loginStyles.mainContent}
          aria-label="Filtrar por estado de aplicación"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: undefined }}
        >
          <option value="All">Todos los estados</option>
          <option value="Pending">Pending</option>
          <option value="Passed">Passed</option>
          <option value="Failed">Failed</option>
        </select>

        {isAdmin && (
          <input
            className={loginStyles.mainContent}
            placeholder="Filtrar por ID de empleado..."
            aria-label="Filtrar por ID de empleado"
            value={filterEmployeeId}
            onChange={(e) => setFilterEmployeeId(e.target.value)}
            style={{ minWidth: 160 }}
          />
        )}

        <button className={AdminStyles.secondaryButton} onClick={clearFilters} aria-label="Limpiar filtros">
          Limpiar
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : isNoAppsError ? (
        <div className={styles.empty}>
          <h3>No hay aplicaciones por mostrar.</h3>
          <p style={{ color: '#6b7280' }}>Aún no has postulado a ninguna vacante.</p>
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => navigate('/vacantes')}
              aria-label="Ver vacantes disponibles"
              className={AdminStyles.primaryButton}
              style={{ minWidth: 160 }}
            >
              Ver vacantes disponibles
            </button>
          </div>
        </div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : displayedVacancies.length === 0 && filteredApplications.length === 0 ? (
        <EmptyState isAdmin={!!isAdmin} />
      ) : (
        <ApplicationsTable
          applications={filteredApplications}
          vacancies={displayedVacancies}
          isAdmin={!!isAdmin}
          onWithdraw={handleWithdraw}
          onViewDetails={(v) => console.log('Ver detalles vacante', v?.id)}
        />
      )}
    </div>
  );
};

export default ApplicationsList;