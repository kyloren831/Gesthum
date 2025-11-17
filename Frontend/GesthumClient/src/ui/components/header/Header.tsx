import Styles from './Header.module.css'
import { FaChevronDown } from 'react-icons/fa';
import { LuLogOut } from 'react-icons/lu';
import { CgProfile } from 'react-icons/cg';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserInfo } from '../../hooks/useUserInfo';
import type { Admin } from '../../../core/entities/Admin';
import type { Employee } from '../../../core/entities/Employee';

interface props{
    jobPosition?: string;
    name?: string;
    photo?: string;
}
const Header = ({jobPosition, name, photo}:props) => {

    const {userClaims, logout} = useAuth();
    const { adminInfo, employeeInfo } = useUserInfo();
    const navegate = useNavigate();
    const handleLogout = async () =>{
        try {
            await logout();
            navegate('/');
        } catch (error) {
            console.log(error)
        }
    }

    const [computedName, setComputedName] = useState<string | undefined>(name);
    const [computedPhoto, setComputedPhoto] = useState<string | undefined>(photo);
    const [computedJobPosition, setComputedJobPosition] = useState<string>(jobPosition ?? '');

    useEffect(() => {
        const resolveHeader = async () => {
            // fallback inicial: props o claims
            setComputedName(name ?? "No name");
            setComputedPhoto(photo);

            if (!userClaims) {
                setComputedJobPosition(jobPosition ?? '');
                return;
            }

            if (userClaims.role === 'Admin') {
                // Admin -> obtener info completa (incluye foto)
                setComputedJobPosition('Administrador de RH');
                try {
                    const adm: Admin | undefined = await adminInfo(Number.parseInt(userClaims.id));
                    if (adm) {
                        setComputedName(adm.name);
                        setComputedPhoto(adm.photo);
                    }
                } catch (e) {
                    // mantener valores por defecto si falla
                }
                return;
            }

            if (userClaims.role === 'Employee') {
                // Employee -> obtener puesto y nombre
                try {
                    const emp: Employee | undefined = await employeeInfo(Number.parseInt(userClaims.id));
                    if (emp) {
                        setComputedName(emp.name ?? (name ?? ""));
                        setComputedJobPosition(emp.position ?? (jobPosition ?? 'Empleado'));
                    } else {
                        setComputedJobPosition(jobPosition ?? 'Empleado');
                    }
                } catch {
                    setComputedJobPosition(jobPosition ?? 'Empleado');
                }
                return;
            }

            // otros roles
            setComputedJobPosition(jobPosition ?? '');
        };

        void resolveHeader();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userClaims, jobPosition, name, photo]);

  return (
    <div className={Styles.headerContainer}>
        <img
            className={Styles.userImage}
            src={ computedPhoto ?? `https://via.placeholder.com/40?text=${encodeURIComponent((computedName ?? 'U').charAt(0))}` }
            alt="userImage"
        />
        <div className={Styles.userInfo}>
            <h1 className={Styles.userJobPosition}>{computedJobPosition}</h1>
            <div className={Styles.menu}>
                <div className={Styles.userNameContainer}>
                    <h2 className={Styles.userName}>{computedName}</h2>
                    <FaChevronDown className={Styles.iconColor}></FaChevronDown>
                </div>
                <ul  className={Styles.subMenu}>
                    {userClaims?.role == "Employee" && ( <li key={"Perfil"} className={Styles.subMenuItem}><CgProfile/>Perfil</li> )}
                    <li key={"logout"} className={Styles.subMenuItem} onClick={handleLogout}><LuLogOut/>Cerrar Sesión</li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Header