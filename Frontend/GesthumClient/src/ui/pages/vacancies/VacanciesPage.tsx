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
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);

  const canCreate = userClaims?.role === 'Admin';

  const handleViewDetails = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setShowCreate(false);
    setEditingVacancy(null);
  };

  const handleCloseDetails = () => {
    setSelectedVacancy(null);
  };

  const handleCreate = () => {
    setEditingVacancy(null);
    setSelectedVacancy(null);
    setShowCreate(true);
  };

  const handleEdit = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setSelectedVacancy(null);
    setShowCreate(true);
  };

  return (
    <div className={Styles.body}>
      <div className={Styles.pageLayout}>
        <Sidebar />
        <div className={Styles.contentArea}>
          <Header />
                  <main className={Styles.mainContent}>
                      
            {showCreate ? (
                          <>
                              <button
                                  className={Styles.secondaryButton}
                                  onClick={() => { setShowCreate(false); setEditingVacancy(null); }}
                                  aria-label="Volver a la lista"
                              >
                                  ← Volver a lista
                              </button>

                              <CreateVacancyForm
                                  onCancel={() => { setShowCreate(false); setEditingVacancy(null); }}
                                  onSaved={() => { setShowCreate(false); setEditingVacancy(null); }}
                                  mode={editingVacancy ? 'edit' : 'create'}
                                  initialVacancy={editingVacancy}
                              />
                          </>
            ) : selectedVacancy ? (
              <>
                <button
                  className={Styles.secondaryButton}
                  onClick={handleCloseDetails}
                  aria-label="Volver a la lista"
                >
                  ← Volver a lista
                </button>
                <VacancyDetail vacancy={selectedVacancy} onApply={async (id) => { console.log('Aplicando a', id); }} onEdit={handleEdit} />
              </>
            ) : (
              <VacanciesList onCreate={handleCreate} onEdit={handleEdit} onViewDetails={handleViewDetails} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VacanciesPage;