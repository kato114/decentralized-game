import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../../../../store';
import { Button } from 'semantic-ui-react';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import Spinner from 'components/lottieAnimation/animations/Spinner';
import styles from './secondStep.module.scss';
import Global from 'components/Constants';
import Transactions from '../../../../../common/Transactions';
import { formatNumber, formatPrice } from '@/common/utils';

const SecondStep = props => {
  // dispatch user's ICE amounts to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [uniDGAmount, setUniDGAmount] = useState(0);
  const [lpStakedAmount, setLpStakedAmount] = useState(0);
  const [hash, setHash] = useState('');
  const [unstaked, setUnstaked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawn, setWithDrawn] = useState(false);
  const [stakingContractUniswap, setStakeContractUniswap] = useState(null);
  const [uniswapContract, setUniswapContract] = useState(null);

  async function createContracts() {
    const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

    const [stakingContract, poolContract] = await Promise.all([Transactions.stakingContractUniswap(web3), Transactions.uniswapContract(web3)]);
    setStakeContractUniswap(stakingContract);
    setUniswapContract(poolContract);
  }

  async function fetchInfo() {
    if (!stakingContractUniswap || !uniswapContract) {
      return;
    }

    try {
      const [amount, lpAmount, reserves, totalSupply] = await Promise.all([
        stakingContractUniswap.methods.balanceOf(state.userAddress).call(),
        uniswapContract.methods.balanceOf(state.userAddress).call(),
        uniswapContract.methods.getReserves().call(),
        uniswapContract.methods.totalSupply().call()
      ]);

      const dgAmount = BigNumber(reserves[1]).times(lpAmount).div(totalSupply).div(Global.CONSTANTS.FACTOR).toFixed();

      if (BigNumber(amount).isZero()) {
        setUnstaked(true);
      } else {
        setUnstaked(false);
      }

      if (BigNumber(dgAmount).isZero()) {
        setWithDrawn(true);
      } else {
        setWithDrawn(false);
      }

      setLpStakedAmount(BigNumber(amount).div(Global.CONSTANTS.FACTOR).toFixed());
      setUniDGAmount(dgAmount);
    } catch {}
  }

  async function unstake() {
    const amount = BigNumber(lpStakedAmount).times(Global.CONSTANTS.FACTOR).toFixed();

    console.log('Call withdraw() function to unstake tokens');

    try {
      await stakingContractUniswap.methods
        .withdraw(amount)
        .send({ from: state.userAddress })
        .on('transactionHash', function (hash) {
          setHash(hash);
          setLoading(true);
        })
        .on('confirmation', function (confirmation, receipt) {
          setUnstaked(true);
          setLoading(false);
          console.log('withdraw() transaction completed: ' + hash);
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
      setLoading(false);
      dispatch({
        type: 'show_toastMessage',
        data: 'Failed to unstake $DG!'
      });
    }
  }

  // fetch staking contract data
  useEffect(() => {
    if (state.userStatus >= 4) {
      if (state.networkID != Global.CONSTANTS.PARENT_NETWORK_ID) {
        dispatch({
          type: 'show_toastMessage',
          data: `Please switch your Network to Ethereum Mainnet`
        });
      }

      createContracts();
    }
  }, [state.userStatus]);

  fetchInfo();
  if (Global.intervalID) {
    clearInterval(Global.intervalID);
  }
  Global.intervalID = setInterval(fetchInfo, 5000);

  return (
    <div className={styles.main_wrapper}>
      <div className={styles.title}>
        <h1>Withdraw Your $DG in Uniswap Liquidity</h1>
        <p>Unstake and withdraw your LP from Uniswap, then refresh this page to ensure you're ready for step 3.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.box_div}>
          {!unstaked ? (
            <>
              <div className={styles.box_title}>
                <h1>Unstake Uniswap ETH-DG LP</h1>
              </div>
              <div className={styles.center_content}>
                <div>
                  {formatNumber(lpStakedAmount, 4)}
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                </div>
              </div>
              <div className={styles.button_div}>
                {loading ? (
                  <Button className={styles.button} href={`https://etherscan.io/tx/${hash}`} target="_blank">
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
                    Unstake LP Tokens
                  </Button>
                )}
              </div>
            </>
          ) : !withdrawn ? (
            <>
              <div className={styles.box_title}>
                <h1>You're Ready to Withdraw</h1>
              </div>
              <div className={styles.center_ready_content}>
                <p>No ETH-DG LP to Unstake</p>
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
              </div>
              <div className={styles.button_div}>
                <Button
                  className={styles.button}
                  onClick={() => {
                    props.nextStep();
                  }}
                  disabled={true}
                >
                  Next Step
                  <img className={styles.nextIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634587739/next_zxguep.png" alt="" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.box_title}>
                <h1>You're Ready for Step 3</h1>
              </div>
              <div className={styles.center_ready_content}>
                <p>No (Old) $DG Liquidity to Withdraw</p>
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
            </>
          )}
        </div>

        {!withdrawn ? (
          <div className={styles.box_div}>
            <div className={styles.box_title}>
              <h1>Withdraw Uniswap $DG</h1>
            </div>
            <div className={styles.center_content}>
              <div>
                {formatNumber(uniDGAmount, 4)}
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
              </div>
              <p>${formatPrice((state.DGPrices.dg * uniDGAmount).toFixed(2), 2)}</p>
            </div>
            <div className={styles.button_div}>
              <Button
                className={styles.button}
                onClick={() => {
                  window.open('https://app.uniswap.org/#/remove/v2/0xee06a81a695750e71a662b51066f2c74cf4478a0/ETH', '_blank');
                }}
              >
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636428353/uniswap_tkdx8e.png" alt="uniswap" />
                Withdraw Uniswap Liquidity
                <img className={styles.arrowIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636424323/TransBgArrow_ukntvi.png" alt="" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SecondStep;
