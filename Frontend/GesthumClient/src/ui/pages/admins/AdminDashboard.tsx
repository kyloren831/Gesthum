import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { useUserInfo } from "../../hooks/useUserInfo";
import Styles from './AdminDashboard.module.css';
import type { Admin } from "../../../core/entities/Admin";
import { useAuth } from "../../hooks/useAuth";

const adminDashboard = () => {

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
  },[userClaims]);
  
  return (
    <div className={Styles.body}>
      <Header jobPosition='Administrador de RH' name={admin? admin.name : 'error al cargar datos'}/>
    </div>
  )
}

export default adminDashboard