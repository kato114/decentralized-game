import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Web3 from 'web3';
import Link from 'next/link';
import { Divider, Input } from 'semantic-ui-react';
import ContentGovernance from '../content/ContentGovernance';
import ContentMining from '../content/ContentMining';
import ContentMiningV1 from '../content/ContentMiningV1';
import ContentBalancer from '../content/ContentBalancer';
import ContentUniswap from '../content/ContentUniswap';
import ContentAirdrop from '../content/ContentAirdrop';
import ContentTreasury from '../content/ContentTreasury';
import ButtonReward1 from '../button/ButtonReward1';
import ButtonReward2 from '../button/ButtonReward2';
import Transactions from '../../common/Transactions';
import Global from '../Constants';
import Fetch from '../../common/Fetch';
import Overview from './Overview';
import Governance from './Governance';
import Liquidity from './Liquidity';
import Treasury from './Treasury';

const ContentDAO = props => {
  // get user's state from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [stakingContractPool1, setStakingContractPool1] = useState({});
  // const [stakingContractPool2, setStakingContractPool2] = useState({});
  // const [instances, setInstances] = useState(false);
  const [web3, setWeb3] = useState({});
  // const [currenReward, setCurrentReward] = useState(0);
  // const [finishTime, setFinishTime] = useState(0);
  // const [price, setPrice] = useState(0);
  const [amountInput, setAmountInput] = useState('10000000000000000000');

  // const DGState = props.DGState;

  
  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize Web3 provider and create contract instances
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      // async function fetchData() {
      //   const stakingContractPool1 = await Transactions.stakingContractPool1(
      //     web3
      //   );
      //   setStakingContractPool1(stakingContractPool1);

      //   const stakingContractPool2 = await Transactions.stakingContractPool2(
      //     web3
      //   );
      //   setStakingContractPool2(stakingContractPool2);

      //   setInstances(true); // contract instantiation complete
      // }

      // fetchData();
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

  // get initial reward and timestamp values
  useEffect(() => {
    // if (instances) {
    const rewardAdjusted = amountInput / Global.CONSTANTS.FACTOR;
    rewardData(rewardAdjusted);
    // }
  }, []);

  // get timestamp on page load
  useEffect(() => {
    // if (instances) {
    (async () => {
      const timestamp = await getPeriodFinish();

      // dispatch timestamp to the Context API store
      dispatch({
        type: 'stake_time',
        data: timestamp,
      });
    })();
    // }
  }, []);

  // function formatPrice(balanceDG, units) {
  //   const priceFormatted = Number(balanceDG)
  //     .toFixed(units)
  //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  //   return priceFormatted;
  // }

  
  // stake, withdraw, and get reward from staking contracts
  function getAmounts(amount) {
    const amountAdjusted = amount * Global.CONSTANTS.FACTOR;
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (10 || -1) + '})?');
    const truncated = amount.toString().match(re)[0];
    const amountToString = web3.utils.toWei(truncated);

    return { amountAdjusted, amountToString };
  }

  async function staking(
    tokenContract,
    contractAddress,
    stakingContract,
    amount
  ) {
    console.log('Call stake() function to stake tokens');

    const { amountAdjusted, amountToString } = getAmounts(amount);
    console.log('Staking amount input (number): ' + amountAdjusted);
    console.log('Staking amount input (string): ' + amountToString);

    try {
      console.log(
        'Get amount user has authorized our staking contract to spend'
      );

      const amountAllowance = await tokenContract.methods
        .allowance(state.userAddress, contractAddress)
        .call();

      console.log('Authorized amount: ' + amountAllowance);

      if (Number(amountAllowance) < amountAdjusted) {
        console.log("Approve staking contract to spend user's tokens");

        const data = await tokenContract.methods
          .approve(contractAddress, Global.CONSTANTS.MAX_AMOUNT)
          .send({ from: state.userAddress });

        console.log('approve() transaction confirmed: ' + data.transactionHash);
      }

      console.log('Call stake() function on smart contract');

      const data = await stakingContract.methods
        .stake(amountToString)
        .send({ from: state.userAddress });

      console.log('stake() transaction completed: ' + data.transactionHash);

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
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
      const data = await stakingContract.methods
        .withdraw(amountToString)
        .send({ from: state.userAddress });

      console.log('withdraw() transaction completed: ' + data.transactionHash);

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Withdraw transaction error: ' + error);
    }
  }

  async function reward(stakingContract) {
    console.log('Call getReward() function to claim tokens');

    try {
      const data = await stakingContract.methods
        .getReward()
        .send({ from: state.userAddress });

      console.log('getReward() transaction completed: ' + data.transactionHash);

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Get rewards transaction error: ' + error);
    }
  }

  if (props.content === 'Overview') {
    return <Overview />;
  } else if (props.content === 'Governance') {
    return <Governance />;
  } else if (props.content === 'Liquidity') {
    return <Liquidity />;
  } else if (props.content === 'Gameplay') {
    return <Gameplay />;
  } else if (props.content === 'Treasury') {
    return <Treasury />;
  }
};

export default ContentDAO;
