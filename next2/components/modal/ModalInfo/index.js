import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/SpinnerUpdated';
import { GlobalContext } from '@/store';
import styles from './ModalInfo.module.scss';
import cn from 'classnames';
import Global from '../../Constants';
import { formatPrice } from '@/common/utils';

const ModalInfo = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [dgTotal, setDGTotal] = useState(0);
  const [dgTotalUSD, setDGTotalUSD] = useState(0);
  const [xdgTotal, setXDGTotal] = useState(0);
  const [xdgTotalUSD, setXDGTotalUSD] = useState(0);
  const [xdgMainnet, setXDGMainnet] = useState(0);
  const [xdgMainnetUSD, setXDGMainnetUSD] = useState(0);
  const [xdgPolygon, setXDGPolygon] = useState(0);
  const [xdgPolygonUSD, setXDGPolygonUSD] = useState(0);
  const [dgSummationNew, setDGSummationNew] = useState(null);
  const [DGPrice, setDGPrice] = useState(0);

  useEffect(() => {
    const dgTotal = parseFloat(state.DGBalances?.BALANCE_ROOT_DG_LIGHT) + parseFloat(state.DGBalances?.BALANCE_CHILD_DG_LIGHT);

    setDGTotal(dgTotal);
    setDGTotalUSD(dgTotal * DGPrice);

    const xdgTotal = parseFloat(state.stakingBalances?.BALANCE_USER_GOVERNANCE) + parseFloat(state.DGBalances?.BALANCE_CHILD_TOKEN_XDG);

    setXDGTotal(xdgTotal);
    setXDGTotalUSD(xdgTotal * DGPrice);
    setXDGMainnet(state.stakingBalances?.BALANCE_USER_GOVERNANCE);
    setXDGMainnetUSD(state.stakingBalances?.BALANCE_USER_GOVERNANCE * DGPrice);
    setXDGPolygon(state.DGBalances?.BALANCE_CHILD_TOKEN_XDG);
    setXDGPolygonUSD(state.DGBalances?.BALANCE_CHILD_TOKEN_XDG * DGPrice);

    const dgSummationNew = dgTotal + xdgTotal;
    setDGSummationNew(dgSummationNew);
  }, [state.DGBalances, state.stakingBalances, DGPrice]);

  useEffect(() => {
    if (state.openModalInfo) {
      setOpen(true);
    }
    state.openModalInfo = false;
  }, [state.openModalInfo]);

  useEffect(() => {
    async function fetchData() {
      setDGPrice(state.DGPrices.dg);
    }

    fetchData();
  }, [state.DGPrices]);

  function topAmounts() {
    return (
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '90%'
          }}
        >
          <h3 className={styles.title}>Your DG Breakdown</h3>

          <section style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
              <img className={styles.dg_image} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631325895/dgNewLogo_hkvlps.png" />

              <h4 className={styles.subtitle_1}>{formatPrice(dgTotal, 0)} DG</h4>

              <p className={styles.subtitle_2}>${formatPrice(dgTotalUSD, 2)}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
              <img className={styles.dg_image} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1637260602/grayLogo_ojx2hi.png" />

              <h4 className={styles.subtitle_1}>{formatPrice(xdgTotal, 0)} xDG</h4>

              <p className={styles.subtitle_2}>${formatPrice(xdgTotalUSD, 2)}</p>
            </div>
          </section>
        </span>
      </span>
    );
  }

  function mainchainXDG() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0px 12px 0px 12px'
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title}>Mainnet xDG</h5>

          <p className={styles.row_subtitle}>DG Staked on ETH Mainnet</p>
        </span>

        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
            {formatPrice(xdgMainnet, 3)}
          </h5>

          <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
            ${formatPrice(xdgMainnetUSD, 2)}
          </p>
        </span>
      </span>
    );
  }

  function mainchainDG() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '6px 12px 0px 12px'
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title}>Mainnet DG</h5>

          <p className={styles.row_subtitle}>DG on ETH Mainnet</p>
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
    );
  }

  function polygonXDG() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0px 12px 0px 12px'
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title}>Polygon xDG</h5>

          <p className={styles.row_subtitle}>DG Staked on Polygon</p>
        </span>

        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
            {formatPrice(xdgPolygon, 3)}
          </h5>

          <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
            ${formatPrice(xdgPolygonUSD, 2)}
          </p>
        </span>
      </span>
    );
  }

  function polygonDG() {
    return (
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
    );
  }

  function breakdownButton() {
    return (
      <span>
        {dgSummationNew !== null ? (
          <Button className="account-button" style={{ marginTop: 0 }}>
            <p className="right-menu-text bnb">{formatPrice(dgSummationNew, 0).toLocaleString()} DG</p>
          </Button>
        ) : (
          <Button className="account-button" style={{ marginTop: 0 }}>
            <p className="right-menu-text bnb" style={{ marginTop: '-5px' }}>
              <Spinner width={30} height={30} />
            </p>
          </Button>
        )}
      </span>
    );
  }

  function closeButton() {
    return (
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
    );
  }

  function buyAndStakeButtons() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '24px',
          paddingLeft: '12px',
          paddingRight: '10px'
        }}
      >
        <a href={`https://app.uniswap.org/#/swap?outputCurrency=${Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG_LIGHT}`} target="_blank">
          <button className={cn('btn', styles.buy_button)}>Buy DG</button>
        </a>

        <Link href="/dg/governance" target="_blank">
          <button className={cn('btn', styles.learn_button)}>Stake DG</button>
        </Link>
      </span>
    );
  }

  return (
    <Modal className={styles.info_modal} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} close trigger={breakdownButton()}>
      {closeButton()}
      {topAmounts()}
      {mainchainXDG()}
      {mainchainDG()}
      {polygonXDG()}
      {polygonDG()}
      {buyAndStakeButtons()}
    </Modal>
  );
};

export default ModalInfo;
