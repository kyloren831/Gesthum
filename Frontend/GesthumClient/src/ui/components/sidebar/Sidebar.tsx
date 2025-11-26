import React from 'react';
import Styles from './Sidebar.module.css';
import GesthumLogo from '../logo/gesthumLogo';
import { AiOutlineHome } from 'react-icons/ai';
import { FaBriefcase, FaClipboardList, FaRegFileAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { userClaims } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={Styles.sidebarContainer} aria-label="Sidebar principal">
      <div className={Styles.top}>
        <GesthumLogo size="small" />
      </div>

      <nav className={Styles.nav}>
        <Link
          to="/adminDash"
          className={`${Styles.navItem} ${isActive('/adminDash') ? Styles.active : ''}`}
          aria-current={isActive('/adminDash') ? 'page' : undefined}
        >
          <AiOutlineHome className={Styles.icon} />
          <span className={Styles.label}>Inicio</span>
        </Link>

        <Link
          to="/vacantes"
          className={`${Styles.navItem} ${isActive('/vacantes') ? Styles.active : ''}`}
          aria-current={isActive('/vacantes') ? 'page' : undefined}
        >
          <FaBriefcase className={Styles.icon} />
          <span className={Styles.label}>Vacantes</span>
        </Link>

        { /* Enlace a aplicaciones visible para usuarios autenticados (Admin y Employee) */ }
        {userClaims && (
          <Link
            to="/applications"
            className={`${Styles.navItem} ${isActive('/applications') ? Styles.active : ''}`}
            aria-current={isActive('/applications') ? 'page' : undefined}
          >
            <FaClipboardList className={Styles.icon} />
            <span className={Styles.label}>Solicitudes</span>
          </Link>
        )}

        { /* Enlace al perfil visible sólo para empleados */ }
        {userClaims?.role === 'Employee' && (
          <>
            <Link
              to="/employees/profile"
              className={`${Styles.navItem} ${isActive('/employees/profile') ? Styles.active : ''}`}
              aria-current={isActive('/employees/profile') ? 'page' : undefined}
            >
              <CgProfile className={Styles.icon} />
              <span className={Styles.label}>Perfil</span>
            </Link>

            { /* Enlace al resume del empleado (visible sólo para Employee) */ }
            <Link
              to="/resumes"
              className={`${Styles.navItem} ${isActive('/resumes') ? Styles.active : ''}`}
              aria-current={isActive('/resumes') ? 'page' : undefined}
            >
              <FaRegFileAlt className={Styles.icon} />
              <span className={Styles.label}>Mi CV</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;