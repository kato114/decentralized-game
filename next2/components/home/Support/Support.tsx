import React, { FC, ReactElement, useState, useContext } from 'react';
import { GlobalContext } from '@/store';
import SupportWidget from '../../support/ToolWidget';
import SupportAnimation from 'components/lottieAnimation/animations/Support';
import ErrorAnimation from 'components/lottieAnimation/animations/Error404';
import styles from './Support.module.scss';

export interface SupportType {
  className?: string;
}

const Support: FC<SupportType> = ({ className = '' }: SupportType): ReactElement => {
  // get user status from the Context API store
  const [state] = useContext(GlobalContext);
  const [supportNumber, setSupportNumber] = useState(0);

  return (
    <section className={`support component ${className} ${styles.support}`}>
      {state.userStatus >= 20 ? (
        <>
          <SupportAnimation />
          <div className={styles.support_content}>
            <div
              className={styles.support_tool}
              onClick={() => {
                setSupportNumber(1);
              }}
            >
              Free Play & Chip Balances
            </div>
            <div
              className={styles.support_tool}
              onClick={() => {
                setSupportNumber(2);
              }}
            >
              Bulk Block Users
            </div>
            <div
              className={styles.support_tool}
              onClick={() => {
                setSupportNumber(3);
              }}
            >
              Find Blocked User
            </div>
          </div>

          {supportNumber >= 1 ? (
            <SupportWidget
              status={supportNumber}
              close={() => {
                setSupportNumber(0);
              }}
            />
          ) : null}
        </>
      ) : (
        <ErrorAnimation />
      )}
    </section>
  );
};

export default Support;
