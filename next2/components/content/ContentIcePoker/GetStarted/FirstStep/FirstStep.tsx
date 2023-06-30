import { switchMaticNetwork } from '@/common/utils';
import React, { FC, ReactElement } from 'react';
import { Button } from 'semantic-ui-react';
import styles from './FirstStep.module.scss';

export interface FirstStepType {
  className?: string;
}

const FirstStep: FC<FirstStepType> = ({ className = '' }: FirstStepType): ReactElement => (
  <div className={`first-step component ${className} ${styles.main_wrapper}`}>
    <div className={styles.title}>
      <h1>Create Metamask Wallet</h1>
      <p>Your Metamask Wallet is your gateway to ICE Poker, the metaverse, and beyond</p>
    </div>

    <div className={styles.content}>
      <div className={styles.box_div}>
        <div className={styles.box_title}>
          <h1>Download Extension</h1>
        </div>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png" alt="metamask" />
        <div className={styles.button_div}>
          <Button
            className={styles.firstButton}
            onClick={() => {
              window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en', '_blank');
            }}
          >
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634606779/chrome_ytab9e.png" alt="chrome" />
            Chrome
          </Button>
          <Button
            className={styles.secondButton}
            onClick={() => {
              window.open('https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/', '_blank');
            }}
          >
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634606779/firefox_ky0stl.png" alt="firefox" />
            Firefox
          </Button>
        </div>
      </div>

      <div className={styles.box_div}>
        <div className={styles.tag}>Optional Step</div>
        <div className={styles.box_title}>
          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634606779/polygon_rsgtjk.png" alt="polygon" />
          <h1>Add Polygon to Metamask</h1>
        </div>
        <div className={styles.content}>
          <div className={styles.network}>
            <p>Network Name</p>
            <div className={styles.border_div}>Polygon</div>
          </div>
          <div className={styles.rpcURL}>
            <p>New RPC URL</p>
            <div className={styles.border_div}>polygon-rpc.com</div>
          </div>
          <div className={styles.chainID}>
            <p>Chain ID</p>
            <div className={styles.border_div}>137</div>
          </div>
        </div>
        <div className={styles.button_div}>
          <Button
            onClick={() => {
              switchMaticNetwork();
            }}
          >
            Add Polygon
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default FirstStep;
