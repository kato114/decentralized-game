import React, { FC, ReactElement, useContext, useState, useRef } from 'react';
import AutosizeInput from 'react-input-autosize';
import { GlobalContext } from '@/store';
import IceP2EEnabledTooltip from 'components/tooltips/IceP2EEnabledTooltip';
import AccessoryTooltip from 'components/tooltips/AccessoryTooltip';
import IceNeedToActivateTooltip from 'components/tooltips/IceNeedToActivateTooltip';
import IceWearableBonusTooltip from 'components/tooltips/IceWearableBonusTooltip';
import IceCheckedInTooltip from 'components/tooltips/IceCheckedInTooltip';
import ModalIceDelegationBreakDown from 'components/modal/ModalIceDelegationBreakDown';
import Fetch from 'common/Fetch';
import styles from './IceWearable.module.scss';
import Aux from '../../../_Aux';
import WearableButton from './WearableButton';

export interface IceWearableCardType {
  item: any;
  delegation?: any;
  className?: string;
  isWearable?: boolean;
}

const IceWearableCard: FC<IceWearableCardType> = ({ item, delegation, className = '', isWearable = true }: IceWearableCardType): ReactElement => {
  // get user's wallet address from the Context API store
  const [state] = useContext(GlobalContext);
  const [showBreakDown, setShowingBreakDown] = useState(-1);
  const [nickName, setNickName] = useState(
    item.delegationStatus ? (item.delegationStatus.delegatedToNickname ? item.delegationStatus.delegatedToNickname : item.delegationStatus.delegatedTo || '') : null
  );
  const [pastNickName, savePastNickName] = useState(null);
  const [isEditingNickName, saveIsEditingNickName] = useState(false);

  const { name, description, rank, image, checkInStatus, isActivated, itemName, line } = item;
  const bonus = '+' + item.bonus + '%';
  const delegateAddress = item.delegationStatus ? item.delegationStatus.delegatedTo || '' : '';
  const nickNameInputRef = useRef<AutosizeInput>(null);

  async function saveUpdatedNickName(): Promise<void> {
    saveIsEditingNickName(false);

    if (!nickName) {
      setNickName(pastNickName);
    } else if (nickName !== pastNickName) {
      await Fetch.EDIT_DELEGATION_NICKNAME(nickName, delegateAddress);
      savePastNickName(nickName);
    }
  }

  function handleEditNickNameClick(): void {
    if (!isEditingNickName) {
      saveIsEditingNickName(true);
      savePastNickName(nickName);
      setNickName('');

      setTimeout(() => {
        nickNameInputRef.current.input.focus();
      }, 200);
    }
  }

  // helper functions
  function imageAndDescription(): ReactElement {
    return (
      <Aux>
        <div className={styles.wear_box_purple}>
          {isWearable ? !isActivated ? <IceNeedToActivateTooltip /> : checkInStatus ? <IceCheckedInTooltip /> : <IceP2EEnabledTooltip /> : <AccessoryTooltip />}
          <img src={image} />
        </div>

        {isWearable ? (
          <>
            <div className={styles.card_body}>
              {delegateAddress ? (
                <div className={styles.delegated}>
                  {isEditingNickName ? (
                    <AutosizeInput
                      ref={nickNameInputRef}
                      name="nick-name"
                      value={nickName}
                      onChange={e => {
                        setNickName(e.target.value);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          saveUpdatedNickName();
                        }
                      }}
                      onBlur={() => {
                        saveUpdatedNickName();
                      }}
                      disabled={!isEditingNickName}
                    />
                  ) : (
                    <h1 onClick={() => setShowingBreakDown(1)}>Delegated To {nickName.length > 12 ? nickName.substr(0, 12) + '...' : nickName}</h1>
                  )}
                  {state.userIsPremium && (
                    <img
                      className={styles.edit}
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/v1643126922/edit_p53oml.png"
                      alt="edit"
                      onClick={() => {
                        handleEditNickNameClick();
                      }}
                    />
                  )}
                </div>
              ) : null}
              <div className={styles.card}>{`Rank ${rank}`}</div>
              <IceWearableBonusTooltip bonus={bonus} />
              <div className={styles.card}>{description.split(' ').at(-1).replace('/', ' of ')}</div>
            </div>
            <div className={styles.card_title}>
              <p>{name ? name.split('(ICE')[0].trim() : ''}</p>
              <p>{`(ICE Rank ${rank})`}</p>
            </div>
          </>
        ) : (
          <>
            <div className={styles.card_body}>
              <div className={styles.card}>Accessory</div>
              <div className={styles.card}>{description.split(' ').at(-1).replace('/', ' of ')}</div>
            </div>

            <div className={styles.card_title}>
              <span>{line}</span>
              <p>{itemName}</p>
            </div>
          </>
        )}
      </Aux>
    );
  }

  return (
    <section className={`ice-wearable-card component ${className}`}>
      <div className={styles.card_container}>
        <div className={styles.wearable_modal}>
          <div className={styles.wear_box}>
            {imageAndDescription()}
            {isWearable && <WearableButton item={item} />}
          </div>
        </div>
      </div>

      {showBreakDown !== -1 && delegation ? (
        <ModalIceDelegationBreakDown
          iceWearableItems={state.iceWearableItems}
          playerAddress={delegation ? delegation.address : ''}
          delegationBreakdown={delegation ? delegation.breakdown : []}
          setShowingBreakDown={setShowingBreakDown}
        />
      ) : null}
    </section>
  );
};

export default IceWearableCard;
