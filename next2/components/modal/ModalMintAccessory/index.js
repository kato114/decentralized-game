import { useEffect, useContext, useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { GlobalContext } from '@/store';

import ModalTokenAuth from 'components/modal/ModalTokenAuth';
import IceMintIceTooltip from 'components/tooltips/IceMintICETooltip';
import styles from './ModalMintAccessory.module.scss';
import Images from 'common/Images';
import Global from '../../Constants';
import Aux from '../../_Aux';

const ModalMintAccessory = props => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [openICEAuth, setOpenICEAuth] = useState(false);
  const [xDG, setXDG] = useState(0);
  const [iceAmount, setIceAmount] = useState(props.maxMintCounts === 100 ? 10000 : 1000);

  useEffect(() => {
    const xdgTotal = parseFloat(state.stakingBalances?.BALANCE_USER_GOVERNANCE) + parseFloat(state.DGBalances?.BALANCE_CHILD_TOKEN_XDG);

    setXDG(xdgTotal);
  }, [state.stakingBalances?.BALANCE_USER_GOVERNANCE, state.DGBalances?.BALANCE_CHILD_TOKEN_XDG]);

  // helper functions
  function drawWearable() {
    return (
      <div className={styles.mint_box}>
        <div className={styles.mint_box_purple}>
          <img src={props.wearableImg} className={styles.wearable_main_img} />
        </div>

        <div className={styles.card_body}>
          <div className={styles.card}>Accessory</div>
          <div className={styles.card}>
            {props.numberLeft} of {props.maxMintCounts}
          </div>
        </div>
      </div>
    );
  }

  function icePriceCheck() {
    return (
      <div className={styles.price_area}>
        <div className={styles.card_area}>
          <div className={styles.card_area_body}>
            {state.iceAmounts?.ICE_AVAILABLE_AMOUNT < iceAmount ? (
              <span>
                Not Enough
                {<IceMintIceTooltip />}
              </span>
            ) : null}

            <div className={styles.card}>
              {props.maxMintCounts === 100 ? '10,000' : '1,000'} ICE
              <img src={Images.ICE_NORMAL} className={styles.img_card2} />
            </div>

            {state.iceAmounts?.ICE_AVAILABLE_AMOUNT >= iceAmount ? (
              <div className={styles.green_check}>
                {Number(state.iceAmounts?.ICE_AVAILABLE_AMOUNT).toFixed(2)} ICE Available &nbsp;
                <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.83203 7.73047C4.10547 7.73047 4.32031 7.625 4.46875 7.40625L8.10547 1.86328C8.21094 1.70312 8.25391 1.55078 8.25391 1.41016C8.25391 1.03125 7.96484 0.75 7.57422 0.75C7.30859 0.75 7.14062 0.847656 6.97656 1.10156L3.81641 6.08594L2.21484 4.12109C2.06641 3.94141 1.90234 3.86328 1.67578 3.86328C1.28125 3.86328 0.996094 4.14453 0.996094 4.52734C0.996094 4.69922 1.04688 4.84766 1.19531 5.01562L3.21094 7.4375C3.37891 7.63672 3.57422 7.73047 3.83203 7.73047Z"
                    fill="#67DD6C"
                  />
                </svg>
              </div>
            ) : (
              <div className={styles.description}>{Number(state.iceAmounts?.ICE_AVAILABLE_AMOUNT).toFixed(2)} ICE Available</div>
            )}

            <div className={styles.network}>(On Polygon)</div>
          </div>
        </div>
      </div>
    );
  }

  function drawDesc() {
    return (
      <Aux>
        <div className={styles.header}>Mint {props.wearableName}</div>

        <div className={styles.benefit_area}>
          Details
          <div className={styles.benefit_list}>
            <ul>
              <li>Spice up your wearable fits with more style</li>
              <li>This item does not give you access to ICE Poker</li>
            </ul>
          </div>
        </div>

        <div className={styles.price_area}>Price</div>
      </Aux>
    );
  }

  function drawButtons() {
    return (
      <div className={styles.button_area}>
        {state.iceAmounts?.ICE_AVAILABLE_AMOUNT < iceAmount ? (
          <Button className={styles.button_upgrade} disabled={true}>
            Continue to Mint
          </Button>
        ) : (
          <Button
            className={styles.button_upgrade}
            onClick={() => {
              setOpen(false);
              setOpenICEAuth(true);
            }}
          >
            Continue to Mint
          </Button>
        )}
      </div>
    );
  }

  function openIceAuthModal() {
    return (
      <ModalTokenAuth
        itemId={props.itemId}
        contractAddress={props.contractAddress}
        wearableImg={props.wearableImg}
        show={openICEAuth}
        maxMintCounts={props.maxMintCounts}
        numberLeft={props.numberLeft}
        mintToken="ICE"
        nonICE={props.wearableBodyType === 'Accessory' ? true : false}
        isNftPurchaser={props.maxMintCounts === 100 ? true : false}
        back={() => {
          setOpen(true);
          setOpenICEAuth(false);
        }}
        close={() => {
          setOpenICEAuth(false);
        }}
      />
    );
  }

  function closeButton() {
    return (
      <div className={styles.modal_wrapper}>
        <span className={styles.button_close} onClick={() => setOpen(false)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
              fill="white"
            />
          </svg>
        </span>
      </div>
    );
  }

  return (
    <Aux>
      <Modal
        className={styles.mintable_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={<Button className={styles.wearable_button}>Mint Accessory</Button>}
      >
        {closeButton()}

        <div className={styles.mint_wrapper}>
          {drawWearable()}

          <div className={styles.mint_box_right}>
            {drawDesc()}
            {icePriceCheck()}
            {drawButtons()}
          </div>
        </div>
      </Modal>

      {openIceAuthModal()}
    </Aux>
  );
};

export default ModalMintAccessory;
