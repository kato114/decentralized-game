import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/Spinner';
import styles from './forthStep.module.scss';
import Web3 from 'web3';
import Global from 'components/Constants';
import { GlobalContext } from '@/store';
import Transactions from '../../../../../common/Transactions';
import { addToken, formatNumber, getAmounts } from '@/common/utils';

const networkInfo = {
  id: 1,
  name: 'Mainnet',
  etherscan: 'https://etherscan.io',
  dgLightAddress: Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG_LIGHT,
  dgTownHallAddress: Global.ADDRESSES.ROOT_DG_TOWN_HALL_ADDRESS
};

const ForthStep = props => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  const [hash, setHash] = useState('');
  const [staked, setStaked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [availabeStake, setAvailableStake] = useState(3400);
  const [DGTownHallContract, setDGTownHallContract] = useState({});
  const [DGLightTokenContract, setDGLightTokenContract] = useState({});
  const [stakeSubmitted, setStakeSubmitted] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    setAvailableStake(state.DGBalances?.BALANCE_ROOT_DG_LIGHT);
  }, [state.DGBalances?.BALANCE_ROOT_DG_LIGHT]);

  function handleStakeAmountChange(e) {
    setStakeAmount(Number(e.target.value));
  }

  async function stake() {
    console.log('Call stepInside() function to stake tokens');

    const { amountAdjusted, amountToString } = getAmounts(stakeAmount);
    console.log('Stake amount input (number): ' + amountAdjusted);
    console.log('Stake amount input (string): ' + amountToString);

    try {
      console.log('Get amount user has authorized our DGTownHall contract to spend');

      const amountAllowance = await DGLightTokenContract.methods.allowance(state.userAddress, DGTownHallContract._address).call();

      console.log('Authorized amount: ' + amountAllowance);

      if (Number(amountAllowance) < amountAdjusted) {
        console.log("Approve DGTownHall contract to spend user's tokens");

        await DGLightTokenContract.methods
          .approve(DGTownHallContract._address, Global.CONSTANTS.MAX_AMOUNT)
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

      await DGTownHallContract.methods
        .stepInside(amountToString)
        .send({ from: state.userAddress })
        .on('transactionHash', function (hash) {
          setHash(hash);
          setStakeSubmitted(true);
          setLoading(true);
        })
        .on('confirmation', function (confirmation, receipt) {
          setStaked(true);
          setStakeSubmitted(false);
          setLoading(false);
          console.log('stepInside() transaction completed: ' + hash);
        });

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });
      dispatch({
        type: 'show_toastMessage',
        data: 'DG staked successfully!'
      });
    } catch (error) {
      console.log('StepInside transaction error: ' + error);
      setLoading(false);
      setApproving(false);

      dispatch({
        type: 'show_toastMessage',
        data: 'Failed to stake DG!'
      });
    }
  }

  async function fetchData() {
    const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

    const [DGTownHallContract, DGLightTokenContract] = await Promise.all([Transactions.DGTownHallContract(web3), Transactions.DGLightTokenContract(web3)]);

    setDGTownHallContract(DGTownHallContract);
    setDGLightTokenContract(DGLightTokenContract);
  }

  async function checkNetworkId(networkId) {
    Global.pageSelfNetwork = true;

    if (networkId != networkInfo.id) {
      dispatch({
        type: 'show_toastMessage',
        data: `Please switch your Network to Ethereum ${networkInfo.name}`
      });
    }

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
        <h1>Stake in New Governance</h1>
        <p>To finish the process, restake your new DG for new governance yields.</p>
      </div>

      <div className={styles.content}>
        {!staked ? (
          !stakeSubmitted ? (
            <div className={styles.box_div}>
              <div className={styles.box_title}>
                <h1>
                  New DG Gov Staking <abbr>({formatNumber((Global.CONSTANTS.APR_NUMBER / state.stakingBalances?.BALANCE_CONTRACT_TOWNHALL) * 100, 2)}% APR)</abbr>
                </h1>
              </div>

              <div className={styles.contract_div}>
                <div className={styles.content}>
                  <img
                    className={styles.dg}
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/android-chrome-512x512_rmiw1y.png"
                    alt="DG"
                  />
                  <input
                    type="number"
                    className={styles.dg_input}
                    value={stakeAmount.toString()}
                    onChange={handleStakeAmountChange}
                    style={{
                      minWidth: `${5 + (stakeAmount.toString().length + 1) * 12}px`,
                      maxWidth: `${5 + (stakeAmount.toString().length + 1) * 12}px`
                    }}
                  />
                </div>

                <Button
                  className={styles.max_button}
                  onClick={() => {
                    setStakeAmount(availabeStake);
                  }}
                >
                  MAX
                </Button>

                <div className={styles.description}>
                  <h4 className={stakeAmount <= availabeStake ? styles.success : styles.error}>{formatNumber(availabeStake || 0, 2)} DG Available to Stake</h4>
                  <p>On Eth {networkInfo.name}</p>
                </div>
              </div>

              <div className={styles.button_div}>
                {loading ? (
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
                    onClick={() => {
                      stake();
                    }}
                    disabled={stakeAmount <= 0 || stakeAmount > availabeStake || approving}
                  >
                    {approving ? <Spinner /> : null}
                    {approving ? 'Approving' : `Stake ${stakeAmount} DG`}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.box_div_big}>
              <img
                className={styles.close}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1636431892/transClose_v26kgi.png"
                alt="close"
                onClick={() => {
                  setStakeSubmitted(false);
                }}
              />

              <div className={styles.box_title}>
                <h1>Stake Transaction Submitted!</h1>
              </div>

              <div className={styles.center_swap_submitted}>
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
              </div>

              <div className={styles.button_div} style={{ marginTop: '30px' }}>
                <Button className={styles.button} onClick={() => addToken()}>
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png" alt="metamask" />
                  Add xDG to Metamask
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
              <h1>You're Ready for Step 5</h1>
            </div>
            <div className={styles.center_ready_content}>
              <p>No DG Left to Stake</p>
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

export default ForthStep;
