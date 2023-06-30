import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'semantic-ui-react';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import Spinner from 'components/lottieAnimation/animations/Spinner';
import styles from './firstStep.module.scss';
import Global from 'components/Constants';
import { GlobalContext } from '@/store';
import Transactions from '../../../../../common/Transactions';
import { formatNumber } from '@/common/utils';

const FirstStep = props => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  const [unstakeHash, setUnstakeHash] = useState('');
  const [claimHash, setClaimHash] = useState('');
  const [unstaked, setUnstaked] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [stakingContract, setStakeContract] = useState({});

  // fetch staking contract data
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      if (state.networkID != Global.CONSTANTS.PARENT_NETWORK_ID) {
        dispatch({
          type: 'show_toastMessage',
          data: `Please switch your Network to Ethereum Mainnet`
        });
      }

      async function fetchData() {
        try {
          const contract = await Transactions.stakingContractGovernance(web3);
          setStakeContract(contract);

          const [stakedAmount, earnedAmount] = await Promise.all([contract.methods.balanceOf(state.userAddress).call(), contract.methods.earned(state.userAddress).call()]);

          if (BigNumber(stakedAmount).isZero()) {
            setUnstaked(true);
          }
          if (BigNumber(earnedAmount).isZero()) {
            setClaimed(true);
          }
        } catch (e) {
          console.log(e.message);
        }
      }

      fetchData();
    }
  }, [state.userStatus]);

  async function unstake() {
    const amount = BigNumber(state.stakingBalances?.BALANCE_USER_GOVERNANCE_OLD || 0)
      .times(Global.CONSTANTS.FACTOR)
      .toFixed();

    console.log('Call withdraw() function to unstake tokens');

    try {
      await stakingContract.methods
        .withdraw(amount)
        .send({ from: state.userAddress })
        .on('transactionHash', function (txHash) {
          setUnstakeHash(txHash);
          setUnstakeLoading(true);
        })
        .on('confirmation', function (confirmation, receipt) {
          setUnstaked(true);
          setUnstakeLoading(false);
          console.log('withdraw() transaction completed: ' + unstakeHash);
        });

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });
      dispatch({
        type: 'show_toastMessage',
        data: '$DG unstaked successfully!'
      });
    } catch (error) {
      console.log('Withdraw transaction error: ' + error);
      setUnstakeLoading(false);
      dispatch({
        type: 'show_toastMessage',
        data: 'Failed to unstake $DG!'
      });
    }
  }

  async function claim() {
    console.log('Call getReward() function to unstake tokens');

    try {
      await stakingContract.methods
        .getReward()
        .send({ from: state.userAddress })
        .on('transactionHash', function (txHash) {
          setClaimHash(txHash);
          setClaimLoading(true);
        })
        .on('confirmation', function (confirmation, receipt) {
          setClaimed(true);
          setClaimLoading(false);
          console.log('getReward() transaction completed: ' + claimHash);
        });

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });
      dispatch({
        type: 'show_toastMessage',
        data: 'Rewards $DG Claimed successfully!'
      });
    } catch (error) {
      console.log('GetReward transaction error: ' + error);
      setClaimLoading(false);
      dispatch({
        type: 'show_toastMessage',
        data: 'Failed to claim rewards $DG!'
      });
    }
  }

  return (
    <div className={styles.main_wrapper}>
      <div className={styles.title}>
        <h1>Unstake Your $DG and Claim Your Rewards</h1>
        <p>By unstaking & claiming first, we’ll aim to swap all your Mainnet $DG in one later transaction and reduce total gas fees.</p>
      </div>

      <div className={styles.content}>
        {!unstaked || !claimed ? (
          <>
            <div className={styles.box_div}>
              {!unstaked ? (
                <>
                  <div className={styles.box_title}>
                    <h1>Staked Governance $DG</h1>
                  </div>
                  <div className={styles.center_content}>
                    <div>
                      {formatNumber(state.stakingBalances?.BALANCE_USER_GOVERNANCE_OLD || 0, 4)}
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                    </div>
                  </div>
                  <div className={styles.button_div}>
                    {unstakeLoading ? (
                      <Button className={styles.button} href={`https://etherscan.io/tx/${unstakeHash}`} target="_blank">
                        <Spinner />
                        View on Etherscan
                        <img className={styles.arrowIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636424323/TransBgArrow_ukntvi.png" alt="" />
                      </Button>
                    ) : (
                      <Button
                        className={styles.button}
                        onClick={() => {
                          unstake();
                        }}
                      >
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png" alt="metamask" />
                        Unstake {formatNumber(state.stakingBalances?.BALANCE_USER_GOVERNANCE_OLD || 0, 4)} $DG
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.box_title}>
                    <h1>You're Ready to Claim Rewards</h1>
                  </div>
                  <div className={styles.center_ready_content}>
                    <p>No $DG to Unstake</p>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
                  </div>
                  <div className={styles.button_div}>
                    <Button className={styles.button} disabled={true}>
                      Next Step
                      <img className={styles.nextIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634587739/next_zxguep.png" alt="" />
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className={styles.box_div}>
              {!claimed ? (
                <>
                  <div className={styles.box_title}>
                    <h1>Unclaimed Rewards $DG</h1>
                  </div>
                  <div className={styles.center_content}>
                    <div>
                      {formatNumber(state.DGBalances?.BALANCE_STAKING_GOVERNANCE || 0, 4)}
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                    </div>
                  </div>
                  <div className={styles.button_div}>
                    {claimLoading ? (
                      <Button className={styles.button} href={`https://etherscan.io/tx/${claimHash}`} target="_blank">
                        <Spinner />
                        View on Etherscan
                        <img className={styles.arrowIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636424323/TransBgArrow_ukntvi.png" alt="" />
                      </Button>
                    ) : (
                      <Button
                        className={styles.button}
                        disabled={!unstaked}
                        onClick={() => {
                          claim();
                        }}
                      >
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png" alt="metamask" />
                        Claim {formatNumber(state.DGBalances?.BALANCE_STAKING_GOVERNANCE || 0, 4)} $DG
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.box_title}>
                    <h1>You're Ready for Step 2</h1>
                  </div>
                  <div className={styles.center_ready_content}>
                    <p>No Rewards $DG to Claim</p>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
                  </div>
                  <div className={styles.button_div}>
                    <Button className={styles.button} disabled={true}>
                      Next Step
                      <img className={styles.nextIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634587739/next_zxguep.png" alt="" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className={styles.box_div}>
            <div className={styles.box_title}>
              <h1>You're Ready for Step 2</h1>
            </div>
            <div className={styles.center_ready_content}>
              <p>No (Old) $DG to Unstake or Claim</p>
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
            </div>
            <div className={styles.button_div}>
              <Button
                className={styles.button}
                onClick={() => {
                  props.nextStep();
                }}
              >
                Next Step
                <img className={styles.nextIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634587739/next_zxguep.png" alt="" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstStep;
