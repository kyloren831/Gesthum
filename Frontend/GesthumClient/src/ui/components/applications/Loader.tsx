import React from 'react';
import styles from './ApplicationsList.module.css';

const Loader: React.FC = () => (
  <div className={styles.loaderContainer}>
    <img
      className={styles.loaderImg}
      src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
      alt="Cargando..."
    />
  </div>
);

export default Loader;