import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Modal, Button } from 'semantic-ui-react';
import styles from './CheckMintableModal.module.scss';
import Global from '../../Constants';
import Aux from '../../_Aux';
import { Biconomy } from '@biconomy/mexa';
import Web3 from 'web3';
import ABI_CHILD_TOKEN_WETH from '../../ABI/ABIChildTokenWETH';
import ABI_CHILD_TOKEN_ICE from '../../ABI/ABIChildTokenICE';
import ABI_ICE_REGISTRANT from '../../../components/ABI/ABIICERegistrant.json';
import MetaTx from '../../../common/MetaTx';
import { Loader } from 'semantic-ui-react';
import { parse } from '@ethersproject/transactions';
import CheckMintTooltip from 'components/tooltips/CheckMintTooltip';
import BigNumber from 'bignumber.js';

const CheckMintableModal = props => {
  // fetch user's Polygon DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);

  const [tokenContractETH, setTokenContractETH] = useState({});
  const [tokenContractICE, setTokenContractICE] = useState({});

  const [spenderAddress, setSpenderAddress] = useState('');
  const [authStatus, setAuthStatus] = useState(false);
  const [clickedAuthEth, setClickedAuthEth] = useState(false);
  const [web3, setWeb3] = useState({});
  const [errorText, setErrorText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [biconomyReady, setBiconomyReady] = useState(false);
  const [xDG, setXDG] = useState(0);
  const [iceRegistrantContract, setIceRegistrantContract] = useState({});
  const [instances, setInstances] = useState(false);
  const [mintingPrice, setMintingPrice] = useState(0);
  const [userBalanceEth, setUserBalanceEth] = useState(0);
  const [userBalanceIce, setUserBalanceIce] = useState(0);

  useEffect(() => {
    setUserBalanceEth(state.userBalances[2][3]);
    setUserBalanceIce(state.iceAmounts.ICE_AVAILABLE_AMOUNT);
  }, [state.userBalances, state.iceAmounts]);

  // initialize Web3 providers and create token contract instance
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(new Web3.providers.HttpProvider(state.appConfig.polygonRPC), {
        apiKey: Global.KEYS.BICONOMY_API_1,
        debug: true
      });
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      const spenderAddress = Global.ADDRESSES.ICE_REGISTRANT_ADDRESS;
      setSpenderAddress(spenderAddress);

      const tokenContractETH = new getWeb3.eth.Contract(ABI_CHILD_TOKEN_WETH, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH);
      setTokenContractETH(tokenContractETH);

      const tokenContractICE = new getWeb3.eth.Contract(ABI_CHILD_TOKEN_ICE, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ICE);
      setTokenContractICE(tokenContractICE);

      const iceRegistrantContract = new getWeb3.eth.Contract(ABI_ICE_REGISTRANT, Global.ADDRESSES.ICE_REGISTRANT_ADDRESS);
      setIceRegistrantContract(iceRegistrantContract);

      setInstances(true); // contract instantiation complete

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Approve ETH (wearables)');
          setBiconomyReady(true);
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (instances) {
      (async function () {
        // update token hash from iceRegistrant contract
        const minting_price = await iceRegistrantContract.methods.mintingPrice().call();

        const amountAdjusted = Number(new BigNumber(minting_price).div(new BigNumber(10).pow(Global.CONSTANTS.TOKEN_DECIMALS)));

        setMintingPrice(amountAdjusted);
      })();
    }
  }, [instances]);

  // get WETH authorization status based on tokenAuths state object
  useEffect(() => {
    const authStatus = state.mintToken === 'ETH' ? state.tokenAuths.WETH_AUTHORIZATION : state.tokenAuths.ICE_AUTHORIZATION;

    console.log('authStatus 2 checking ... ', authStatus);
    setAuthStatus(authStatus);
  }, [state.tokenAuths]);

  useEffect(() => {
    const xdgTotal = parseFloat(state.stakingBalances?.BALANCE_USER_GOVERNANCE) + parseFloat(state.DGBalances?.BALANCE_CHILD_TOKEN_XDG);

    setXDG(xdgTotal);
  }, [state.stakingBalances?.BALANCE_USER_GOVERNANCE, state.DGBalances?.BALANCE_CHILD_TOKEN_XDG]);

  // helper functions

  function modalButtons(type) {
    if (type === 'help') {
      return (
        <a href="https://decentral.games/discord" target="_blank">
          <span className={styles.button_help}>
            <svg width="22" height="20" viewBox="0 -1 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <rect width="22" height="20" fill="url(#pattern0)" />
              <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0" transform="translate(0.0965909) scale(0.00378788 0.00416667)" />
                </pattern>
                <image
                  id="image0"
                  width="213"
                  height="240"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
            Help
          </span>
        </a>
      );
    } else if (type === 'close') {
      return (
        <span
          className={styles.button_close}
          onClick={() => {
            setOpen(false);
            // props.setPending(false);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
              fill="white"
            />
          </svg>
        </span>
      );
    }
  }

  function checkBalance() {
    if (
      authStatus &&
      checkEnoughETHorICE() &&
      (state.stakingBalances?.BALANCE_USER_GOVERNANCE_OLD >= Global.CONSTANTS.DG_STAKED_AMOUNT || xDG >= Global.CONSTANTS.XDG_STAKED_AMOUNT)
    ) {
      return true;
    } else {
      return false;
    }
  }

  function checkEnoughETHorICE() {
    if (state.mintToken === 'ETH') {
      return parseFloat(userBalanceEth) >= mintingPrice;
    } else {
      return parseFloat(userBalanceIce) >= mintingPrice;
    }
  }

  function title() {
    return <Aux>{checkBalance() ? <div className={styles.title}>You’re Ready to Mint</div> : <div className={styles.title}>You’re Not Ready to Mint</div>}</Aux>;
  }

  function logo() {
    return (
      <Aux>
        <div className={styles.logo}>
          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636423902/check-mark_fvx9a4.png" />
        </div>
      </Aux>
    );
  }

  function dgSection() {
    return (
      <Aux>
        <div className={styles.body_section}>
          {/* left block */}
          <div className={styles.dg_section}>
            <div className={styles.dg_round_edit}>
              {!checkEnoughETHorICE() && (
                <div className={styles.tooltip}>
                  Not Enough
                  <CheckMintTooltip staking={false} />
                </div>
              )}
              {mintingPrice} {state.mintToken}
              {state.mintToken === 'ETH' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11.8125" cy="12" r="11.6875" fill="#EFEFEF" />
                  <path d="M11.811 4.31958L7.1377 12.2557L11.811 10.082V4.31958Z" fill="#8A92B2" />
                  <path d="M11.811 10.0823L7.1377 12.2559L11.811 15.0835V10.0823Z" fill="#62688F" />
                  <path d="M16.4849 12.2557L11.8108 4.31958V10.082L16.4849 12.2557Z" fill="#62688F" />
                  <path d="M11.8108 15.0835L16.4849 12.2559L11.8108 10.0823V15.0835Z" fill="#454A75" />
                  <path d="M7.1377 13.1631L11.811 19.9029V15.9889L7.1377 13.1631Z" fill="#8A92B2" />
                  <path d="M11.8108 15.9889V19.9029L16.4875 13.1631L11.8108 15.9889Z" fill="#62688F" />
                </svg>
              ) : (
                <img
                  style={{ width: '24px', marginTop: '-4px' }}
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
                />
              )}
            </div>

            <div className={styles.dg_desc}>
              {!checkEnoughETHorICE() ? (
                <>
                  <span className={styles.dg_insufficient}>
                    {state.mintToken === 'ETH' ? userBalanceEth : Math.floor(userBalanceIce)} {state.mintToken} Available &nbsp;
                  </span>
                  <br />
                  (On Polygon)
                </>
              ) : (
                <>
                  <span className={styles.dg_available}>
                    <span title={userBalanceEth}>{state.mintToken === 'ETH' ? userBalanceEth : Math.floor(userBalanceIce)}</span> {state.mintToken} Available&nbsp;
                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4.33606 9.70984C4.71204 9.70984 5.00745 9.56482 5.21155 9.26404L10.212 1.64246C10.3571 1.42224 10.4161 1.21277 10.4161 1.01941C10.4161 0.498413 10.0187 0.111694 9.48157 0.111694C9.11633 0.111694 8.88538 0.245972 8.65979 0.595093L4.31458 7.44861L2.11243 4.74695C1.90833 4.49988 1.68274 4.39246 1.37122 4.39246C0.828735 4.39246 0.436646 4.77917 0.436646 5.30554C0.436646 5.54187 0.50647 5.74597 0.710571 5.97693L3.48206 9.30701C3.71301 9.58093 3.98157 9.70984 4.33606 9.70984Z"
                        fill="#67DD6C"
                      />
                    </svg>
                  </span>
                  <br />
                  (On Polgyon)
                </>
              )}
            </div>
          </div>

          {/* middle plus */}
          <div className={styles.dg_plus}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.3471 0.11419H3.8171V3.39219H0.561096V5.92219H3.8171V9.17819H6.3471V5.92219H9.6251V3.39219H6.3471V0.11419Z" fill="white" />
            </svg>
          </div>

          {/* right block */}
          <div className={styles.dg_section}>
            <div className={styles.dg_round_edit}>
              <div className={styles.tooltip}>
                Staking Requirement
                <CheckMintTooltip staking={true} />
              </div>
              1,000 xDG
              <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.625" cy="12.9375" r="12.375" fill="#424242" />
                <path
                  d="M8.2001 8.52484L6.56567 6.89446C9.4732 3.91315 14.6857 3.3582 18.29 6.61824C21.9932 9.96664 22.0036 15.6516 18.501 19.0269C14.8863 22.5111 9.50915 21.9774 6.56999 18.949L8.1983 17.3218C8.21628 17.3377 8.24181 17.3578 8.26662 17.3815C8.55784 17.6422 8.85229 17.8998 9.18198 18.1124C9.77196 18.4941 10.4218 18.7743 11.1044 18.9415C12.5174 19.2854 14.0066 19.1217 15.3109 18.4788C15.8817 18.1973 16.4059 17.83 16.8652 17.3897C17.9096 16.3899 18.5713 15.0568 18.7358 13.6211C18.8355 12.7391 18.7445 11.8459 18.469 11.0021C18.1935 10.1582 17.7399 9.38323 17.1388 8.72958C16.2964 7.81364 15.2663 7.20768 14.0601 6.90488C12.6677 6.56393 11.2001 6.71364 9.90536 7.32872C9.32565 7.59817 8.79501 7.96236 8.33529 8.4063C8.29933 8.44222 8.25942 8.47814 8.22096 8.51119C8.21451 8.51647 8.20752 8.52104 8.2001 8.52484Z"
                  fill="white"
                />
                <path
                  d="M15.5963 14.376L14.1632 12.9436H18.2428C18.2892 15.0341 16.9233 17.5488 14.1801 18.3609C12.8534 18.7524 11.4293 18.6463 10.1753 18.0625C8.92142 17.4788 7.92405 16.4576 7.37066 15.191C6.81727 13.9243 6.74596 12.4993 7.17014 11.1838C7.59432 9.86827 8.48478 8.75282 9.67418 8.04705C12.1211 6.59591 14.9894 7.26365 16.5606 8.89654L14.9276 10.5255C14.3225 9.92994 13.5826 9.60739 12.7233 9.56428C12.0284 9.52576 11.3393 9.71027 10.7567 10.0909C10.319 10.3707 9.95226 10.7481 9.68523 11.1935C9.41819 11.6389 9.25815 12.14 9.21769 12.6576C9.17723 13.1752 9.25745 13.6951 9.45205 14.1765C9.64665 14.6578 9.95032 15.0876 10.3392 15.4319C10.7281 15.7762 11.1916 16.0258 11.6933 16.161C12.195 16.2961 12.7213 16.3132 13.2307 16.2109C13.7402 16.1086 14.2189 15.8896 14.6294 15.5713C15.0399 15.2529 15.3708 14.8438 15.5963 14.376Z"
                  fill="white"
                />
                <path
                  d="M12.041 15.7139C11.3842 15.5906 10.7921 15.2395 10.3692 14.7225C9.9463 14.2056 9.71976 13.556 9.72955 12.8885C9.75112 11.3483 10.9257 10.3142 12.0399 10.1367L12.041 15.7139Z"
                  fill="white"
                />
              </svg>
              <div className={styles.middle_dg}>or</div>1 (Old) DG
              <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.625" cy="12.9375" r="12.375" fill="#006cff" />
                <path
                  d="M8.2001 8.52484L6.56567 6.89446C9.4732 3.91315 14.6857 3.3582 18.29 6.61824C21.9932 9.96664 22.0036 15.6516 18.501 19.0269C14.8863 22.5111 9.50915 21.9774 6.56999 18.949L8.1983 17.3218C8.21628 17.3377 8.24181 17.3578 8.26662 17.3815C8.55784 17.6422 8.85229 17.8998 9.18198 18.1124C9.77196 18.4941 10.4218 18.7743 11.1044 18.9415C12.5174 19.2854 14.0066 19.1217 15.3109 18.4788C15.8817 18.1973 16.4059 17.83 16.8652 17.3897C17.9096 16.3899 18.5713 15.0568 18.7358 13.6211C18.8355 12.7391 18.7445 11.8459 18.469 11.0021C18.1935 10.1582 17.7399 9.38323 17.1388 8.72958C16.2964 7.81364 15.2663 7.20768 14.0601 6.90488C12.6677 6.56393 11.2001 6.71364 9.90536 7.32872C9.32565 7.59817 8.79501 7.96236 8.33529 8.4063C8.29933 8.44222 8.25942 8.47814 8.22096 8.51119C8.21451 8.51647 8.20752 8.52104 8.2001 8.52484Z"
                  fill="white"
                />
                <path
                  d="M15.5963 14.376L14.1632 12.9436H18.2428C18.2892 15.0341 16.9233 17.5488 14.1801 18.3609C12.8534 18.7524 11.4293 18.6463 10.1753 18.0625C8.92142 17.4788 7.92405 16.4576 7.37066 15.191C6.81727 13.9243 6.74596 12.4993 7.17014 11.1838C7.59432 9.86827 8.48478 8.75282 9.67418 8.04705C12.1211 6.59591 14.9894 7.26365 16.5606 8.89654L14.9276 10.5255C14.3225 9.92994 13.5826 9.60739 12.7233 9.56428C12.0284 9.52576 11.3393 9.71027 10.7567 10.0909C10.319 10.3707 9.95226 10.7481 9.68523 11.1935C9.41819 11.6389 9.25815 12.14 9.21769 12.6576C9.17723 13.1752 9.25745 13.6951 9.45205 14.1765C9.64665 14.6578 9.95032 15.0876 10.3392 15.4319C10.7281 15.7762 11.1916 16.0258 11.6933 16.161C12.195 16.2961 12.7213 16.3132 13.2307 16.2109C13.7402 16.1086 14.2189 15.8896 14.6294 15.5713C15.0399 15.2529 15.3708 14.8438 15.5963 14.376Z"
                  fill="white"
                />
                <path
                  d="M12.041 15.7139C11.3842 15.5906 10.7921 15.2395 10.3692 14.7225C9.9463 14.2056 9.71976 13.556 9.72955 12.8885C9.75112 11.3483 10.9257 10.3142 12.0399 10.1367L12.041 15.7139Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className={styles.dg_desc}>
              {state.stakingBalances?.BALANCE_USER_GOVERNANCE_OLD >= Global.CONSTANTS.DG_STAKED_AMOUNT || xDG >= Global.CONSTANTS.XDG_STAKED_AMOUNT ? (
                <span className={styles.dg_available}>
                  You Have Enough Staked&nbsp;
                  <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4.33606 9.70984C4.71204 9.70984 5.00745 9.56482 5.21155 9.26404L10.212 1.64246C10.3571 1.42224 10.4161 1.21277 10.4161 1.01941C10.4161 0.498413 10.0187 0.111694 9.48157 0.111694C9.11633 0.111694 8.88538 0.245972 8.65979 0.595093L4.31458 7.44861L2.11243 4.74695C1.90833 4.49988 1.68274 4.39246 1.37122 4.39246C0.828735 4.39246 0.436646 4.77917 0.436646 5.30554C0.436646 5.54187 0.50647 5.74597 0.710571 5.97693L3.48206 9.30701C3.71301 9.58093 3.98157 9.70984 4.33606 9.70984Z"
                      fill="#67DD6C"
                    />
                  </svg>
                </span>
              ) : (
                <>
                  <span className={styles.dg_insufficient}>You must be holding 1000+ xDG or have 1 + (old) DG</span>
                  <br />
                  staked in governance to mint
                </>
              )}
            </div>
          </div>
        </div>
        {!authStatus && (
          <div className={styles.buttons}>
            <Button
              disabled={loading}
              className={styles.primary}
              onClick={() => {
                metaTransaction(state.mintToken);
              }}
            >
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png" />
              {loading ? <Loader /> : 'Authorize ' + state.mintToken}
            </Button>
          </div>
        )}
      </Aux>
    );
  }

  // Biconomy API meta-transaction. User must authorize WETH or ICE token contract to access their funds
  async function metaTransaction(token) {
    try {
      let tokenContract = {};
      let MetaTxNumber = 0;

      console.log('Meta-transaction: ' + token);

      if (token === 'ICE') {
        tokenContract = tokenContractICE;
        MetaTxNumber = 8;
      } else if (token === 'DGLight') {
        tokenContract = tokenContractETH;
        MetaTxNumber = 15;
      }

      console.log(state.mintToken + ' authorization amount: ' + Global.CONSTANTS.MAX_AMOUNT);
      setClickedAuthEth(true);
      setLoading(true);
      setErrorText(null);

      if (token === 'ICE') {
        tokenContract = tokenContractICE;
        MetaTxNumber = 8;
      } else {
        tokenContract = tokenContractETH;
        MetaTxNumber = 6;
      }

      let functionSignature = tokenContract.methods.approve(spenderAddress, Global.CONSTANTS.MAX_AMOUNT).encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(MetaTxNumber, functionSignature, tokenContract, state.userAddress, web3);

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
        setErrorText('ETH Authorization failed, please try again');
        setClickedAuthEth(false);
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // update global state token authorizations
        const refresh = !state.refreshTokenAuths;

        dispatch({
          type: 'refresh_token_auths',
          data: refresh
        });
        setAuthStatus(true);
        setLoading(false);

        // show toast
        dispatch({
          type: 'show_toastMessage',
          data: 'Authorize successful!'
        });
      }
    } catch (error) {
      console.log(state.mintToken + ' authorization error: ' + error);
      setErrorText(state.mintToken + ' Authorization failed, please try again');

      setClickedAuthEth(false);
      setLoading(false);
    }
  }

  return (
    <Aux>
      <Modal
        className={styles.check_mintable_modal}
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {
          setOpen(true);
        }}
        open={open}
        close
        trigger={
          <Button className={styles.check_eligibility}>
            Check Eligibility
            <span style={{ paddingLeft: '6px' }}>
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.29492 4.97461C6.29004 4.71582 6.20215 4.51074 5.99219 4.30566L2.31543 0.711914C2.15918 0.560547 1.97852 0.482422 1.75391 0.482422C1.30469 0.482422 0.933594 0.848633 0.933594 1.29297C0.933594 1.51758 1.02637 1.72266 1.19727 1.89355L4.38086 4.96973L1.19727 8.05566C1.02637 8.22168 0.933594 8.42676 0.933594 8.65625C0.933594 9.10059 1.30469 9.4668 1.75391 9.4668C1.97363 9.4668 2.15918 9.39355 2.31543 9.2373L5.99219 5.64355C6.20215 5.43848 6.29492 5.22852 6.29492 4.97461Z"
                  fill="white"
                />
              </svg>
            </span>
          </Button>
        }
      >
        <div className={styles.top_buttons}>
          {modalButtons('close')}
          {/* {modalButtons('help')} */}
        </div>

        {title()}
        {checkBalance() && logo()}
        {dgSection()}
      </Modal>
    </Aux>
  );
};

export default CheckMintableModal;
