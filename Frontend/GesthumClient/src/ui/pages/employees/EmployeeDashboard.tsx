import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import Styles from '../admins/AdminDashboard.module.css';
import { useAuth } from "../../hooks/useAuth";
import { useUserInfo } from "../../hooks/useUserInfo";
import type { Employee } from "../../../core/entities/Employee";

const EmployeeDashboard = () => {
  const { userClaims } = useAuth();
  const { employeeInfo } = useUserInfo();
  const [employee, setEmployee] = useState<Employee | undefined>(undefined);

  useEffect(() => {
    const loadEmployee = async () => {
      if (!userClaims) return;
      try {
        const emp = await employeeInfo(Number.parseInt(userClaims.id));
        setEmployee(emp);
      } catch {
        setEmployee(undefined);
      }
    };
    void loadEmployee();
  }, [userClaims, employeeInfo]);

  return (
    <div className={Styles.body}>
      <div className={Styles.pageLayout}>
        <Sidebar />
        <div className={Styles.contentArea}>
          <Header />
          <main className={Styles.mainContent}>
            <h2>Bienvenido, {employee?.name ?? 'Empleado'}</h2>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;