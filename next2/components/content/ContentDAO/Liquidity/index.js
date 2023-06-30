import cn from 'classnames';
import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '@/store';
import { Button } from 'semantic-ui-react';
import Aux from '../../../_Aux';
import styles from './Liquidity.module.scss';
import Web3 from 'web3';
import Transactions from '../../../../common/Transactions';
import { formatPrice } from '@/common/utils';

const Liquidity = props => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amountInput, setAmountInput] = useState('');
  const [stakingContractUniswap, setStakingContractUniswap] = useState({});

  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const stakingContractUniswap = await Transactions.stakingContractUniswap(web3);
        setStakingContractUniswap(stakingContractUniswap);
      }

      fetchData();
    }
  }, [state.userStatus]);

  function handleChange(e) {
    setAmountInput(e.target.value);
  }

  return (
    <Aux>
      <div>
        <div className={cn('d-flex', styles.stake_DG_container)}>
          <div className={styles.lower}>
            <p className={styles.lower_header}>Claim $DG Rewards</p>
            <div className={styles.lower_value}>
              <p className={styles.DG_value}>{formatPrice(state.DGBalances?.BALANCE_STAKING_UNISWAP, 3)}</p>
              <img style={{ marginTop: '-4px' }} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624411671/Spinning-Logo-DG_n9f4xd.gif" />
            </div>
            <p className={styles.price}>${(props.price * state.DGBalances?.BALANCE_STAKING_UNISWAP).toFixed(2)}</p>

            <p className={styles.lower_text}>Provide liquidity to the ETH-$DG Uniswap pool for yield rewards.</p>

            <span>
              {Number(state.DGBalances?.BALANCE_STAKING_UNISWAP) ? (
                <Button
                  className={styles.lower_button}
                  onClick={() => {
                    props.reward(stakingContractUniswap);

                    //Show Toast Message3
                    const msg = 'Claiming Liquidity DG!';
                    dispatch({
                      type: 'show_toastMessage',
                      data: msg
                    });
                  }}
                >
                  Claim
                </Button>
              ) : (
                <Button
                  disabled
                  className={styles.lower_button}
                  onClick={() => {
                    //Show Toast Message3
                    const msg = 'Claiming Liquidity DG!';
                    dispatch({
                      type: 'show_toastMessage',
                      data: msg
                    });
                  }}
                >
                  Claim
                </Button>
              )}
            </span>
          </div>

          <div className={styles.lower} style={{ width: '500px', minWidth: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p className={styles.lower_header}>Liquidity Provision</p>
            <p className={styles.apy_text}>Your DG Staked</p>
            <p className={styles.apy_percent}>
              {}
              {formatPrice(state.stakingBalances?.BALANCE_STAKED_UNISWAP, 3)}
              <br />
              <abbr>${formatPrice(state.stakingBalances?.BALANCE_STAKED_UNISWAP * state.DGPrices.dg, 2)}</abbr>
            </p>

            <div style={{ display: 'flex', width: '80%' }}>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '50%'
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingBottom: '17px'
                  }}
                >
                  <p className={styles.apy_text}>Uniswap Staking APY</p>
                  <p className="earned-amount stat">N/A</p>
                </span>
              </span>

              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '50%'
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <p className={styles.apy_text}>Your DG Yielded</p>
                  <p className="earned-amount stat">0</p>
                </span>
              </span>
            </div>

            <div className={styles.content}>
              <div className={styles.contract_div}>
                <div className={styles.content}>
                  <img className={styles.dg} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                  <input
                    type="number"
                    className={styles.dg_input}
                    value={amountInput.toString()}
                    onChange={handleChange}
                    style={{
                      minWidth: `${5 + (amountInput.toString().length + 1) * 12}px`,
                      maxWidth: `${5 + (amountInput.toString().length + 1) * 12}px`
                    }}
                  />
                </div>

                <Button
                  className={styles.max_button}
                  onClick={() => {
                    setAmountInput(formatPrice(state.stakingBalances?.BALANCE_STAKED_UNISWAP, 3));
                  }}
                >
                  MAX
                </Button>
              </div>

              <div className={styles.button_div}>
                <Button
                  className={styles.button_blue}
                  onClick={() => {
                    props.withdrawal(stakingContractUniswap, amountInput);
                    setAmountInput('');
                  }}
                  disabled={amountInput <= 0 || parseFloat(amountInput.toString(), 10) > state.stakingBalances?.BALANCE_STAKED_UNISWAP ? true : false}
                >
                  Unstake {amountInput > 0 ? amountInput : ''} DG
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default Liquidity;
