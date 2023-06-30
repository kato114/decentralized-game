import React, { ReactElement, useContext } from 'react';
import cn from 'classnames';
import { GlobalContext } from '../../store';
import styles from './banner.module.scss';

const Banner = (): ReactElement => {
  const [state] = useContext<any>(GlobalContext);

  if (state.appConfig.webNotice) {
    return <div className={cn(styles.banner)}>{state.appConfig.webNotice}</div>;
  } else {
    return null;
  }
};

export default Banner;
