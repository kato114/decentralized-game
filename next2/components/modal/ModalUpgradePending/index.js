import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Biconomy } from '@biconomy/mexa';
import Web3 from 'web3';
import ABI_DG_LIGHT_TOKEN from '../../../components/ABI/ABIChildTokenLightDG';
import ABI_CHILD_TOKEN_ICE from '../../../components/ABI/ABIChildTokenICE';
import ABI_COLLECTION_V2 from '../../../components/ABI/ABICollectionV2';
import ABI_COLLECTION_PH from '../../../components/ABI/ABICollectionPH';
import ABI_COLLECTION_LINENS from '../../../components/ABI/ABICollectionLinens';
import ABI_COLLECTION_BOMBER from '../../../components/ABI/ABICollectionBomber';
import ABI_COLLECTION_CRYPTO_DRIP from '../../../components/ABI/ABICollectionCryptoDrip';
import ABI_COLLECTION_JOKER from '../../../components/ABI/ABICollectionJoker';
import ABI_COLLECTION_CHEF from '../../../components/ABI/ABICollectionChef';
import ABI_COLLECTION_BEACH from '../../../components/ABI/ABICollectionBeach';
import ABI_COLLECTION_AIRLINE from '../../../components/ABI/ABICollectionAirline';
import ABI_COLLECTION_POET from '../../../components/ABI/ABICollectionPoet';
import ABI_COLLECTION_SPARTAN from '../../../components/ABI/ABICollectionSpartan';
import ABI_COLLECTION_CYBERPUNK from '../../../components/ABI/ABICollectionCyberpunk';
import ABI_COLLECTION_VIKING from '../../../components/ABI/ABICollectionViking';
import ABI_COLLECTION_MUTANT from '../../../components/ABI/ABICollectionMutant';
import ABI_COLLECTION_FOUNDING_FATHERS from '../../../components/ABI/ABICollectionFoundingFather';
import MetaTx from '../../../common/MetaTx';
import Fetch from '../../../common/Fetch';
import { Modal, Button } from 'semantic-ui-react';
import styles from './ModalUpgradePending.module.scss';
import MetamaskAction, { ActionLine } from 'components/common/MetamaskAction';
import Global from '../../Constants';
import Aux from '../../_Aux';
import LoadingAnimation from 'components/lottieAnimation/animations/LoadingAnimation';

const ModalUpgradePending = props => {
  // fetch tokenAmounts data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [instance, setInstance] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [web3, setWeb3] = useState({});
  const [spenderAddress, setSpenderAddress] = useState('');
  const [authStatusICE, setAuthStatusICE] = useState(false);
  const [authStatusDGLight, setAuthStatusDGLight] = useState(false);
  const [authStatusNFT, setAuthStatusNFT] = useState(false);
  const [authStatusUpgrade, setAuthStatusUpgrade] = useState(false);
  const [tokenContractICE, setTokenContractICE] = useState({});
  const [tokenContractDGLight, setTokenContractDGLight] = useState({});
  const [collectionContract, setCollectionContract] = useState({});
  const [mexaStatus, setMexaStatus] = useState(false);
  const [collectionID, setCollectionID] = useState(0);
  const [progSteps, setProgSteps] = useState([]);
  const [activeItem, setActiveItem] = useState({});
  const [refreshActiveItem, setRefreshActiveItem] = useState(false);
  const [successInUpgrade, setSuccessInUpgrade] = useState(false);

  // initialize Web3 providers and create token contract instance
  useEffect(() => {
    if (state.userStatus >= 4) {
      console.log('Wearables token ID: ' + props.tokenId);
      console.log('Wearables item ID: ' + props.itemId);

      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(new Web3.providers.HttpProvider(state.appConfig.polygonRPC), {
        apiKey: Global.KEYS.BICONOMY_API_1,
        debug: true
      });
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      const spenderAddress = Global.ADDRESSES.ICE_REGISTRANT_ADDRESS;
      setSpenderAddress(spenderAddress);

      const tokenContractICE = new getWeb3.eth.Contract(ABI_CHILD_TOKEN_ICE, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ICE);
      setTokenContractICE(tokenContractICE);

      const tokenContractDGLight = new getWeb3.eth.Contract(ABI_DG_LIGHT_TOKEN, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG_LIGHT);
      setTokenContractDGLight(tokenContractDGLight);

      let collectionContract = {};
      let collectionID = 0;

      if (props.contractAddress === Global.ADDRESSES.COLLECTION_V2_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_V2, Global.ADDRESSES.COLLECTION_V2_ADDRESS);
        collectionID = 10;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_PH_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_PH, Global.ADDRESSES.COLLECTION_PH_ADDRESS);
        collectionID = 12;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_LINENS_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_LINENS, Global.ADDRESSES.COLLECTION_LINENS_ADDRESS);
        collectionID = 13;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_BOMBER_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_BOMBER, Global.ADDRESSES.COLLECTION_BOMBER_ADDRESS);
        collectionID = 14;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_CRYPTO_DRIP_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_CRYPTO_DRIP, Global.ADDRESSES.COLLECTION_CRYPTO_DRIP_ADDRESS);
        collectionID = 16;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_FOUNDING_FATHERS_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_FOUNDING_FATHERS, Global.ADDRESSES.COLLECTION_FOUNDING_FATHERS_ADDRESS);
        collectionID = 17;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_JOKER_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_JOKER, Global.ADDRESSES.COLLECTION_JOKER_ADDRESS);
        collectionID = 18;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_CHEF_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_CHEF, Global.ADDRESSES.COLLECTION_CHEF_ADDRESS);
        collectionID = 19;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_BEACH_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_BEACH, Global.ADDRESSES.COLLECTION_BEACH_ADDRESS);
        collectionID = 20;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_AIRLINE_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_AIRLINE, Global.ADDRESSES.COLLECTION_AIRLINE_ADDRESS);
        collectionID = 21;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_POET_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_POET, Global.ADDRESSES.COLLECTION_POET_ADDRESS);
        collectionID = 22;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_SPARTAN_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_SPARTAN, Global.ADDRESSES.COLLECTION_SPARTAN_ADDRESS);
        collectionID = 23;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_CYBERPUNK_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_CYBERPUNK, Global.ADDRESSES.COLLECTION_CYBERPUNK_ADDRESS);
        collectionID = 24;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_VIKING_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_VIKING, Global.ADDRESSES.COLLECTION_VIKING_ADDRESS);
        collectionID = 25;
      } else if (props.contractAddress === Global.ADDRESSES.COLLECTION_MUTANT_ADDRESS) {
        collectionContract = new getWeb3.eth.Contract(ABI_COLLECTION_MUTANT, Global.ADDRESSES.COLLECTION_MUTANT_ADDRESS);
        collectionID = 26;
      }

      setCollectionContract(collectionContract);
      setCollectionID(collectionID);

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Approve ICE, DG, NFT (wearables)');
          setMexaStatus(true);
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  // get ICE and DG authorization status' based on tokenAuths state object
  useEffect(() => {
    const authStatusICE = state.tokenAuths.ICE_AUTHORIZATION;
    const authStatusDGLight = state.tokenAuths.DG_LIGHT_AUTHORIZATION;

    setAuthStatusICE(authStatusICE);
    setAuthStatusDGLight(authStatusDGLight);
    setInstance(true);
  }, [state.tokenAuths]);

  useEffect(() => {
    if (successInUpgrade) {
      console.log('WEARABLE upgrading successful');
      refresh();
      setLoading(false);
      setUpdateStatus({ name: 'WEARABLE', value: 'done' });
      setSuccessInUpgrade(false);

      props.setUpgrade(3);
      setAuthStatusUpgrade(true);
      setOpen(false);
      setInstance(true);
    }
  }, [successInUpgrade]);

  // get NFT authorization state based on props.tokenId
  useEffect(() => {
    if (state.nftAuthorizations.length) {
      const result = state.nftAuthorizations.find(item => item.tokenId === props.tokenId);
      console.log('NFT auth status: ' + result.authStatus);

      setAuthStatusNFT(result.authStatus);
      setInstance(true);
    }
  }, [state.nftAuthorizations]);

  // open Upgrade Success Modal after we get updated wearable info from the API
  useEffect(() => {
    if (state.iceWearableUpdatedSuccess) {
      // update global state iceWearableUpdatedSuccess
      dispatch({
        type: 'ice_wearable_update_success',
        data: false
      });
      refresh();
      props.setUpgrade(3);
      setAuthStatusUpgrade(true);
      setOpen(false);
      setInstance(true);

      console.log('WEARABLE upgrading successful');
      setLoading(false);
      setUpdateStatus({ name: 'WEARABLE', value: 'done' });
    }
  }, [state.iceWearableItems]);

  useEffect(() => {
    if (instance) {
      init();
      setRefreshActiveItem(!refreshActiveItem);
      console.log('reloading completed all: ', progSteps);
    }
  }, [instance]);

  useEffect(() => {
    if (updateStatus.name) {
      updateActionState(updateStatus.name, updateStatus.value);
    }
  }, [updateStatus]);

  useEffect(() => {
    const active = getactiveItem(null);
    setActiveItem(active);
  }, [refreshActiveItem]);

  // helper functions

  function refresh() {
    // update global state token amounts
    const refreshTokenAmounts = !state.refreshTokenAmounts;
    dispatch({
      type: 'refresh_token_amounts',
      data: refreshTokenAmounts
    });

    // update global state wearables data
    const updateWearableWithoutRefresh = !state.updateWearableWithoutRefresh;
    dispatch({
      type: 'update_wearable_items_without_refresh',
      data: updateWearableWithoutRefresh
    });

    // update global state balances
    const refreshBalances = !state.refreshBalances;
    dispatch({
      type: 'refresh_balances',
      data: refreshBalances
    });
  }

  function init() {
    const status = [
      {
        step: 'ICE',
        authState: authStatusICE,
        text: 'Authorize ICE',
        actionState: authStatusICE ? 'done' : 'initial',
        handleClick: () => {
          console.log('ICE clicked!');
          metaTransactionToken('ICE');
        },
        trackEvent: 'ICE AUTHORIZATION CLICKED'
      },
      {
        step: 'DGLight',
        authState: authStatusDGLight,
        text: 'Authorize DG',
        actionState: authStatusDGLight ? 'done' : 'initial',
        handleClick: () => {
          console.log('DG clicked!');
          metaTransactionToken('DGLight');
        },
        trackEvent: 'DG AUTHORIZATION CLICKED'
      },
      {
        step: 'NFT',
        authState: authStatusNFT,
        text: 'Authorize NFT',
        actionState: authStatusNFT ? 'done' : 'initial',
        handleClick: () => {
          console.log('NFT clicked!');
          metaTransactionNFT();
        },
        trackEvent: 'NFT AUTHORIZATION CLICKED'
      },
      {
        step: 'WEARABLE',
        authState: authStatusUpgrade,
        text: 'Upgrade Wearable',
        actionState: authStatusUpgrade ? 'done' : 'initial',
        handleClick: () => {
          console.log('Wearable clicked!');
          upgradeToken();
        },
        trackEvent: 'CONFIRM UPGRADE CLICKED'
      }
    ];

    status.sort((a, b) => {
      return a.step === 'WEARABLE' ? 0 : b.authState - a.authState;
    });
    setProgSteps(status);
  }

  function updateActionState(name, value) {
    const result = progSteps.map(item => {
      if (item.step === name) {
        if (value === 'done') {
          item.authState = true;
        }

        item.actionState = value;
        return item;
      } else {
        return item;
      }
    });

    const active = getactiveItem(result);

    setActiveItem(active);
    setProgSteps(result);
  }

  function getactiveItem(param) {
    const activeItems = (param ? param : progSteps).filter(x => !x.authState);
    if (activeItems.length > 0) {
      return activeItems[0];
    } else {
      return null;
    }
  }

  function populateButtons() {
    return (
      <div className={styles.steps_container}>
        {progSteps &&
          progSteps.map(item => (
            <Aux>
              <MetamaskAction
                primaryText={item.text}
                actionState={item.actionState}
                onClick={() => {
                  console.log('circle clicked', item);
                }}
              />
              {item.step !== 'WEARABLE' && <ActionLine previousAction={item.authState ? 'done' : 'initial'} />}
            </Aux>
          ))}
      </div>
    );
  }

  function proceedButton() {
    if (instance) {
      return (
        <Button
          className={styles.proceed_button}
          onClick={() => {
            console.log('active Item: ', activeItem);
            analytics.track(activeItem.trackEvent);
            activeItem.handleClick();
          }}
          disabled={!loading && mexaStatus ? false : true}
        >
          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png" />

          {!loading && mexaStatus ? activeItem.text : <LoadingAnimation />}
        </Button>
      );
    }
  }

  function modalButtons(type) {
    if (type === 'help') {
      return (
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
      );
    } else if (type === 'close') {
      return (
        <span className={styles.button_close}>
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

  async function metaTransactionToken(token) {
    let tokenContract = {};
    let MetaTxNumber = 0;

    console.log('Meta-transaction: ' + token);
    setLoading(true);
    setUpdateStatus({ name: token, value: 'clicked' });

    if (token === 'ICE') {
      tokenContract = tokenContractICE;
      MetaTxNumber = 8;
    } else if (token === 'DGLight') {
      tokenContract = tokenContractDGLight;
      MetaTxNumber = 15;
    }

    try {
      console.log('Authorize ' + token + ' amount: ' + Global.CONSTANTS.MAX_AMOUNT);
      console.log('Spender address: ' + spenderAddress);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = tokenContract.methods.approve(spenderAddress, Global.CONSTANTS.MAX_AMOUNT).encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(MetaTxNumber, functionSignature, tokenContract, state.userAddress, web3);

      if (txHash === false) {
        setLoading(false);
        setUpdateStatus({ name: token, value: 'initial' });
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // update global state token authorizations
        const refresh = !state.refreshTokenAuths;
        dispatch({
          type: 'refresh_token_auths',
          data: refresh
        });

        setLoading(false);
        setUpdateStatus({ name: token, value: 'done' });
      }
    } catch (error) {
      setLoading(false);
      setUpdateStatus({ name: token, value: 'initial' });
      console.log(token + ' Authorization error: ' + error);
    }
  }

  async function metaTransactionNFT() {
    const token = 'NFT';
    console.log('Meta-transaction NFT: ' + props.tokenId);
    console.log('Spender address: ' + spenderAddress);
    console.log('Collection address: ' + props.contractAddress);
    setLoading(true);
    setUpdateStatus({ name: token, value: 'clicked' });

    try {
      // get function signature and send Biconomy API meta-transaction
      let functionSignature = collectionContract.methods.approve(Global.ADDRESSES.ICE_REGISTRANT_ADDRESS, props.tokenId).encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(collectionID, functionSignature, collectionContract, state.userAddress, web3);

      if (txHash === false) {
        setLoading(false);
        setUpdateStatus({ name: token, value: 'initial' });
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);
        // setAuthStatusNFT(true); // this should get set to true in the hook, but for some reason it's too slow to register

        // update global state NFT authorizations
        const refresh = !state.refreshNFTAuths;
        dispatch({
          type: 'refresh_nft_auths',
          data: refresh
        });

        setLoading(false);
        setUpdateStatus({ name: token, value: 'done' });
      }
    } catch (error) {
      // setClickedNFT(false);

      console.log('NFT authorization error: ' + error);
      setLoading(false);
      setUpdateStatus({ name: token, value: 'initial' });
    }
  }

  // send the API request to upgrade the user's wearable
  async function upgradeToken() {
    console.log('Upgrading NFT token ID: ' + props.tokenId);
    console.log('Collection address: ' + props.contractAddress);

    const token = 'WEARABLE';
    setLoading(true);
    setUpdateStatus({ name: token, value: 'clicked' });

    try {
      const json = await Fetch.UPGRADE_TOKEN(props.tokenId, props.contractAddress);

      if (json.status) {
        console.log('success in upgrading:', json);
        setSuccessInUpgrade(true);
      } else if (!json.status) {
        setLoading(false);
        setUpdateStatus({ name: token, value: 'initial' });

        // setClickedUpgrade(false);
        console.log('WEARABLE upgrading error (a): ' + json.result);
      } else if (json.status === 'error') {
        setLoading(false);
        setUpdateStatus({ name: token, value: 'initial' });

        // setClickedUpgrade(false);
        console.log('WEARABLE upgrading error (b): ' + json.result);
      }
    } catch (error) {
      setLoading(false);
      setUpdateStatus({ name: token, value: 'initial' });
      // setClickedUpgrade(false);

      console.log(error); // API request timeout error
    }
  }

  return (
    <Aux>
      <Modal
        className={styles.withdraw_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={<Button className={styles.open_button}>Upgrade</Button>}
      >
        <div
          className={styles.header_buttons}
          onClick={() => {
            setOpen(false);
          }}
        >
          {modalButtons('close')}
          {modalButtons('help')}
        </div>

        <div
          style={{
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            flexDirection: 'column'
          }}
        >
          <div className={styles.upgrade_container}>
            <p className={styles.header}>
              <img className={styles.logo} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png" />
              Authorize & Upgrade
            </p>

            <p className={styles.description}>To upgrade your wearable, you will have to complete 4 transactions in MetaMask.</p>

            {/* {authButtons()} */}
            {populateButtons()}
          </div>

          {activeItem && proceedButton()}
        </div>
      </Modal>
    </Aux>
  );
};

export default ModalUpgradePending;
