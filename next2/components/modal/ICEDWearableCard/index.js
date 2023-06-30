import React, { useState } from 'react';
import cn from 'classnames';
import { Modal, Icon, Button, Header, Grid, Popup } from 'semantic-ui-react';
import styles from './ICEDWearableCard.module.scss';
import IceP2EEnabledTooltip from 'components/tooltips/IceP2EEnabledTooltip';
import IceNeedToActivateTooltip from 'components/tooltips/IceNeedToActivateTooltip';
import IceWearableBonusTooltip from 'components/tooltips/IceWearableBonusTooltip';
import ModalDelegate from 'components/modal/ModalDelegate';
import ModalWithdrawDelegation from 'components/modal/ModalWithdrawDelegation';
import NeedMoreUpgrade from 'components/modal/NeedMoreUpgrade';
import NeedMoreDGActivateModal from 'components/modal/NeedMoreDGActivateModal';
import ModalWearable from 'components/modal/ModalWearable';
import ActivateWearableModal from '../ActivateWearableModal';

const ICEDWearableCard = props => {
  const [pending, setPending] = useState(false);

  return (
    <>
      <div className={styles.wearable_modal}>
        <div className={styles.wear_box}>
          <div className={styles.wear_box_purple}>
            <div className={styles.delegatebtn}>
              Delegated To {props.contractAddress ? props.contractAddress : 'You'}
              <img
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632105564/next_i5mqo5.svg"
                alt="icon"
              />
            </div>
            {props.state == 2 ? (
              <IceNeedToActivateTooltip />
            ) : (
              <IceP2EEnabledTooltip />
            )}
            <img src={props.url} />
          </div>
          <div className={styles.card_body}>
            <div className={styles.card}>{props.rank}</div>
            <IceWearableBonusTooltip bonus={props.bonus} />
            <div className={styles.card}>1 of 100</div>
          </div>
          <div className={styles.card_meta}>DG Suit</div>
          <div className={styles.card_title}>
            {props.text ? props.text : 'DG Deezys'} <br />
            (ICE {props.rank})
          </div>
          <div className={styles.button_area}>
            {props.state == 1 ? (
              <span className="w-100 d-flex justify-content-between">
                <ModalDelegate
                  tokenId={props.tokenId}
                  contractAddress={props.contractAddress}
                  imgSrc={props.url}
                  rank={props.rank}
                  bonus={props.bonus}
                />

                <ModalWearable
                  tokenId={props.tokenId}
                  itemId={props.itemId}
                  contractAddress={props.contractAddress}
                />
              </span>
            ) : props.state == 2 ? (
              props.balance >= 500 ? (
                <ActivateWearableModal
                  setPending={setPending}
                  tokenId={props.tokenId}
                  contractAddress={props.contractAddress}
                />
              ) : (
                <NeedMoreDGActivateModal balance={props.balance} />
              )
            ) : (
              <ModalWithdrawDelegation rank={props.rank} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ICEDWearableCard;
