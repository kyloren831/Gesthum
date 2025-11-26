import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import CreateResumeForm from '../../components/resumes/CreateResumeForm';
import LayoutStyles from '../admins/AdminDashboard.module.css';
import LocalStyles from './ResumesPage.module.css';
import type { Resume } from '../../../core/entities/Resume';

type RouteState = {
  mode?: 'create' | 'edit';
  resume?: Resume | null;
};

const CreateResume: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RouteState | null;

  const handleCancel = () => navigate('/resumes');
  const handleSaved = () => navigate('/resumes');

  return (
    <div className={LayoutStyles.body}>
      <div className={LayoutStyles.pageLayout}>
        <Sidebar />
        <div className={LayoutStyles.contentArea}>
          <Header />
          <main className={LayoutStyles.mainContent}>
            <CreateResumeForm
              onCancel={handleCancel}
              onSaved={handleSaved}
              mode={state?.mode ?? 'create'}
              initialResume={state?.resume ?? null}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateResume;