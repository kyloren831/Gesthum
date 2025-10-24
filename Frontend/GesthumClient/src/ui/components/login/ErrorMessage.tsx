
import { useState, type Dispatch, type SetStateAction } from 'react';
import Styles from './ErrorMessage.module.css'
import { MdErrorOutline } from 'react-icons/md';
interface props{
  title:string;
  message:string ;
  active:boolean;
  setActive:Dispatch<SetStateAction<boolean>>;
  setLoading:Dispatch<SetStateAction<boolean>>;
  setErrorMessage:Dispatch<SetStateAction<string|null>>;
}
const ErrorMessage = ({title,message, active,setActive,setLoading,setErrorMessage}:props) => {

  const handleClick= () =>{
    setActive(!active);
    setLoading(false);
    setErrorMessage(null);
  }
  return (
    <div className={Styles.backGround}>
      <div className={active? Styles.container : Styles.close}>
        <div className={Styles.iconContainer}>
          <div className={Styles.icon}>
            <MdErrorOutline color='#E60000' className={Styles.insideIcon}></MdErrorOutline>
          </div>
        </div>
        <h1 className={Styles.h1}>{title}</h1>
        <p className={Styles.p}>{message}</p>
        <div className={Styles.btn} onClick={handleClick}>Entendido</div>
      </div>
    </div>
   
  )
}

export default ErrorMessage