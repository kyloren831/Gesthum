import React from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Styles from '../admins/AdminDashboard.module.css';
import ApplicationsList from '../../components/applications/ApplicationsList';

const ApplicationsPage: React.FC = () => {
  return (
    <div className={Styles.body}>
      <div className={Styles.pageLayout}>
        <Sidebar />
        <div className={Styles.contentArea}>
          <Header />
          <main className={Styles.mainContent} aria-label="Página de solicitudes">

            <ApplicationsList />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;