import React, { useContext } from 'react';
import { Popup } from 'semantic-ui-react';
import cn from 'classnames';
import { GlobalContext } from '@/store';
import ModalMintAccessory from '@/components/modal/ModalMintAccessory';
import ModalLoginICE from 'components/modal/ModalLoginICE';
import styles from './MarketPlace.module.scss';

interface AccessoryCardsProps {
  isIce?: boolean;
  collectionMap?: any;
  contractAddress?: any;
}

const AccessoryCards: React.FC<AccessoryCardsProps> = ({ isIce, collectionMap, contractAddress }) => {
  // dispatch new user status to Context API store
  const [state] = useContext(GlobalContext);

  return collectionMap.map((item, i) => (
    <div key={i} className={styles.games_container}>
      <div className={styles.wear_box_purple}>
        <div className={styles.fullDiv}>
          <div className={styles.imgDiv}>
            <img
              className={styles.img}
              src={
                isIce
                  ? 'https://res.cloudinary.com/dnzambf4m/image/upload/v1646762021/iceenabled-banner1_ark2at.svg'
                  : 'https://res.cloudinary.com/dnzambf4m/image/upload/v1646762021/accessory-banner1_ouaqux.svg'
              }
            />
            <Popup
              trigger={<img className={styles.tooltip} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg" />}
              position="top left"
              hideOnScroll={true}
              className={cn('p2e_enabled_tooltip', styles.popup)}
            >
              <Popup.Content className={styles.tooltipContent}>
                <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg" />
                {isIce ? (
                  <p className={styles.popup_content}>
                    ICE Enabled wearables allow you
                    <br /> to earn real cash value from
                    <br /> free-to-play ICE poker tables.
                  </p>
                ) : (
                  <p className={styles.popup_content}>
                    Accessories are purely cosmetic.
                    <br /> They do not give you access to
                    <br /> ICE Poker tables.
                  </p>
                )}
              </Popup.Content>
            </Popup>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: -1 }}>
        <img className={styles.nft_image} src={item.imageUrl} />
        <div className={styles.accessory_price}>
          {item.maxMintCount === 100 ? '10,000' : '1,000'}
          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1630857308/diamond_1_1_r6etkk.png" alt="ice" />
        </div>
      </div>

      <div className={styles.nft_description}>
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <p className={styles.nft_info}>Accessory</p>

          {state.userStatus >= 4 ? (
            <p className={styles.nft_info}>
              {item.maxMintCount - item.numberMinted} of {item.maxMintCount} left
            </p>
          ) : (
            <p className={styles.nft_info}>- of - left</p>
          )}
        </span>
        <p className={styles.nft_other_p}>{item.line}</p>
        <h3 className={styles.nft_other_h3}>{item.name}</h3>
      </div>

      <div className={styles.button_container}>
        {(() => {
          // Logged In States
          if (state.userLoggedIn) {
            return (
              <div className={styles.flex_50}>
                <ModalMintAccessory
                  index={i}
                  maxMintCounts={item.maxMintCount}
                  numberLeft={item.maxMintCount - item.numberMinted}
                  itemId={item.itemId}
                  contractAddress={contractAddress}
                  wearableImg={item.imageUrl}
                  wearableBodyType={'Accessory'}
                  wearableBodyImg={null}
                  wearableName={item.name}
                />
              </div>
            );
          } else {
            // Logged Out State
            return (
              <div className={styles.flex_50}>
                <ModalLoginICE />
              </div>
            );
          }
        })()}
      </div>
    </div>
  ));
};

export default AccessoryCards;
