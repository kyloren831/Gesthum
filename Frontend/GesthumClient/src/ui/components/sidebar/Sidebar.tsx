import React from 'react';
import Styles from './Sidebar.module.css';
import GesthumLogo from '../logo/gesthumLogo';
import { AiOutlineHome } from 'react-icons/ai';
import { FaBriefcase } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

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
      </nav>
    </aside>
  );
};

export default Sidebar;