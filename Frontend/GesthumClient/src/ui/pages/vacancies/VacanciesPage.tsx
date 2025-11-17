import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import VacanciesList from '../../components/vacancies/VacanciesList';
import CreateVacancyForm from '../../components/vacancies/CreateVacancyForm';
import Styles from '../admins/AdminDashboard.module.css';
import { useAuth } from '../../hooks/useAuth';
import VacancyDetail from '../../components/vacancies/VacancyDetail';
import type { Vacancy } from '../../../core/entities/Vacancy';

const VacanciesPage: React.FC = () => {
  const { userClaims } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

  const canCreate = userClaims?.role === 'Admin';

  const handleViewDetails = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
  };

  const handleCloseDetails = () => {
    setSelectedVacancy(null);
  };

  return (
    <div className={Styles.body}>
      <div className={Styles.pageLayout}>
        <Sidebar />
        <div className={Styles.contentArea}>
          <Header />
          <main className={Styles.mainContent}>
            {showCreate ? (
              <CreateVacancyForm
                onCancel={() => setShowCreate(false)}
                onSaved={() => setShowCreate(false)}
              />
            ) : selectedVacancy ? (
              <>
                <button
                  className={Styles.secondaryButton}
                  onClick={handleCloseDetails}
                  aria-label="Volver a la lista"
                >
                  ← Volver a lista
                </button>
                <VacancyDetail vacancy={selectedVacancy} onApply={async (id) => { console.log('Aplicando a', id); }} />
              </>
            ) : (
              <VacanciesList onCreate={() => setShowCreate(true)} canCreate={canCreate} onViewDetails={handleViewDetails} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VacanciesPage;