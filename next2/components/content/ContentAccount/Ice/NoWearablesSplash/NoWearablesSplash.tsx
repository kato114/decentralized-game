import React, { ReactElement } from 'react';
import { Button } from 'semantic-ui-react';
import styles from './NoWearablesSplash.module.scss';

const NoWearablesSplash = (): ReactElement => (
  <div className={styles.ice}>
    <div className={styles.ice_container}>
      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,q_auto:good/v1631007583/Group_190_qjjjgr.png" className={styles.ice_img} />
      <p className={styles.play_text}> Play-to-Earn with ICE Wearables </p>
      <p className={styles.play_lower}> Purchase ICE wearables and earn real cash value from free-to-play metaverse poker. </p>
      <span className={styles.button_span}>
        <Button className={styles.button_right} href="/games/ice">
          Browse Wearables
        </Button>
        {/* <ModalMint className={styles.right_button} ethPrice={0.3} /> */}
      </span>
    </div>
  </div>
);

export default NoWearablesSplash;
