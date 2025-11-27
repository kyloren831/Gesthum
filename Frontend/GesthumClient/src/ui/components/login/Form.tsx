import Styles from './form.module.css'
import { AiOutlineMail } from 'react-icons/ai';
import { LuLockKeyhole,LuLockKeyholeOpen } from 'react-icons/lu';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { UserClaims } from '../../../core/entities/UserClaims';
import ErrorMessage from './ErrorMessage';

const Form = () => {
  const [viewPass, setViewPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login, loading, setLoading } = useAuth();
  const [activeModal,setActiveModal] = useState(loading);
  const navegate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMsg(null);

    try {
      const user = await login(email,password);
      if(user){
        setLoading(false);
          return user.role == 'Admin' ? navegate('/adminDash') : navegate('/vacantes')
      }
    } catch (error) {
      console.log(error);
      setErrorMsg('Las credenciales que ingresaste son inválidas. Por favor inténtalo de nuevo.');
      setActiveModal(true);
    }
  }

  return (
        <form className={Styles.formContainer} onSubmit={handleSubmit}>
          <label htmlFor="email" className={Styles.emailLabel}>
            <input  
              className={Styles.txtInput} 
              type="email" 
              name='email' 
              placeholder='Correo'
              value={email}
              onChange={(e)=>{ setEmail(e.target.value)}}  
              required
            />
            <AiOutlineMail className={Styles.emailIcon} color='#102c5e'></AiOutlineMail>
          </label>
          <label htmlFor="password"  className={Styles.emailLabel}>
            <input  
              className={Styles.txtInput} 
              type={viewPass ? 'text':'password'} 
              name='password' 
              placeholder='Contraseña'
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              required 
            /> 
            {viewPass ? <LuLockKeyholeOpen className={Styles.emailIcon} color='#102c5e'/> : <LuLockKeyhole className={Styles.emailIcon} color='#102c5e'/>}
          </label>
          <div className={Styles.subMenu}>
            <label className={Styles.checkboxLabel}>
              <input  className={Styles.checkbox} type="checkbox" id="showPassword" onClick={()=>setViewPass(!viewPass)}/> Ver contraseña
            </label>
            <a href='#'>¿Olvidó su contraseña?</a>
          </div>
          {errorMsg&& <ErrorMessage title={'Error de Inicio de Sesión'} message={errorMsg} active={activeModal} setActive={setActiveModal} setLoading={setLoading} setErrorMessage={setErrorMsg}/>}
          <button type="submit" className={Styles.btnPrimary} disabled={loading}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>
  )
}

export default Form