import Styles from './gesthumLogo.module.css'

const gesthumLogo = ({size = "default"}) => {
  return (
    <div className={`${Styles.logoSection} ${Styles[size]}`}>
        <div className={Styles.iconImage}></div>
        <div>
          <h1 className={Styles.title}>GESTHUM</h1>
          <p className={Styles.subtitle}>Support Group</p>
        </div>
    </div>
  )
}

export default gesthumLogo