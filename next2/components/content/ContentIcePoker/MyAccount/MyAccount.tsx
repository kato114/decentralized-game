import React, { ReactElement } from 'react';
import styles from './MyAccount.module.scss';

const MyAccount = (): ReactElement => (
  <div className={styles.main_wrapper}>
    <div className={styles.title}>
      <h1>MyAccount</h1>
    </div>
  </div>
);

export default MyAccount;
