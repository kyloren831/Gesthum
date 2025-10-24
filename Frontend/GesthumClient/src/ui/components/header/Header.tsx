import Styles from './Header.module.css'
import GesthumLogo from '../logo/gesthumLogo';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';
import { LuLogOut } from 'react-icons/lu';
import { CgProfile } from 'react-icons/cg';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
interface props{
    jobPosition:string;
    name:string;
}
const Header = ({jobPosition, name}:props) => {

    const {userClaims, logout} = useAuth();
    const navegate = useNavigate();
    const handleLogout = async () =>{
        console.log(userClaims);
        try {
            await logout();
            navegate('/');
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className={Styles.headerContainer}>
        <div className={Styles.logoContainer}>
            <GesthumLogo size='small'/>
        </div>
        <div className={Styles.inputContainer}>
            <input className={Styles.searchInput} placeholder='Buscar'/>
            <AiOutlineSearch className={Styles.searchIcon}/>
        </div>
        <img className={Styles.userImage} src="https://scontent.fjap1-1.fna.fbcdn.net/v/t39.30808-6/333333343_749062866849695_3886057689489806020_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=KhyvvvLtCksQ7kNvwFQBaoD&_nc_oc=AdkRhOvtbW-ohc-_y1IRzGuf3Wq6O4w7tk3gE_UVbqQ08aYmA47ydDdt64R3RWgzLqU&_nc_zt=23&_nc_ht=scontent.fjap1-1.fna&_nc_gid=Ts7py6w5xfVUxLG0YRA0HQ&oh=00_AfcWIMXesOrJGDtIkbsWZItmmCRstgeYLalmgmj5p9divw&oe=68FF7F10" alt="userImage"/>
        <div className={Styles.userInfo}>
            <h1 className={Styles.userJobPosition}>{jobPosition}</h1>
            <div className={Styles.menu}>
                <div className={Styles.userNameContainer}>
                    <h2 className={Styles.userName}>{name}</h2>
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