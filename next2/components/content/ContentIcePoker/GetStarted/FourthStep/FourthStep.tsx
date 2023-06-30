import React, { FC, ReactElement } from 'react';
import { Button } from 'semantic-ui-react';
import styles from './FourthStep.module.scss';

export interface FourthStepType {
  className?: string;
}

const FourthStep: FC<FourthStepType> = ({ className = '' }: FourthStepType): ReactElement => (
  <div className={`fourth-step component ${className} ${styles.main_wrapper}`}>
    <div className={styles.title}>
      <h1>Play ICE Poker!</h1>
      <p>Two ways to play ICE Poker</p>
    </div>

    <div className={styles.content}>
      <div className={styles.box_div}>
        <div className={styles.box_title}>
          <h1>Play in the 3D Metaverse</h1>
        </div>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634617669/metaverse_kmhmrf.png" alt="avatar" />
        <div className={styles.button_div}>
          <Button
            onClick={() => {
              window.open('https://api.decentral.games/ice/play', '_blank');
            }}
          >
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620413783/MANA_jw7ylg.png" alt="mana" />
            Enter Decentraland
          </Button>
        </div>
      </div>

      <div className={styles.box_div}>
        <div className={styles.box_title}>
          <h1>Play On Your Browser</h1>
        </div>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634617750/Poker_Table_seodln.png" style={{ width: '130px' }} alt="marketplace" />
        <div className={styles.button_div}>
          <Button disabled>Coming Soon</Button>
        </div>
      </div>
    </div>
  </div>
);

export default FourthStep;
