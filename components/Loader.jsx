import React from 'react';
import styles from '../styles/Loader.module.css'; // Import the CSS Module

const Loader = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.loader}></div>
  </div>
);

export default Loader;

