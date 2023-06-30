import React, { FC, ReactElement } from 'react';
import Link from 'next/link';
import { Button } from 'semantic-ui-react';
import styles from './SecondStep.module.scss';

export interface SecondStepType {
  className?: string;
}

const SecondStep: FC<SecondStepType> = ({ className = '' }: SecondStepType): ReactElement => (
  <div className={`second-step component ${className} ${styles.main_wrapper}`}>
    <div className={styles.title}>
      <h1>Get 1 ICE Wearable To Start Playing</h1>
      <p>Two methods to acquiring an ICE NFT Wearable</p>
    </div>

    <div className={styles.content}>
      <div className={styles.box_div}>
        <div className={styles.box_title}>
          <h1>Buy on Marketplace</h1>
        </div>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634610802/marketplace_lr9n7z.png" alt="marketplace" />
        <div className={styles.button_div}>
          <Link href="/ice/marketplace">
            <Button>
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634610493/clipboard_dlp3sh.png" alt="marketplace" />
              Explore Marketplace
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.box_div}>
        <div className={styles.box_title}>
          <h1>Get a Delegation</h1>
        </div>
        <div className={styles.content}>
          <li>
            Join the{' '}
            <a href="https://decentral.games/discord" target="_blank" rel="noreferrer">
              Decentral Games Discord
            </a>
            <br />
            <abbr />
            to find potential delegations (rented
            <br />
            <abbr />
            ICE NFT Wearables)
          </li>
        </div>
        <div className={styles.button_div}>
          <Button
            onClick={() => {
              window.open('https://decentral.games/discord', '_blank');
            }}
          >
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634610493/discord_ny46dw.png" alt="discord" />
            Find Delegators (Discord)
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default SecondStep;
