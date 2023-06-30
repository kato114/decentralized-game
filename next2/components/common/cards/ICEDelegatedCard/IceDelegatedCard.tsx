import React, { FC, ReactElement, useContext } from 'react';
import { GlobalContext } from '@/store';
import IceWearableBonusTooltip from 'components/tooltips/IceWearableBonusTooltip';
import ModalWithdrawDelegation from 'components/modal/ModalWithdrawDelegation';
import IceCheckedInTooltip from 'components/tooltips/IceCheckedInTooltip';
import styles from './IceDelegated.module.scss';
import Aux from '../../../_Aux';

export interface IceDelegatedCardType {
  item: any;
  className?: string;
}

const IceDelegatedCard: FC<IceDelegatedCardType> = ({ item, className = '' }: IceDelegatedCardType): ReactElement => {
  // get user's wallet address from the Context API store
  const [state] = useContext(GlobalContext);

  // define local variables
  const { name, description, rank, image, tokenId, checkInStatus, contractAddress, tokenOwner } = item;
  const bonus = '+' + item.bonus + '%';
  const delegationStatus = item.delegationStatus.isQueuedForUndelegationByDelegatee || item.delegationStatus.isQueuedForUndelegationByOwner;

  // helper functions
  function imageAndDescription(): ReactElement {
    return (
      <Aux>
        <div className={styles.wear_box_purple}>
          {checkInStatus && <IceCheckedInTooltip />}
          <img src={image} />
        </div>

        <div className={styles.card_body}>
          <div className={styles.delegated}>
            Delegated To You
            <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.49463 4.32715C5.49463 4.55566 5.41553 4.74463 5.22217 4.9292L1.91748 8.16357C1.77686 8.3042 1.60986 8.37012 1.41211 8.37012C1.00342 8.37012 0.673828 8.04053 0.673828 7.64062C0.673828 7.43408 0.757324 7.24951 0.911133 7.1001L3.77637 4.32275L0.911133 1.5542C0.757324 1.40039 0.673828 1.21582 0.673828 1.01367C0.673828 0.61377 1.00342 0.28418 1.41211 0.28418C1.60986 0.28418 1.77686 0.354492 1.91748 0.490723L5.22217 3.7251C5.41113 3.90967 5.49463 4.09424 5.49463 4.32715Z"
                fill="white"
              />
            </svg>
          </div>
          <div className={styles.card}>{`Rank ${rank}`}</div>
          <IceWearableBonusTooltip bonus={bonus} />
          <div className={styles.card}>{description.split(' ').at(-1).replace('/', ' of ')}</div>
        </div>

        <div className={styles.card_title}>
          <p>{name.split('(ICE')[0].trim()}</p>
          <p>{`(ICE Rank ${rank})`}</p>
        </div>
      </Aux>
    );
  }

  return (
    <div className={`ice-delegated-card component ${className} ${styles.card_container}`}>
      <div className={styles.wearable_modal}>
        <div className={styles.wear_box}>
          {imageAndDescription()}

          <div className={styles.button_area}>
            <ModalWithdrawDelegation
              tokenId={tokenId}
              rank={rank}
              contractAddress={contractAddress}
              tokenOwner={tokenOwner}
              delegateAddress={state.userAddress}
              delegationStatus={delegationStatus}
              buttonName="Withdraw Delegation"
              checkInStatus={checkInStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IceDelegatedCard;
