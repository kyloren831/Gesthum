import GesthumLogo from '../components/logo/gesthumLogo'
import Form from '../components/login/Form'
import Footer from '../components/footer/footer'
import Styles from './login.module.css'
import { useAuth } from '../hooks/useAuth'
const Login = () => {



  return (
    <div className={Styles.body}>
      <main className={Styles.mainContent}>
        <GesthumLogo />
        <Form/>
      </main>
     <Footer/>
    </div>
  )
}

export default Login