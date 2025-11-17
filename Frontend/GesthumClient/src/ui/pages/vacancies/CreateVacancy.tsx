import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import CreateVacancyForm from '../../components/vacancies/CreateVacancyForm';
import Styles from '../admins/AdminDashboard.module.css';

const CreateVacancy: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => navigate('/vacantes');
  const handleSaved = () => navigate('/vacantes');

  return (
    <div className={Styles.body}>
      <div className={Styles.pageLayout}>
        <Sidebar />
        <div className={Styles.contentArea}>
          <Header />
          <main className={Styles.mainContent}>
            <CreateVacancyForm onCancel={handleCancel} onSaved={handleSaved} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateVacancy;