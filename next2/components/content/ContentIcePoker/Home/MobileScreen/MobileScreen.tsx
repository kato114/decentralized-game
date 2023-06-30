import React, { ReactElement } from 'react';
import { Button } from 'semantic-ui-react';
import styles from './MobileScreen.module.scss';

const IceDashboardMobile = (): ReactElement => (
  <div className={styles.tout_container}>
    <h1 className={styles.tout_h1}>
      Get Wearables. <br />
      Play Free Poker. <br />
      Earn ICE.
    </h1>
    <img className={styles.tout_image} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1641906605/icePokerTable_c1ilew.png" alt="img" />
    <p className={styles.tout_p}>
      Play & earn with free play poker in the <br /> metaverse or in your web browser <br /> (coming soon). Metaverse beta is live!
    </p>
    <span className={styles.tout_span}>
      <Button className={styles.grey_button} href="https://docs.decentral.games/">
        Learn More
      </Button>
      <Button className={styles.blue_button} href="https://api.decentral.games/ice/play" target="_blank" disabled={true}>
        Play Now (Desktop Only)
      </Button>
    </span>
  </div>
);

export default IceDashboardMobile;
