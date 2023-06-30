import { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import Link from 'next/link';
import { Divider, Input } from 'semantic-ui-react';
import { useMediaQuery } from 'hooks';
import { GlobalContext } from '@/store';
import Overview from '../../content/ContentDAO/Overview';
import Governance from '../../content/ContentDAO/Governance';
import Liquidity from '../../content/ContentDAO/Liquidity';
import Gameplay from '../../content/ContentDAO/Gameplay';
import ContentTreasury from '../../content/ContentDAO/Treasury/index.tsx';
import TokenMigration from '../../content/ContentDAO/TokenMigration';
import FoxAnimation from '../../lottieAnimation/animations/Fox';
import ContentAirdrop from '../../content/ContentAirdrop/ContentAirdrop';
import ButtonReward1 from '../../button/ButtonReward1';
import ButtonReward2 from '../../button/ButtonReward2';
import Transactions from '../../../common/Transactions';
import Global from '../../Constants';
import Fetch from '../../../common/Fetch';
import styles from './DAO.module.scss';
import { formatPrice, getAmounts } from '@/common/utils';

const DAO = props => {
  // get user's state from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [stakingContractPool1, setStakingContractPool1] = useState({});
  const [stakingContractPool2, setStakingContractPool2] = useState({});
  const [instances, setInstances] = useState(false);
  const [web3, setWeb3] = useState({});
  const [currenReward, setCurrentReward] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const [price, setPrice] = useState(0);
  const [amountInput, setAmountInput] = useState('10000000000000000000');
  const DGState = props.DGState;
  const DGBalances = state.DGBalances?.BALANCE_STAKING_UNISWAP;
  const DGStakingBalances = state.stakingBalances?.BALANCE_STAKED_UNISWAP;

  // Responsive
  const isMobile = useMediaQuery('(max-width: 1040px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get Treasury data
  useEffect(() => {
    (async () => {
      // Fetch data if not within the app state
      if (!state.treasuryNumbers) {
        let json = await Fetch.TREASURY_STATS_NUMBERS('week');

        dispatch({
          type: 'treasury_numbers',
          data: json
        });
      }
    })();
  }, []);

  useEffect(() => {
    setMobileOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize Web3 provider and create contract instances
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      async function fetchData() {
        const stakingContractPool1 = await Transactions.stakingContractPool1(web3);
        setStakingContractPool1(stakingContractPool1);

        const stakingContractPool2 = await Transactions.stakingContractPool2(web3);
        setStakingContractPool2(stakingContractPool2);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  // fetch circulating supply
  // useEffect(() => {
  //   (async function () {
  //     const json = await Fetch.DG_SUPPLY_GECKO();
  //     if (json && json.market_data) {
  //       setPrice(json.market_data.current_price.usd);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    setPrice(state.DGPrices.dg);
  }, [state.DGPrices]);

  // get initial reward and timestamp values
  useEffect(() => {
    if (instances) {
      const rewardAdjusted = amountInput / Global.CONSTANTS.FACTOR;
      rewardData(rewardAdjusted);
    }
  }, [instances]);

  // get timestamp on page load
  useEffect(() => {
    if (instances) {
      (async () => {
        const timestamp = await getPeriodFinish();

        // dispatch timestamp to the Context API store
        dispatch({
          type: 'stake_time',
          data: timestamp
        });
      })();
    }
  }, [instances]);

  async function staking(tokenContract, contractAddress, stakingContract, amount) {
    console.log('Call stake() function to stake tokens');

    const { amountAdjusted, amountToString } = getAmounts(amount);
    console.log('Staking amount input (number): ' + amountAdjusted);
    console.log('Staking amount input (string): ' + amountToString);

    try {
      console.log('Get amount user has authorized our staking contract to spend');

      const amountAllowance = await tokenContract.methods.allowance(state.userAddress, contractAddress).call();

      console.log('Authorized amount: ' + amountAllowance);

      if (Number(amountAllowance) < amountAdjusted) {
        console.log("Approve staking contract to spend user's tokens");

        const data = await tokenContract.methods.approve(contractAddress, Global.CONSTANTS.MAX_AMOUNT).send({ from: state.userAddress });

        console.log('approve() transaction confirmed: ' + data.transactionHash);
      }

      console.log('Call stake() function on smart contract');

      const data = await stakingContract.methods.stake(amountToString).send({ from: state.userAddress });

      console.log('stake() transaction completed: ' + data.transactionHash);

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });
    } catch (error) {
      console.log('Staking transactions error: ' + error);
    }
  }

  async function withdrawal(stakingContract, amount) {
    console.log('Call withdraw() function to unstake tokens');

    const { amountAdjusted, amountToString } = getAmounts(amount);
    console.log('Withdraw amount input (number): ' + amountAdjusted);
    console.log('Withdraw amount input (string): ' + amountToString);

    try {
      const data = await stakingContract.methods.withdraw(amountToString).send({ from: state.userAddress });

      console.log('withdraw() transaction completed: ' + data.transactionHash);

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });
    } catch (error) {
      console.log('Withdraw transaction error: ' + error);
    }
  }

  async function reward(stakingContract) {
    console.log('Call getReward() function to claim tokens');

    try {
      const data = await stakingContract.methods.getReward().send({ from: state.userAddress });

      console.log('getReward() transaction completed: ' + data.transactionHash);

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });
    } catch (error) {
      console.log('Get rewards transaction error: ' + error);
    }
  }

  // helper functions
  function submenu() {
    return (
      <>
        {!mobileOpen ? (
          <div className={styles.tablet_menu_container}>
            <div className={styles.burger_icon} onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="9" height="15" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={styles.menu_list}>
              <div>
                <Link href="/dg">
                  <div className={styles.menu_item} style={{ marginTop: '2px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.24463 14.7815L10.2378 10.8914L13.652 13.5733L16.581 9.79297"
                        stroke={DGState === 'overview' ? 'white' : '#808080'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="19.9954"
                        cy="4.20027"
                        r="1.9222"
                        stroke={DGState === 'overview' ? 'white' : '#808080'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.9243 3.12012H7.65655C4.64511 3.12012 2.77783 5.25284 2.77783 8.26428V16.3467C2.77783 19.3581 4.6085 21.4817 7.65655 21.4817H16.2607C19.2721 21.4817 21.1394 19.3581 21.1394 16.3467V9.30776"
                        stroke={DGState === 'overview' ? 'white' : '#808080'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/dg/treasury">
                  <div className={styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21.2099 15.8901C20.5737 17.3946 19.5787 18.7203 18.3118 19.7514C17.0449 20.7825 15.5447 21.4875 13.9424 21.8049C12.34 22.1222 10.6843 22.0422 9.12006 21.5719C7.55578 21.1015 6.13054 20.2551 4.96893 19.1067C3.80733 17.9583 2.94473 16.5428 2.45655 14.984C1.96837 13.4252 1.86948 11.7706 2.16851 10.1647C2.46755 8.55886 3.15541 7.05071 4.17196 5.77211C5.18851 4.49351 6.5028 3.4834 7.99992 2.83008"
                        stroke={DGState === 'treasury' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z"
                        stroke={DGState === 'treasury' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/dg/governance">
                  <div className={styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
                        stroke={DGState === 'governance' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z"
                        stroke={DGState === 'governance' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line x1="9" y1="16" x2="15" y2="16" stroke={DGState === 'governance' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="9" y1="12" x2="15" y2="12" stroke={DGState === 'governance' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>

                <Link href="/dg/mining">
                  <div className={styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                        stroke={DGState === 'mining' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.21 13.8899L7 22.9999L12 19.9999L17 22.9999L15.79 13.8799"
                        stroke={DGState === 'mining' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>

                {DGBalances > 0 ||
                  (DGStakingBalances > 0 && (
                    <Link href="/dg/liquidity">
                      <div className={styles.menu_item}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 1V23" stroke={DGState === 'uniswap' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path
                            d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                            stroke={DGState === 'uniswap' ? 'white' : '#808080'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.menu_container}>
            <div className={styles.menu_list}>
              <div className={styles.menu_header}>
                <span>DAO Tools</span>
                {isMobile && (
                  <div className={styles.burger_icon} onClick={() => setMobileOpen(!mobileOpen)}>
                    <svg width="9" height="15" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>

              <div>
                <Link href="/dg">
                  <div className={DGState === 'overview' ? styles.menu_item_active : styles.menu_item} id={DGState === 'overview' ? styles.active_padding : ''}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.24463 14.7815L10.2378 10.8914L13.652 13.5733L16.581 9.79297"
                        stroke={DGState === 'overview' ? 'white' : '#808080'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="19.9954"
                        cy="4.20027"
                        r="1.9222"
                        stroke={DGState === 'overview' ? 'white' : '#808080'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.9243 3.12012H7.65655C4.64511 3.12012 2.77783 5.25284 2.77783 8.26428V16.3467C2.77783 19.3581 4.6085 21.4817 7.65655 21.4817H16.2607C19.2721 21.4817 21.1394 19.3581 21.1394 16.3467V9.30776"
                        stroke={DGState === 'overview' ? 'white' : '#808080'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className={styles.menu_title}>Overview</div>
                  </div>
                </Link>

                <Link href="/dg/treasury">
                  <div className={DGState === 'treasury' ? styles.menu_item_active : styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21.2099 15.8901C20.5737 17.3946 19.5787 18.7203 18.3118 19.7514C17.0449 20.7825 15.5447 21.4875 13.9424 21.8049C12.34 22.1222 10.6843 22.0422 9.12006 21.5719C7.55578 21.1015 6.13054 20.2551 4.96893 19.1067C3.80733 17.9583 2.94473 16.5428 2.45655 14.984C1.96837 13.4252 1.86948 11.7706 2.16851 10.1647C2.46755 8.55886 3.15541 7.05071 4.17196 5.77211C5.18851 4.49351 6.5028 3.4834 7.99992 2.83008"
                        stroke={DGState === 'treasury' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z"
                        stroke={DGState === 'treasury' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className={styles.menu_title}>Treasury</div>
                  </div>
                </Link>

                <Link href="/dg/governance">
                  <div className={DGState === 'governance' ? styles.menu_item_active : styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
                        stroke={DGState === 'governance' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z"
                        stroke={DGState === 'governance' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line x1="9" y1="16" x2="15" y2="16" stroke={DGState === 'governance' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="9" y1="12" x2="15" y2="12" stroke={DGState === 'governance' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className={styles.menu_title}>Governance</div>
                  </div>
                </Link>

                {DGBalances > 0 ||
                  (DGStakingBalances > 0 && (
                    <Link href="/dg/liquidity">
                      <div className={DGState === 'uniswap' ? styles.menu_item_active : styles.menu_item}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 1V23" stroke={DGState === 'uniswap' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path
                            d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                            stroke={DGState === 'uniswap' ? 'white' : '#808080'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className={styles.menu_title}>Liquidity Provision</div>
                      </div>
                    </Link>
                  ))}

                <Link href="/dg/migration">
                  <div className={DGState === 'tokenMigration' ? styles.menu_item_active : styles.menu_item}>
                    <svg width="25" height="16" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2 8C2 4.68629 4.68629 2 8 2C9.43178 2 10.7464 2.50151 11.7779 3.33844C12.2293 2.8331 12.7529 2.39368 13.3326 2.03643C11.9174 0.770024 10.0486 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C10.0486 16 11.9174 15.23 13.3326 13.9636C12.7529 13.6063 12.2293 13.1669 11.7779 12.6616C10.7464 13.4985 9.43178 14 8 14C4.68629 14 2 11.3137 2 8Z"
                        fill={DGState === 'tokenMigration' ? 'white' : '#808080'}
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17 2C13.6863 2 11 4.68629 11 8C11 11.3137 13.6863 14 17 14C20.3137 14 23 11.3137 23 8C23 4.68629 20.3137 2 17 2ZM9 8C9 3.58172 12.5817 0 17 0C21.4183 0 25 3.58172 25 8C25 12.4183 21.4183 16 17 16C12.5817 16 9 12.4183 9 8Z"
                        fill={DGState === 'tokenMigration' ? 'white' : '#808080'}
                      />
                    </svg>

                    <div className={styles.menu_title}>Token Migration</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  function handleChange(e) {
    setAmountInput(e.target.value);
  }

  async function rewardData(amountReward) {
    const timestamp = await getPeriodFinish();

    const date = new Date(timestamp * 1000);
    const hours = date.getHours(); // hours part from the timestamp
    const minutes = '0' + date.getMinutes(); // minutes part from the timestamp
    const seconds = '0' + date.getSeconds(); // seconds part from the timestamp
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    setCurrentReward(amountReward);
    setFinishTime(formattedTime);

    // dispatch timestamp to the Context API store
    dispatch({
      type: 'stake_time',
      data: timestamp
    });
  }

  async function getPeriodFinish() {
    try {
      const timestamp = await stakingContractPool1.methods.periodFinish().call();

      return timestamp;
    } catch (error) {
      console.log('Return reward period time error: ' + error);
    }
  }

  // console.log(DGState);

  function contentAdmin() {
    return (
      <div className="DG-liquidity-container top">
        <div className="DG-column top">
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <p>BPT balance in contract: {formatPrice(state.stakingBalances?.BALANCE_CONTRACT_BPT_1, 3)}</p>
            <p>DG balance in contract: {formatPrice(state.stakingBalances?.BALANCE_CONTRACT_DG_1, 3)}</p>
            <p>Current reward amount: {currenReward}</p>
            <p>Reward period finish time: {finishTime}</p>

            <Input className="liquidity-input" fluid placeholder="Amount" value={amountInput} onChange={handleChange} />

            <Divider />

            <p>
              <ButtonReward1 stakingContractPool1={stakingContractPool1} rewardAmount={amountInput} rewardData={amount => rewardData(amount)} />
            </p>
            <p>
              <ButtonReward2 stakingContractPool2={stakingContractPool2} rewardAmount={amountInput} rewardData={amount => rewardData(amount)} />
            </p>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: state.appConfig.webNotice ? '50px' : '0px' }}>
      <div className="d-flex flex-row">
        {submenu()}
        {/* <div style={{ marginTop: '-200vh', width: isTablet || isMobile ? 'calc(100% - 80px)' : 'calc(100% - 300px)', float: 'right' }}> */}
        <div className={styles.main_container}>
          {DGState === 'overview' ? (
            <Overview price={price} formatPrice={formatPrice} />
          ) : DGState === 'governance' ? (
            <>
              {!state.userStatus ? (
                <section style={{ marginTop: '100px' }}>
                  <FoxAnimation />
                </section>
              ) : (
                <Governance
                  price={price}
                  instances={instances}
                  stakingContractPool1={stakingContractPool1}
                  stakingContractPool2={stakingContractPool2}
                  staking={staking}
                  withdrawal={withdrawal}
                  reward={reward}
                />
              )}
            </>
          ) : DGState === 'uniswap' ? (
            <>
              {!state.userStatus ? (
                <section style={{ marginTop: '100px' }}>
                  <FoxAnimation />
                </section>
              ) : (
                <Liquidity
                  price={price}
                  instances={instances}
                  stakingContractPool1={stakingContractPool1}
                  stakingContractPool2={stakingContractPool2}
                  staking={staking}
                  withdrawal={withdrawal}
                  reward={reward}
                />
              )}
            </>
          ) : DGState === 'mining' ? (
            <>
              {!state.userStatus ? (
                <section style={{ marginTop: '100px' }}>
                  <FoxAnimation />
                </section>
              ) : (
                <Gameplay
                  price={price}
                  instances={instances}
                  stakingContractPool1={stakingContractPool1}
                  stakingContractPool2={stakingContractPool2}
                  staking={staking}
                  withdrawal={withdrawal}
                  reward={reward}
                />
              )}
            </>
          ) : DGState === 'treasury' ? (
            <ContentTreasury />
          ) : DGState === 'airdrop' ? (
            <ContentAirdrop price={price} />
          ) : DGState === 'admin' ? (
            contentAdmin()
          ) : DGState === 'miningv1' ? (
            <ContentMiningV1 price={price} />
          ) : DGState === 'tokenMigration' ? (
            <>
              {!state.userStatus ? (
                <section style={{ marginTop: '100px' }}>
                  <FoxAnimation />
                </section>
              ) : (
                <TokenMigration price={price} />
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DAO;
