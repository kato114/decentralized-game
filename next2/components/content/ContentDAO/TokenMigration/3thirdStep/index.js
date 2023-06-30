import React, { useState, useEffect, useContext } from 'react';
import { Button, Input } from 'semantic-ui-react';
import BigNumber from 'bignumber.js';
import Spinner from 'components/lottieAnimation/animations/Spinner';
import styles from './thirdStep.module.scss';
import Web3 from 'web3';
import Global from 'components/Constants';
import { GlobalContext } from '@/store';
import Images from '../../../../../common/Images';
import Transactions from '../../../../../common/Transactions';
import { formatNumber, getAmounts } from '@/common/utils';

const ThirdStep = props => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [hash, setHash] = useState('');
  const [isEthereumNetwork, setEthereumNetwork] = useState(false);
  const [switchNetworkLoading, setSwitchNetworkLoading] = useState(false);
  const [direct, setDirect] = useState(true);
  const [amountDG, setAmountDG] = useState('0');
  const [amountDGLight, setAmountDGLight] = useState('0');
  const [DGTokenContract, setDGTokenContract] = useState({});
  const [DGLightTokenContract, setDGLightTokenContract] = useState({});
  const [swapSubmitted, setSwapSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const networkInfo = {
    id: 1,
    name: 'Mainnet',
    etherscan: 'https://etherscan.io',
    dgAddress: Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG,
    dgLightAddress: Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG_LIGHT
  };
  Global.pageSelfNetwork = true;

  async function handleSwitchEthereumNetwork() {
    setSwitchNetworkLoading(true);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: Web3.utils.toHex(networkInfo.id)
          }
        ]
      });
    } catch {
      setSwitchNetworkLoading(false);
    }
  }

  function handleDGChange(e) {
    DGAmountChange(e.target.value);
  }

  function DGAmountChange(value) {
    const num = Number(value);
    if (!Number.isNaN(num)) {
      setAmountDG(value);
      const conversion = BigNumber(num).times(1000).toFixed();
      if (amountDGLight != conversion) {
        setAmountDGLight(conversion);
      }
    }
  }

  function handleDGLightChange(e) {
    DGLightAmountChange(e.target.value);
  }

  function DGLightAmountChange(value) {
    const num = Number(value);
    if (!Number.isNaN(num)) {
      setAmountDGLight(value);
      const conversion = BigNumber(num).div(1000).toFixed();
      if (amountDG != conversion) {
        setAmountDG(conversion);
      }
    }
  }

  async function goLight(dgLightTokenContract, dgTokenContract, amount) {
    console.log('Call goLight() function to swap into DGLight Token');

    const { amountAdjusted, amountToString } = getAmounts(amount);
    console.log('Swap amount input (number): ' + amountAdjusted);
    console.log('Swap amount input (string): ' + amountToString);

    try {
      console.log('Get amount user has authorized our DGLight contract to spend');

      const amountAllowance = await dgTokenContract.methods.allowance(state.userAddress, dgLightTokenContract._address).call();

      console.log('Authorized amount: ' + amountAllowance);

      if (Number(amountAllowance) < amountAdjusted) {
        console.log("Approve DGLight contract to spend user's tokens");

        await dgTokenContract.methods
          .approve(dgLightTokenContract._address, Global.CONSTANTS.MAX_AMOUNT)
          .send({ from: state.userAddress })
          .on('transactionHash', function (hash) {
            setApproving(true);
          })
          .on('confirmation', function (confirmation, receipt) {
            console.log('approve() transaction completed');
            setApproving(false);
          });

        dispatch({
          type: 'show_toastMessage',
          data: 'DG approved successfully!'
        });
      }

      console.log('Call goLight() function on smart contract');

      await dgLightTokenContract.methods
        .goLight(amountToString)
        .send({ from: state.userAddress })
        .on('transactionHash', function (hash) {
          setHash(hash);
          setSwapSubmitted(true);
          setLoading(true);
        })
        .on('confirmation', function (confirmation, receipt) {
          setLoading(false);
          console.log('goLight() transaction completed: ' + hash);
        });

      // update global state DGLight balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });

      dispatch({
        type: 'show_toastMessage',
        data: 'DG swapped successfully!'
      });
    } catch (error) {
      console.log('Staking transactions error: ' + error);
      setLoading(false);
      setApproving(false);

      dispatch({
        type: 'show_toastMessage',
        data: 'Failed to swap DG!'
      });
    }
  }

  async function addToken() {
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: direct ? networkInfo.dgLightAddress : networkInfo.dgAddress,
            symbol: direct ? 'DG' : '$DG',
            decimals: 18,
            image: 'https://res.cloudinary.com/dze4ze7xd/image/upload/c_scale,h_256/v1638231952/DG_LOGO_ch4uj6.png'
          }
        }
      });
    } catch {}
  }

  async function goClassic(dgLightTokenContract, amount) {
    console.log('Call goClassic() function to swap into DG Token');

    const { amountAdjusted, amountToString } = getAmounts(amount);
    console.log('Swap amount input (number): ' + amountAdjusted);
    console.log('Swap amount input (string): ' + amountToString);

    try {
      console.log('Call goClassic() function on smart contract');

      await dgLightTokenContract.methods
        .goClassic(amountToString)
        .send({ from: state.userAddress })
        .on('transactionHash', function (hash) {
          setHash(hash);
          setSwapSubmitted(true);
          setLoading(true);
        })
        .on('confirmation', function (confirmation, receipt) {
          setLoading(false);
          console.log('goClassic() transaction completed: ' + hash);
        });

      // update global state DGLight balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });

      dispatch({
        type: 'show_toastMessage',
        data: 'DG swapped successfully!'
      });
    } catch (error) {
      console.log('Staking transactions error: ' + error);
      setLoading(false);

      dispatch({
        type: 'show_toastMessage',
        data: 'Failed to swap DG!'
      });
    }
  }

  async function fetchData() {
    const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

    const [DGTokenContract, DGLightTokenContract] = await Promise.all([Transactions.DGTokenContract(web3), Transactions.DGLightTokenContract(web3)]);

    setDGTokenContract(DGTokenContract);
    setDGLightTokenContract(DGLightTokenContract);

    const amountInWei = await DGTokenContract.methods.balanceOf(state.userAddress).call();
    const dgAmount = BigNumber(amountInWei).div(Global.CONSTANTS.FACTOR);
    DGAmountChange(dgAmount.toFixed());
  }

  async function checkNetworkId(networkId) {
    Global.pageSelfNetwork = true;

    if (networkId != networkInfo.id) {
      dispatch({
        type: 'show_toastMessage',
        data: `Please switch your Network to Ethereum ${networkInfo.name}`
      });
      setEthereumNetwork(false);
    } else {
      setEthereumNetwork(true);
    }

    setSwitchNetworkLoading(false);
    fetchData();
  }

  // fetch DGLight contract data
  useEffect(() => {
    if (state.userStatus >= 4) {
      checkNetworkId(window.ethereum.networkVersion);
      window.ethereum.on('networkChanged', function (networkId) {
        checkNetworkId(networkId);
      });

      fetchData();
    }
  }, [state.userStatus]);

  return (
    <div className={styles.main_wrapper}>
      <div className={styles.title}>
        <h1>Swap Your {networkInfo.name} $DG</h1>
        <p>The moment you’ve all been waiting for! Now let’s swap all your {networkInfo.name} $DG to the new DG token.</p>
      </div>

      <div className={styles.content}>
        {BigNumber(state.DGBalances?.BALANCE_ROOT_DG || 0).isGreaterThan(0) ? (
          !swapSubmitted ? (
            <div className={styles.box_div}>
              <div className={styles.box_title}>
                <h1>{networkInfo.name} $DG Token Swap</h1>
              </div>

              <div className={styles.contract_div}>
                <div className={styles.contract_box}>
                  <div className={styles.tag}>
                    Old DG Contract
                    <a className={styles.scan_link} href="https://etherscan.io/token/0xee06a81a695750e71a662b51066f2c74cf4478a0" target="_blank">
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635530963/arrow_b8xsav.png" alt="" />
                    </a>
                  </div>

                  <div className={styles.content}>
                    <img
                      className={styles.dg}
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/android-chrome-512x512_rmiw1y.png"
                      alt="DG"
                    />
                    <Input className={styles.swap_input} fluid placeholder="0.00" value={amountDG} onChange={handleDGChange} />
                  </div>

                  <div className={styles.description}>
                    <h4
                      className={direct ? styles.active : null}
                      onClick={() => {
                        direct ? DGAmountChange(state.DGBalances?.BALANCE_ROOT_DG) : null;
                      }}
                    >
                      {formatNumber(state.DGBalances?.BALANCE_ROOT_DG || 0, 4)} DG (Old) {direct ? 'Detected!' : 'Total'}
                    </h4>
                    <p>On ETH {networkInfo.name}</p>
                  </div>
                </div>
                <div
                  className={styles.arrow}
                  style={{ transform: !direct ? 'rotateY(180deg)' : '' }}
                  onClick={() => {
                    setDirect(!direct);
                  }}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635534332/arrow2_n1fwsf.png" alt="" />
                </div>
                <div className={styles.contract_box}>
                  <div className={styles.tag}>
                    New DG Contract
                    <a className={styles.scan_link} href="https://etherscan.io/token/0x4b520c812e8430659fc9f12f6d0c39026c83588d" target="_blank">
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635530963/arrow_b8xsav.png" alt="" />
                    </a>
                  </div>

                  <div className={styles.content}>
                    <img className={styles.new} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635540038/NEW_dqqtn6.png" alt="new" />
                    <img
                      className={styles.dg}
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/android-chrome-512x512_rmiw1y.png"
                      alt="DG"
                    />
                    <Input className={styles.swap_input} fluid placeholder="0.00" value={amountDGLight} onChange={handleDGLightChange} />
                  </div>

                  <div className={styles.description}>
                    <h4
                      className={!direct ? styles.active : null}
                      onClick={() => {
                        !direct ? DGLightAmountChange(state.DGBalances?.BALANCE_ROOT_DG_LIGHT) : null;
                      }}
                    >
                      {formatNumber(state.DGBalances?.BALANCE_ROOT_DG_LIGHT || 0, 2)} New DG {!direct ? 'Detected!' : 'Total'}
                    </h4>
                    <p>On ETH {networkInfo.name}</p>
                  </div>
                </div>
              </div>

              <div className={styles.button_div}>
                {!isEthereumNetwork ? (
                  <Button
                    className={styles.button_blue}
                    onClick={() => {
                      handleSwitchEthereumNetwork();
                    }}
                  >
                    {switchNetworkLoading ? <Spinner /> : <img className={styles.ethereum} src="https://i.ibb.co/Gpc7WKD/Ethereum.jpg" alt="Ethereum" />}
                    Switch to Ethereum {networkInfo.id != 1 ? networkInfo.name : null} Network
                  </Button>
                ) : loading ? (
                  <Button className={styles.button_blue} href={`${networkInfo.etherscan}/tx/${hash}`} target="_blank">
                    <Spinner />
                    View on Etherscan
                    <img
                      className={styles.arrowIcon}
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1636424323/TransBgArrow_ukntvi.png"
                      alt=""
                    />
                  </Button>
                ) : (
                  <Button
                    className={styles.button_blue}
                    disabled={Number(amountDG) <= 0 || approving}
                    onClick={() => {
                      direct
                        ? goLight(DGLightTokenContract, DGTokenContract, amountDG).then(() => {
                            setAmountDG('0');
                            setAmountDGLight('0');
                          })
                        : goClassic(DGLightTokenContract, amountDG).then(() => {
                            setAmountDG('0');
                            setAmountDGLight('0');
                          });
                    }}
                  >
                    {approving ? <Spinner /> : null}
                    {approving
                      ? 'Approving'
                      : direct
                      ? `Swap ${formatNumber(amountDG, 4)} $DG for ${formatNumber(amountDGLight, 2)} DG`
                      : `Swap ${formatNumber(amountDGLight, 2)} DG for ${formatNumber(amountDG, 4)} $DG`}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.box_div}>
              <img
                className={styles.close}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1636431892/transClose_v26kgi.png"
                alt="close"
                onClick={() => {
                  setSwapSubmitted(false);
                }}
              />

              <div className={styles.box_title}>
                <h1>Swap Transaction Submitted!</h1>
              </div>

              <div className={styles.center_swap_submitted}>
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
              </div>

              <div className={styles.button_div} style={{ marginTop: '30px' }}>
                <Button className={styles.button} onClick={() => addToken()}>
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png" alt="metamask" />
                  Add {direct ? 'New' : 'Old'} DG to Metamask
                </Button>
              </div>

              <div className={styles.button_div}>
                <Button className={styles.button_transparent} href={`${networkInfo.etherscan}/tx/${hash}`} target="_blank">
                  View on Etherscan
                  <img className={styles.arrowIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1636424323/TransBgArrow_ukntvi.png" alt="" />
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className={styles.box_div_small}>
            <div className={styles.box_title}>
              <h1>You're Ready for Step 4</h1>
            </div>
            <div className={styles.center_ready_content}>
              <p>No (Old) $DG Left to Swap</p>
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
            </div>
            <div className={styles.button_div}>
              <Button
                className={styles.button}
                onClick={() => {
                  props.nextStep();
                }}
              >
                Next Step
                <img className={styles.nextIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634587739/next_zxguep.png" alt="" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThirdStep;
