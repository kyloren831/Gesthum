import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import Styles from "./EmployeeProfile.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useUserInfo } from "../../hooks/useUserInfo";
import type { Employee } from "../../../core/entities/Employee";
import { useNavigate } from "react-router-dom";

const EmployeeProfile = () => {
  const { userClaims } = useAuth();
  const { employeeInfo } = useUserInfo();
  const [employee, setEmployee] = useState<Employee | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!userClaims) return;
      try {
        const emp = await employeeInfo(Number.parseInt(userClaims.id));
        setEmployee(emp);
      } catch {
        setEmployee(undefined);
      }
    };
    void load();
  }, [userClaims, employeeInfo]);

  const handleEdit = () => {
    // Ruta de edición — puedes ajustar a la ruta real de tu app
    navigate("/employees/edit");
  };

  return (
    <div className={Styles.body}>
      <div className={Styles.pageLayout}>
        <Sidebar />
        <div className={Styles.contentArea}>
          <Header name={employee?.name} jobPosition={employee?.position} photo={employee?.photoUrl} />
          <main className={Styles.mainContent} aria-label="Perfil personal">
            <div className={Styles.titleRow}>
              <h1 className={Styles.pageTitle}>Perfil Personal</h1>
              <button className={Styles.editButton} onClick={handleEdit}>Editar Perfil</button>
            </div>

            <section className={Styles.card}>
              <div className={Styles.profileHeader}>
                <img
                  className={Styles.avatar}
                  src={employee?.photoUrl ?? `https://via.placeholder.com/96?text=${encodeURIComponent((employee?.name ?? "U").charAt(0))}`}
                  alt="Foto de perfil"
                />
                <div>
                  <h2 className={Styles.name}>{employee?.name ?? "Empleado"}</h2>
                  <p className={Styles.position}>{employee?.position ?? "-" }{employee?.department ? `, ${employee.department}` : ""}</p>
                </div>
              </div>
            </section>

            <section className={Styles.card}>
              <h3 className={Styles.cardTitle}>Datos Personales</h3>
              <div className={Styles.grid}>
                <div className={Styles.field}>
                  <span className={Styles.label}>Nombre Completo</span>
                  <span className={Styles.value}>{employee?.name ?? "-"}</span>
                </div>
                <div className={Styles.field}>
                  <span className={Styles.label}>Fecha de Nacimiento</span>
                  <span className={Styles.value}>-</span>
                </div>

                <div className={Styles.field}>
                  <span className={Styles.label}>DNI / Cédula</span>
                  <span className={Styles.value}>-</span>
                </div>
                <div className={Styles.field}>
                  <span className={Styles.label}>Nacionalidad</span>
                  <span className={Styles.value}>-</span>
                </div>

                <div className={Styles.field}>
                  <span className={Styles.label}>Estado Civil</span>
                  <span className={Styles.value}>-</span>
                </div>
                <div className={Styles.field}>
                  <span className={Styles.label}>Género</span>
                  <span className={Styles.value}>-</span>
                </div>
              </div>
            </section>

            <section className={Styles.card}>
              <h3 className={Styles.cardTitle}>Información de Contacto</h3>
              <div className={Styles.grid}>
                <div className={Styles.field}>
                  <span className={Styles.label}>Email Corporativo</span>
                  <span className={Styles.value}>{employee?.email ?? "-"}</span>
                </div>
                <div className={Styles.field}>
                  <span className={Styles.label}>Email Personal</span>
                  <span className={Styles.value}>-</span>
                </div>

                <div className={Styles.field}>
                  <span className={Styles.label}>Teléfono Oficina</span>
                  <span className={Styles.value}>-</span>
                </div>
                <div className={Styles.field}>
                  <span className={Styles.label}>Teléfono Personal</span>
                  <span className={Styles.value}>-</span>
                </div>

                <div className={Styles.fieldFull}>
                  <span className={Styles.label}>Dirección</span>
                  <span className={Styles.value}>-</span>
                </div>
              </div>
            </section>

            <section className={Styles.card}>
              <h3 className={Styles.cardTitle}>Datos Profesionales</h3>
              <div className={Styles.grid}>
                <div className={Styles.field}>
                  <span className={Styles.label}>Puesto</span>
                  <span className={Styles.value}>{employee?.position ?? "-"}</span>
                </div>
                <div className={Styles.field}>
                  <span className={Styles.label}>Departamento</span>
                  <span className={Styles.value}>{employee?.department ?? "-"}</span>
                </div>

                <div className={Styles.field}>
                  <span className={Styles.label}>Ubicación de Oficina</span>
                  <span className={Styles.value}>-</span>
                </div>
                <div className={Styles.field}>
                  <span className={Styles.label}>Fecha de Contratación</span>
                  <span className={Styles.value}>-</span>
                </div>

                <div className={Styles.fieldFull}>
                  <span className={Styles.label}>Observaciones</span>
                  <span className={Styles.value}>-</span>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;