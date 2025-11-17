import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { useUserInfo } from "../../hooks/useUserInfo";
import Styles from './AdminDashboard.module.css';
import type { Admin } from "../../../core/entities/Admin";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/sidebar/Sidebar";

const AdminDashboard = () => {

  const {adminInfo} = useUserInfo();
  const [admin, setAdmin] = useState<Admin|undefined>(undefined);
  const {userClaims} = useAuth();

  useEffect(()=>{
    const userInfo = async () =>{
      if(userClaims){
        const info = await adminInfo(Number.parseInt(userClaims.id));
        setAdmin(info);
      }      
    }
    userInfo();
  },[userClaims, adminInfo]);
  
  return (
    <div className={Styles.body}>
      <div className={Styles.pageLayout}>
        <Sidebar />
        <div className={Styles.contentArea}>
          <Header />
          <main className={Styles.mainContent}>
            <h2>Bienvenido, { admin?.name }</h2>
            {/* VacanciesList removido para usar la página /vacantes */}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard