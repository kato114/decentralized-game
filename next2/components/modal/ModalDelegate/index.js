/* eslint-disable unused-imports/no-unused-vars-ts */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Modal, Button } from 'semantic-ui-react';
import Fetch from '../../../common/Fetch';
import styles from './ModalDelegate.module.scss';
import ModalSuccessDelegation from '../ModalSuccessDelegation';
import Global from '../../Constants';
import Aux from '../../_Aux';
import ABI_COLLECTION_V2 from '../../../components/ABI/ABICollectionV2';
import ABI_COLLECTION_PH from '../../../components/ABI/ABICollectionPH';
import LoadingAnimation from 'components/lottieAnimation/animations/SpinnerUpdated';
import Web3 from 'web3';
import cn from 'classnames';

/// ////////////////////////////////////
// to create a redelegation modal, just pass the redelegation prop
/// ///////////////////////////////////
const ModalDelegate = props => {
  // fetch user's wallet address from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [clicked, setClicked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [enteredNickname, setEnteredNickname] = useState('');
  const [enteredAddress, setEnteredAddress] = useState('');
  const [collectionArray, setCollectionArray] = useState([]);
  const [web3, setWeb3] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize Web3 providers and create token contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      setWeb3(web3);

      const maticWeb3 = new Web3(state.appConfig.polygonRPC); // pass Matic provider URL to Web3 constructor

      // const collectionV2Contract = new maticWeb3.eth.Contract(
      //   ABI_COLLECTION_V2,
      //   Global.ADDRESSES.COLLECTION_V2_ADDRESS
      // );
      // setCollectionV2Contract(collectionV2Contract);

      const collectionV2Contract = new maticWeb3.eth.Contract(ABI_COLLECTION_V2, Global.ADDRESSES.COLLECTION_V2_ADDRESS);
      const collectionV2Contract2 = new maticWeb3.eth.Contract(ABI_COLLECTION_PH, Global.ADDRESSES.COLLECTION_PH_ADDRESS);

      const collectionArray = [];

      collectionArray.push([collectionV2Contract, Global.ADDRESSES.COLLECTION_V2_ADDRESS]);
      collectionArray.push([collectionV2Contract2, Global.ADDRESSES.COLLECTION_PH_ADDRESS]);
      setCollectionArray(collectionArray);
    }
  }, [state.userStatus]);

  // if this is a redelegation modal, set the "entered address" i.e the delegatee address as the previously delegated one
  // also close the upgrade modal invoking the setUpgrade function
  useEffect(() => {
    if (props.redelegation) {
      setEnteredAddress(props.redelegateAddress);
      setOpen(true);
    }
  }, []);

  async function hasDataByAddress(address) {
    const tokenId = 0;

    const tokenById = collectionArray.map(async (item, index) => {
      try {
        for (let nIndex = 0; nIndex < Global.CONSTANTS.MAX_DELEGATION_COUNT; nIndex++) {
          const tokenId = await collectionArray[index][0].methods.tokenOfOwnerByIndex(address, nIndex).call();

          if (parseInt(tokenId) > 0) {
            return true;
          }
        }
      } catch (error) {
        console.log('Index out-of-bounds: ', error.message);
      }

      return tokenId;
    });

    await Promise.all(tokenById);

    return false;
  }

  async function checkDelegatedStatus(address) {
    let errorMsg = '';
    let isDelegated = false;

    setClicked(true);

    // if any index has data then we should show error
    const hasData = await hasDataByAddress(address);

    if (hasData) {
      errorMsg = 'This user already owns a wearable and cannot be delegated to';
      isDelegated = true;
    } else {
      const delegationInfo = await Fetch.DELEGATE_INFO(address);

      // ensure no-one has delegated to target address yet (besides me)
      delegationInfo.incomingDelegations.forEach((item, i) => {
        if (item) {
          const tokenOwner = item.tokenOwner.toLowerCase();

          console.log('Entered address incoming delegator: ' + tokenOwner);

          if (tokenOwner !== '') {
            // if entered address has delegated wearables and the delegator is not my guild owner
            if (state.userInfo.managerOf && tokenOwner !== state.userInfo.managerOf) {
              errorMsg = 'This user already has a wearable delegated to them, they can undelegate to receive yours';
              isDelegated = true;
            }
            // if entered address has delegated wearables and the delegator is not me
            else if (!state.userInfo.managerOf && tokenOwner !== state.userAddress.toLowerCase()) {
              errorMsg = 'This user already has a wearable delegated to them, they can undelegate to receive yours';
              isDelegated = true;
            }
          }
        } else {
          console.log('Entered address has no incoming delegator');
        }
      });
    }

    setClicked(false);
    setErrorMsg(errorMsg);

    return isDelegated;
  }

  function imageDetails() {
    return (
      <div className={styles.wear_box}>
        <div className={styles.wear_box_purple}>
          <img src={props.imgSrc} />
        </div>
        <div className={styles.card_body}>
          <div className={styles.card}>Rank {props.rank}</div>
          <div className={styles.card}>
            {props.bonus}
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631105861/diamond_1_1_mvgaa8.png" className={styles.img_card} />
          </div>
          <div className={styles.card}>{props.description?.split(' ').at(-1).replace('/', ' of ')}</div>
        </div>
      </div>
    );
  }

  function descriptionBody() {
    return (
      <Aux>
        <div className={styles.header}>Delegate Your Wearable</div>

        <div className={styles.benefit_area}>
          Benefits
          <div className={styles.benefit_list}>
            <ul>
              <li>Let another player Play-to-Earn with your item</li>
              <li>Earn {state.delegatorSplits.length > 0 ? Math.round(state.delegatorSplits[props.rank - 1] * 100) : '--'}% of all ICE profits from their gameplay</li>
              <li>NFT stays in your wallet & undelegate any time</li>
            </ul>
          </div>
        </div>

        <div className={styles.price_area}>
          <div className={styles.profit_label}>Profit Split</div>

          <div className={styles.card_area}>
            <div className={styles.card_area_body}>
              <div className={styles.card}>
                <div className={styles.info}>You Earn</div>
                {state.delegatorSplits.length > 0 ? <>{Math.round(state.delegatorSplits[props.rank - 1] * 100)}%</> : <LoadingAnimation width={25} height={25} />}
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631105861/diamond_1_1_mvgaa8.png" className={styles.img_card1} />
              </div>
            </div>

            <div className={styles.card_area_body}>
              <div className={styles.card}>
                <div className={styles.info}>They Earn</div>
                {state.delegatorSplits.length > 0 ? <>{Math.round((1 - state.delegatorSplits[props.rank - 1]) * 100)}%</> : <LoadingAnimation width={25} height={25} />}
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631105861/diamond_1_1_mvgaa8.png" className={styles.img_card2} />
              </div>
            </div>
          </div>
        </div>
      </Aux>
    );
  }

  function enterAddress() {
    return (
      <div className={styles.price_area}>
        <div className={styles.address_label}>Delegate Address</div>

        <div className={styles.card_area}>
          <div className={styles.card_area_body} style={{ width: '100%' }}>
            <div className={styles.inputcard}>
              To:
              <input
                className={styles.input}
                maxLength="42"
                placeholder="Paste ETH Address Here"
                onChange={async evt => {
                  setErrorMsg('');

                  if (evt.target.value.length > 0) {
                    if (web3.utils.isAddress(evt.target.value)) {
                      const isDelegated = await checkDelegatedStatus(evt.target.value);

                      // check to see if anyone has already delegated to this address
                      if (!isDelegated) {
                        setEnteredAddress(evt.target.value);
                      } else {
                        setEnteredAddress('');
                      }
                    } else {
                      setEnteredAddress('');
                    }
                  } else {
                    setEnteredAddress('');
                  }
                }}
              />
            </div>
            {state.userIsPremium ? (
              <div className={styles.inputcard}>
                Nickname:
                <input
                  className={styles.input}
                  maxLength="42"
                  placeholder="Type Player Nickname Here"
                  onChange={async evt => {
                    if (evt.target.value.length > 0) {
                      setEnteredNickname(evt.target.value);
                    } else {
                      setEnteredNickname('');
                    }
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
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
        <span className={styles.button_close} onClick={() => setOpen(false)}>
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

  async function delegateNFT() {
    console.log('Delegate token ID: ' + props.tokenId);
    console.log('Delegate address: ' + enteredAddress);
    console.log('Delegate Nickname: ' + enteredNickname);
    console.log('Collection address: ' + props.contractAddress);

    if (enteredAddress) {
      setClicked(true);

      const json = await Fetch.DELEGATE_NFT(enteredAddress, props.tokenId, props.contractAddress, enteredNickname);

      if (json.status) {
        console.log('NFT delegation request: ' + json.result);

        // close this modal and open the success modal
        setOpen(false);
        setSuccess(true);
      } else {
        console.log('NFT delegation request error. Code: ' + json.code);

        setErrorMsg('Delegation failed: ' + json.result);

        // if (json.code === 2) {
        //   setErrorMsg(json.reason); // this wearable has already been checked-in today
        // } else {
        //   setErrorMsg('Delegation failed. Code: ' + json.code);
        // }
        setClicked(false);
      }
    }
  }

  return (
    <Aux>
      {!success ? (
        <Modal
          className={cn(styles.delegate_modal, props.redelegation ? styles.redelegation : styles.new_delegation)}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={
            <Button
              className={props.redelegation ? styles.button_trigger_redelegation : props.rank === 5 ? styles.open_button_fullWidth : styles.open_button}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              {props.buttonName}
            </Button>
          }
        >
          <div className={styles.top_buttons}>
            {modalButtons('close')}
            {modalButtons('help')}
          </div>

          {props.redelegation ? (
            <div className={styles.redelegation_body}>
              <h2 className={styles.redelegate_title}>Redelegate Wearable</h2>
              <p className={styles.redelegation_description}>
                You previously delegated to{' '}
                <a href={`https://polygonscan.com/address/${props.redelegateAddress}`} target="_blank" rel="noreferrer">
                  {`${props.redelegateAddress?.slice(0, 4)}...${props.redelegateAddress?.substr(-4, 4)}`}
                </a>
                {'. '}
                Would you like to redelegate your upgraded wearable?
              </p>

              <div className={styles.card_area_body}>
                <div className={styles.card}>
                  <div className={styles.info}>You Earn</div>
                  30%
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631105861/diamond_1_1_mvgaa8.png" className={styles.img_card1} />
                </div>

                <div className={styles.card}>
                  <div className={styles.info}>They Earn</div>
                  70%
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631105861/diamond_1_1_mvgaa8.png" className={styles.img_card2} />
                </div>
              </div>

              {clicked ? (
                <Button
                  className={styles.button_redelegate}
                  onClick={() => {
                    // analytics.track('CLICKED DELEGATE');
                    // delegateNFT();
                    setSuccess(true);
                  }}
                  disabled={errorMsg === '' ? false : true}
                >
                  {props.redelegation ? 'Redelegate Wearable' : props.buttonName}
                </Button>
              ) : (
                <Button className={styles.button_redelegate} disabled={true}>
                  {/* Pending Transaction... */}
                  <LoadingAnimation width={30} height={30} />
                </Button>
              )}
            </div>
          ) : (
            <div className={styles.delegate_container}>
              {imageDetails()}

              <div className={styles.wear_box_right}>
                <div className={styles.main}>
                  {descriptionBody()}
                  {enterAddress()}

                  <div className={styles.button_area}>
                    {!clicked ? (
                      <Button
                        className={styles.button_upgrade}
                        onClick={() => {
                          analytics.track('CLICKED DELEGATE');
                          delegateNFT();
                        }}
                        disabled={errorMsg === '' && enteredAddress && state.delegatorSplits.length > 0 ? false : true}
                      >
                        {props.buttonName}
                      </Button>
                    ) : (
                      <Button className={styles.button_upgrade} disabled={true}>
                        <LoadingAnimation width={30} height={30} />
                      </Button>
                    )}

                    <Button
                      className={styles.button_close}
                      onClick={() => {
                        window.open('https://ice.decentral.games/ice-nft-wearables', '_blank');
                      }}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>

                {errorMsg !== '' && <div className={styles.delegateInfo}>{errorMsg}</div>}
              </div>
            </div>
          )}
        </Modal>
      ) : (
        <ModalSuccessDelegation
          buttonName={props.buttonName}
          address={enteredAddress ? enteredAddress : `${props.redelegateAddress?.slice(0, 4)}...${props.redelegateAddress?.substr(-4, 4)}`}
          rank={props.rank}
        />
      )}
    </Aux>
  );
};

export default ModalDelegate;
