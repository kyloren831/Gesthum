import Styles from './footer.module.css';
import GesthumLogo from '../logo/gesthumLogo';
import { FaFacebook,FaMapLocation} from 'react-icons/fa6';
import { FaLinkedin,FaPhone } from 'react-icons/fa';
import { BiWorld } from 'react-icons/bi';
import { AiOutlineMail } from 'react-icons/ai';
import { TbWorldPin } from 'react-icons/tb';
const footer = () => {
  return (
    <div className={Styles.footerContainer}>
        <div className={Styles.iconContainer}>
            <GesthumLogo size='small'/>
        </div>
        <div className={Styles.subtitle}>
            Gestion Inteligente <br/> del Talento Humano.
        </div>
        <div className={Styles.contact}>
            <ul>
                <li><AiOutlineMail size={14}/> ventas@gesthum.com</li>
                <li><FaPhone size={14}/> +506 71710583</li>
                <li><FaMapLocation size={14}/> Puntarenas, El Cocal</li>
                <li><TbWorldPin size={14}/> gesthum.com</li>
            </ul>
        </div>
        <div className={Styles.links}>
            ©Strategy Company <FaFacebook/> <FaLinkedin/> <BiWorld/>
        </div>
    </div>
  )
}

export default footer