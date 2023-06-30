import { useContext, useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import styles from './ModalWearable.module.scss';
import IceUpgradeWearableTooltip from 'components/tooltips/IceUpgradeWearableTooltip';
import NeedMoreUpgrade from 'components/modal/NeedMoreUpgrade';
import ModalUpgradeSuccess from 'components/modal/ModalUpgradeSuccess';
import ModalUpgradePending from 'components/modal/ModalUpgradePending';
import ModalDelegate from 'components/modal/ModalDelegate';
import Global from '../../../components/Constants';

const ModalWearable = props => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const [upgrade, setUpgrade] = useState(0);
  const [upgradeCost, setUpgradeCost] = useState(0);
  const {
    ICE_COST_AMOUNT_2,
    ICE_COST_AMOUNT_3,
    ICE_COST_AMOUNT_4,
    ICE_COST_AMOUNT_5,
    DG_COST_AMOUNT_2,
    DG_COST_AMOUNT_3,
    DG_COST_AMOUNT_4,
    DG_COST_AMOUNT_5,
    XP_COST_AMOUNT_2,
    XP_COST_AMOUNT_3,
    XP_COST_AMOUNT_4,
    XP_COST_AMOUNT_5
  } = state.tokenAmounts;

  ////////////////////////////////////////////////////////////////////
  /////////////// Bonus Array, ICE Prices, Img Array
  const [wearableName, setWearableName] = useState(props.name.replace('Diamond Hands ', ''));

  console.log('Loading wearableName:', wearableName);

  const bonus = [
    '0%', // Rank 0
    '+1 - 7%', // Rank 1
    '+8 - 15%', // Rank 2
    '+16 - 24%', // Rank 3
    '+25 - 34%', // Rank 4
    '+35 - 45%' // Rank 5
  ];

  const icePrices = [
    0, // Rank 0
    0, // Rank 1
    ICE_COST_AMOUNT_2, // Rank 2
    ICE_COST_AMOUNT_3, // Rank 3
    ICE_COST_AMOUNT_4, // Rank 4
    ICE_COST_AMOUNT_5 // Rank 5
  ];

  const dgPrices = [
    0, // Rank 0
    0, // Rank 1
    DG_COST_AMOUNT_2, // Rank 2
    DG_COST_AMOUNT_3, // Rank 3
    DG_COST_AMOUNT_4, // Rank 4
    DG_COST_AMOUNT_5 // Rank 5
  ];

  const xpPrices = [
    0, // Rank 0
    0, // Rank 1
    XP_COST_AMOUNT_2, // Rank 2
    XP_COST_AMOUNT_3, // Rank 3
    XP_COST_AMOUNT_4, // Rank 4
    XP_COST_AMOUNT_5 // Rank 5
  ];

  // Returns the current ice wearable ranking + 1
  const nextIceWearableRank = parseInt(Math.min(props.rank + 1, 5));

  return (
    <>
      {upgrade == 0 && (
        <Modal
          className={styles.wearable_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<Button className={styles.open_button}>Upgrade</Button>}
        >
          <div className={styles.close_icon} onClick={() => setOpen(false)}>
            <span className={styles.button_close}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
                  fill="white"
                />
              </svg>
            </span>
          </div>
          <div style={{ color: 'white', display: 'flex', gap: '24px' }}>
            <div className={styles.wear_box}>
              <div
                style={{
                  width: '240px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div className={styles.wear_box_mark}>
                  {props.bonus}
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1630857308/diamond_1_1_r6etkk.png" className={styles.img_card} />
                </div>
              </div>
              <div className={styles.wear_box_purple}>
                <img src={props.imgSrc} />
              </div>
              <div className={styles.card_body}>
                <div className={styles.card}>Rank {props.rank}</div>
                <div className={styles.card}>
                  {props.bonus}
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1630857308/diamond_1_1_r6etkk.png" className={styles.img_card} />
                </div>
                <div className={styles.card}>{props.description.split(' ').at(-1).replace('/', ' of ')}</div>
              </div>
            </div>

            <div className={styles.upgrade_arrow}>
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632104564/blue-arrow_Traced_oy95nf.svg" alt="Upgrade" />
            </div>

            <div className={styles.wear_box}>
              <IceUpgradeWearableTooltip />

              <div
                style={{
                  width: '240px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div className={styles.wear_box_mark}>
                  {bonus[Math.min(props.rank + 1, 5)]}
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1630857308/diamond_1_1_r6etkk.png" className={styles.img_card} />
                </div>
              </div>

              <div className={styles.wear_box_pink}>
                <img src={props.imgUpgradeSrc} />
              </div>

              <div className={styles.card_body}>
                <div className={styles.card}>Rank {Math.min(props.rank + 1, 5)}</div>
                <div className={styles.card}>
                  {bonus[Math.min(props.rank + 1, 5)]}
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1630857308/diamond_1_1_r6etkk.png" className={styles.img_card} />
                </div>
                <div className={styles.card}>{props.description.split(' ').at(-1).replace('/', ' of ')}</div>
              </div>
            </div>

            <div className={styles.wear_box_right}>
              <div className={styles.header}>Upgrade ICE Wearable</div>

              <div className={styles.benefit_area}>
                Benefits
                <div className={styles.benefit_list}>
                  <ul>
                    <li>Update your ICE Bonus to between {bonus[Math.min(props.rank + 1, 5)]}</li>
                    <li>
                      Update your owner delegation split to {Math.round(state.delegatorSplits[props.rank] * 100)}/{Math.round((1 - state.delegatorSplits[props.rank]) * 100)}
                    </li>
                    <li>Increase the resale value and rarity of your NFT</li>
                  </ul>
                </div>
              </div>

              <div className={styles.price_area}>
                <div className={styles.card_area}>
                  <div className={styles.card_area_body}>
                    {state.iceAmounts?.ICE_AVAILABLE_AMOUNT < icePrices[Math.min(props.rank + 1, 5)] && <span className={styles.not_enough}>Not Enough</span>}
                    <div className={styles.card}>
                      {`${parseFloat(icePrices[Math.min(props.rank + 1, 5)]).toFixed() / 1000}K ICE`}
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1630857308/diamond_1_1_r6etkk.png" className={styles.img_card1} />
                    </div>

                    {state.iceAmounts?.ICE_AVAILABLE_AMOUNT < icePrices[Math.min(props.rank + 1, 5)] ? (
                      <div className={styles.description}>{parseFloat(state.iceAmounts?.ICE_AVAILABLE_AMOUNT).toLocaleString()} ICE Available</div>
                    ) : (
                      <div className={styles.greenCheck}>
                        {parseFloat(state.iceAmounts?.ICE_AVAILABLE_AMOUNT).toLocaleString()} ICE Available
                        <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M3.83203 7.73047C4.10547 7.73047 4.32031 7.625 4.46875 7.40625L8.10547 1.86328C8.21094 1.70312 8.25391 1.55078 8.25391 1.41016C8.25391 1.03125 7.96484 0.75 7.57422 0.75C7.30859 0.75 7.14062 0.847656 6.97656 1.10156L3.81641 6.08594L2.21484 4.12109C2.06641 3.94141 1.90234 3.86328 1.67578 3.86328C1.28125 3.86328 0.996094 4.14453 0.996094 4.52734C0.996094 4.69922 1.04688 4.84766 1.19531 5.01562L3.21094 7.4375C3.37891 7.63672 3.57422 7.73047 3.83203 7.73047Z"
                            fill="#67DD6C"
                          />
                        </svg>
                      </div>
                    )}

                    <div className={styles.network}>(On Polygon)</div>
                  </div>

                  <div className={styles.plusIcon}>
                    <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.672 0.103999H2.832V2.488H0.464V4.328H2.832V6.696H4.672V4.328H7.056V2.488H4.672V0.103999Z" fill="white" />
                    </svg>
                  </div>

                  <div className={styles.card_area_body}>
                    {parseFloat(state.DGBalances?.BALANCE_CHILD_DG_LIGHT).toFixed(2) < dgPrices[Math.min(props.rank + 1, 5)] && (
                      <span className={styles.not_enough}>Not Enough</span>
                    )}
                    <div className={styles.card}>
                      {dgPrices[Math.min(props.rank + 1, 5)]}
                      <img
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/android-chrome-512x512_rmiw1y.png"
                        className={styles.img_card2}
                      />
                    </div>
                    {state.DGBalances?.BALANCE_CHILD_DG_LIGHT < dgPrices[Math.min(props.rank + 1, 5)] ? (
                      <div className={styles.description}>{parseFloat(state.DGBalances?.BALANCE_CHILD_DG_LIGHT).toFixed(2)} DG Available</div>
                    ) : (
                      <div className={styles.greenCheck}>
                        {parseFloat(state.DGBalances?.BALANCE_CHILD_DG_LIGHT).toFixed(2)} DG Available
                        <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M3.83203 7.73047C4.10547 7.73047 4.32031 7.625 4.46875 7.40625L8.10547 1.86328C8.21094 1.70312 8.25391 1.55078 8.25391 1.41016C8.25391 1.03125 7.96484 0.75 7.57422 0.75C7.30859 0.75 7.14062 0.847656 6.97656 1.10156L3.81641 6.08594L2.21484 4.12109C2.06641 3.94141 1.90234 3.86328 1.67578 3.86328C1.28125 3.86328 0.996094 4.14453 0.996094 4.52734C0.996094 4.69922 1.04688 4.84766 1.19531 5.01562L3.21094 7.4375C3.37891 7.63672 3.57422 7.73047 3.83203 7.73047Z"
                            fill="#67DD6C"
                          />
                        </svg>
                      </div>
                    )}

                    <div className={styles.network}>(On Polygon)</div>
                  </div>

                  <div className={styles.plusIcon}>
                    <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.672 0.103999H2.832V2.488H0.464V4.328H2.832V6.696H4.672V4.328H7.056V2.488H4.672V0.103999Z" fill="white" />
                    </svg>
                  </div>

                  <div className={styles.card_area_body}>
                    {state.userInfo.balanceXP < xpPrices[Math.min(props.rank + 1, 5)] && <span className={styles.not_enough}>Not Enough</span>}
                    <div className={styles.card}>
                      {xpPrices[Math.min(props.rank + 1, 5)]}
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1629727455/XP_zbnvuf.png" className={styles.img_card3} />
                    </div>
                    {state.userInfo.balanceXP < xpPrices[Math.min(props.rank + 1, 5)] ? (
                      <div className={styles.description}>{state.userInfo.balanceXP} XP Available</div>
                    ) : (
                      <div className={styles.greenCheck}>
                        {parseInt(state.userInfo.balanceXP)} XP Available
                        <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M3.83203 7.73047C4.10547 7.73047 4.32031 7.625 4.46875 7.40625L8.10547 1.86328C8.21094 1.70312 8.25391 1.55078 8.25391 1.41016C8.25391 1.03125 7.96484 0.75 7.57422 0.75C7.30859 0.75 7.14062 0.847656 6.97656 1.10156L3.81641 6.08594L2.21484 4.12109C2.06641 3.94141 1.90234 3.86328 1.67578 3.86328C1.28125 3.86328 0.996094 4.14453 0.996094 4.52734C0.996094 4.69922 1.04688 4.84766 1.19531 5.01562L3.21094 7.4375C3.37891 7.63672 3.57422 7.73047 3.83203 7.73047Z"
                            fill="#67DD6C"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.button_area}>
                {state.userInfo.balanceXP >= 50 &&
                state.DGBalances?.BALANCE_CHILD_DG_LIGHT >= 100 &&
                state.iceAmounts?.ICE_AVAILABLE_AMOUNT >= icePrices[Math.min(props.rank + 1, 5)] ? (
                  <Button
                    className={styles.button_upgrade}
                    onClick={() => {
                      setOpen(false);
                      setUpgrade(2);
                    }}
                  >
                    Upgrade Wearable
                  </Button>
                ) : (
                  <Button
                    className={styles.button_upgrade}
                    onClick={() => {
                      setOpen(false);
                      setUpgrade(1);
                    }}
                  >
                    Upgrade Wearable
                  </Button>
                )}
                <Button
                  className={styles.button_close}
                  onClick={() => {
                    window.open('https://docs.decentral.games/ice-wearables', '_blank');
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {upgrade == 1 && (
        <NeedMoreUpgrade upgradeNeedIceAmount={icePrices[nextIceWearableRank]} upgradeNeedDgAmount={0.1} upgradeNeedXpAmount={50} setUpgrade={setUpgrade} setPropsOpen={setOpen} />
      )}

      {upgrade == 2 && <ModalUpgradePending setUpgrade={setUpgrade} tokenId={props.tokenId} contractAddress={props.contractAddress} itemId={props.itemId} />}

      {upgrade == 3 && (
        <ModalUpgradeSuccess
          tokenId={props.tokenId}
          setUpgrade={setUpgrade}
          imgURL={props.imgSrc} //the wearable will already be upgraded in state.iceWearableItems already
          delegateAddress={props.delegateAddress}
        />
      )}

      {upgrade == 4 && (
        <ModalDelegate
          tokenID={props.tokenID}
          contractAddress={props.contractAddress}
          rank={props.rank}
          bonus={props.bonus}
          setUpgrade={setUpgrade}
          buttonName={'Upgrade'}
          redelegateAddress={props.delegateAddress}
          redelegation
        />
      )}
    </>
  );
};

export default ModalWearable;
