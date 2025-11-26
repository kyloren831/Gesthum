import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import CreateVacancyForm from '../../components/vacancies/CreateVacancyForm';
import Styles from '../admins/AdminDashboard.module.css';
import LocalStyles from './CreateVacancy.module.css';
import type { Vacancy } from '../../../core/entities/Vacancy';

type RouteState = {
  mode?: 'create' | 'edit';
  vacancy?: Vacancy;
};

const CreateVacancy: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RouteState | null;

  const handleCancel = () => navigate('/vacantes');
  const handleSaved = () => navigate('/vacantes');

  return (
    <div className={Styles.body}>
      <div className={Styles.pageLayout}>
        <Sidebar />
        <div className={Styles.contentArea}>
          <Header />
          <main className={Styles.mainContent}>
            {/* Breadcrumb igual al de VacancyDetail */}
            
            <CreateVacancyForm
              onCancel={handleCancel}
              onSaved={handleSaved}
              mode={state?.mode ?? 'create'}
              initialVacancy={state?.vacancy}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateVacancy;