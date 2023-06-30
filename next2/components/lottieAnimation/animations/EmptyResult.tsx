import React from 'react';
import { Button } from 'semantic-ui-react';
import styles from './animation.module.scss';

const EmptyResultAnimation: React.FC = () => {
  return (
    <div className={styles.main_section}>
      <img className={styles.image} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1642685731/image_jnqaxd.png" />
      <div className={styles.title}>More Wearables. More Players.</div>

      <div className={styles.desc}>
        Acquire more ICE Enabled Wearables to <br />
        expand your roster of poker players.
      </div>

      <Button className={styles.blue_button} href="/ice/marketplace">
        Browse Wearables
      </Button>
    </div>
  );
};

export default EmptyResultAnimation;
