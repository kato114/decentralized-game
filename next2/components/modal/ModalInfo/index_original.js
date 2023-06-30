import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/SpinnerUpdated';
import { GlobalContext } from '@/store';
import Fetch from '../../../common/Fetch';
import styles from './ModalInfo.module.scss';
import cn from 'classnames';
import Global from '../../Constants';
import { formatPrice } from '@/common/utils';

const ModalInfo = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);

  const [DGTotal, setDGTotal] = useState(0);
  const [DGTotal_2, setDGTotal_2] = useState(0);

  // const [supply, setSupply] = useState(0);
  const [DGPrice, setDGPrice] = useState(0);

  useEffect(() => {
    const totalDG =
      // parseFloat(state.DGBalances?.BALANCE_MINING_DG) +

      // parseFloat(state.DGBalances?.BALANCE_STAKING_BALANCER_1) +
      // parseFloat(state.DGBalances?.BALANCE_STAKING_BALANCER_2) +

      // parseFloat(state.DGBalances?.BALANCE_KEEPER_DG) +
      parseFloat(state.DGBalances?.BALANCE_ROOT_DG_LIGHT) + parseFloat(state.DGBalances?.BALANCE_CHILD_DG_LIGHT);

    // parseFloat(state.stakingBalances?.BALANCE_USER_GOVERNANCE); // **************

    // parseFloat(state.DGBalances?.BALANCE_STAKING_UNISWAP) +
    // parseFloat(state.DGBalances?.BALANCE_STAKING_GOVERNANCE);

    const totalDGAdjusted_temp = totalDG.toFixed(3);
    const totalDGAdjusted = Number(totalDGAdjusted_temp);

    setDGTotal(totalDGAdjusted);

    const totalDG_2 = parseFloat(state.stakingBalances?.BALANCE_USER_GOVERNANCE) + parseFloat(state.DGBalances?.BALANCE_CHILD_TOKEN_XDG);

    const totalDGAdjusted_temp_2 = totalDG_2.toFixed(3);
    const totalDGAdjusted_2 = Number(totalDGAdjusted_temp_2);

    // const totalDGAdjusted_2 = totalDG.toFixed(0);
    setDGTotal_2(totalDGAdjusted_2);
  }, [state.DGBalances, state.stakingBalances]);

  useEffect(() => {
    if (state.openModalInfo) {
      setOpen(true);
    }
    state.openModalInfo = false;
  }, [state.openModalInfo]);

  // total unclaimed
  // const unclaimed = Number(state.stakingBalances?.BALANCE_USER_GOVERNANCE);
  // Number(state.DGBalances?.BALANCE_STAKING_UNISWAP) +

  // Number(state.DGBalances?.BALANCE_MINING_DG) + // update with new dgPointer once deployed
  // const unclaimed = Number(0); // ********** update with new dgPointer once deployed **********

  // Number(state.DGBalances?.BALANCE_KEEPER_DG);

  // console.log(
  //   'BALANCE_USER_GOVERNANCE: ' + state.stakingBalances?.BALANCE_USER_GOVERNANCE
  // );
  // console.log(
  //   'BALANCE_STAKING_UNISWAP: ' + state.DGBalances?.BALANCE_STAKING_UNISWAP
  // );
  // console.log('BALANCE_MINING_DG: ' + state.DGBalances?.BALANCE_MINING_DG);
  // console.log('BALANCE_KEEPER_DG: ' + state.DGBalances?.BALANCE_KEEPER_DG);

  // fetch circulating supply
  useEffect(() => {
    (async function () {
      const json = await Fetch.DG_SUPPLY_GECKO();

      if (json && json.market_data) {
        // setSupply(json.market_data.circulating_supply);
        setDGPrice(json.market_data.current_price.usd);
      }
    })();
  }, []);

  const temp_2 = DGTotal_2 * DGPrice;
  const unclaimedUSD = temp_2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <Modal
      className={styles.info_modal}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <span>
          {!state.DGBalances?.BALANCE_KEEPER_DG ? (
            <Button className="account-button" style={{ marginTop: 0 }}>
              <p className="right-menu-text bnb" style={{ marginTop: '-5px' }}>
                <Spinner width={30} height={30} />
              </p>
            </Button>
          ) : state.DGBalances?.BALANCE_KEEPER_DG == 10 ? null : (
            <Button className="account-button" style={{ marginTop: 0 }}>
              <p className="right-menu-text bnb">{DGTotal.toLocaleString()} DG</p>
            </Button>
          )}
        </span>
      }
    >
      <div
        style={{
          marginTop: '-60px',
          marginBottom: '45px',
          marginLeft: '-30px'
        }}
      >
        <span className={styles.button_close} onClick={() => setOpen(false)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
              fill="white"
            />
          </svg>
        </span>
      </div>

      <div>
        <span>
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '280px'
              }}
            >
              <h3 className={styles.title}>Your DG Breakdown</h3>

              <section style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img className={styles.dg_image} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631325895/dgNewLogo_hkvlps.png" />
                  {state.DGBalances?.BALANCE_KEEPER_DG == 10 ? (
                    <h4 className={styles.subtitle_1}>0.000 DG</h4>
                  ) : (
                    <h4 className={styles.subtitle_1}>{formatPrice(DGTotal, 3)} DG</h4>
                  )}
                  <p className={styles.subtitle_2}>${unclaimedUSD}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img className={styles.dg_image} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1637260602/grayLogo_ojx2hi.png" />

                  {state.DGBalances?.BALANCE_KEEPER_DG == 10 ? (
                    <h4 className={styles.subtitle_1}>0.000 xDG</h4>
                  ) : (
                    <h4 className={styles.subtitle_1}>{formatPrice(DGTotal_2, 3)} xDG</h4>
                  )}

                  <p className={styles.subtitle_2}>${unclaimedUSD}</p>
                </div>
              </section>
            </span>
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0px 12px 0px 12px'
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title}>Staked DG (xDG)</h5>
              <p className={styles.row_subtitle}>Staked in Governance</p>
            </span>

            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
                {formatPrice(state.stakingBalances?.BALANCE_USER_GOVERNANCE, 3)}
              </h5>
              <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
                ${formatPrice(state.stakingBalances?.BALANCE_USER_GOVERNANCE * DGPrice, 2)}
              </p>
            </span>
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 12px 0px 12px'
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title}>Mainchain DG</h5>
              <p className={styles.row_subtitle}>ETH Mainnet Total</p>
            </span>

            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
                {formatPrice(state.DGBalances?.BALANCE_ROOT_DG_LIGHT, 3)}
              </h5>
              <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
                ${formatPrice(state.DGBalances?.BALANCE_ROOT_DG_LIGHT * DGPrice, 2)}
              </p>
            </span>
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0px 12px 0px 12px'
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title}>Polygon DG</h5>
              <p className={styles.row_subtitle}>Polygon Network Total</p>
            </span>

            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
                {formatPrice(state.DGBalances?.BALANCE_CHILD_DG_LIGHT, 3)}
              </h5>
              <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
                ${formatPrice(state.DGBalances?.BALANCE_CHILD_DG_LIGHT * DGPrice, 2)}
              </p>
            </span>
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0px 12px 6px 12px'
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title}>Unclaimed DG</h5>
              <p className={styles.row_subtitle}>Gameplay Rewards</p>
            </span>

            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
                {formatPrice(state.DGBalances?.BALANCE_MINING_DG_V2, 3)}
              </h5>
              <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
                ${formatPrice(state.DGBalances?.BALANCE_MINING_DG_V2 * DGPrice, 2)}
              </p>
            </span>
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 12px 0px 12px'
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title}>Mainchain (Old) $DG</h5>
              <p className={styles.row_subtitle}>Total From All Sources</p>
            </span>

            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
                {formatPrice(state.DGBalances?.BALANCE_ROOT_DG, 3)}
              </h5>
              <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
                ${formatPrice(state.DGBalances?.BALANCE_ROOT_DG * DGPrice, 2)}
              </p>
            </span>
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0px 12px 0px 12px'
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title}>Polygon (Old) $DG</h5>
              <p className={styles.row_subtitle}>Total From All Sources</p>
            </span>

            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
                {formatPrice(state.DGBalances?.BALANCE_CHILD_DG, 3)}
              </h5>
              <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
                ${formatPrice(state.DGBalances?.BALANCE_CHILD_DG * DGPrice, 2)}
              </p>
            </span>
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '24px'
            }}
          >
            <a href={`https://app.uniswap.org/#/swap?outputCurrency=${Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG}`} target="_blank">
              <button className={cn('btn', styles.buy_button)}>Buy DG</button>
            </a>
            <Link href="/dg/governance" target="_blank">
              <button className={cn('btn', styles.learn_button)}>Stake DG</button>
            </Link>
          </span>
        </span>
      </div>
    </Modal>
  );
};

export default ModalInfo;
