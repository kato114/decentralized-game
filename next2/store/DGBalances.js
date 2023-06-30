import { useState, useEffect, useContext } from 'react';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { GlobalContext } from '@/store';
import ABI_CHILD_TOKEN_MANA from '../components/ABI/ABIChildTokenMANA';
import ABI_ICE_LP from '../components/ABI/ABILiquidityICE';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';

export const bigNumberResult = digits => result => {
  if (digits) {
    return BigNumber(result).div(Global.CONSTANTS.FACTOR).toFixed(3);
  } else {
    return BigNumber(result).div(Global.CONSTANTS.FACTOR).toString();
  }
};

export const makeBatchedPromises = (batch, promisesAndResultHandlers) => {
  const batchedPromises = promisesAndResultHandlers.map(
    methodAndHandler =>
      new Promise((resolve, reject) => {
        batch.add(
          methodAndHandler[0].call.request({}, 'latest', (error, result) => {
            if (result !== undefined) resolve(methodAndHandler[1](result));
            else reject(error);
          })
        );
      })
  );
  return Promise.all(batchedPromises);
};

function DGBalances() {
  // dispatch user's unclaimed DG balance to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [pointerContract, setPointerContract] = useState({});
  const [pointerContractNew, setPointerContractNew] = useState({});
  const [stakingContractPool1, setStakingContractPool1] = useState({});
  const [stakingContractPool2, setStakingContractPool2] = useState({});
  const [stakingContractUniswap, setStakingContractUniswap] = useState({});

  const [townHallGovernance, setTownHallGovernance] = useState({});
  const [stakeContractGovernance, setStakeContractGovernance] = useState({});

  const [DGTokenContract, setDGTokenContract] = useState({});
  const [DGLightTokenContract, setDGLightTokenContract] = useState({});
  const [DGMaticContract, setDGMaticContract] = useState({});

  const [XDGMaticContract, setXDGMaticContract] = useState({});

  const [DGLightMaticContract, setDGLightMaticContract] = useState({});
  const [BPTContract1, setBPTContract1] = useState({});
  const [keeperContract, setKeeperContract] = useState({});
  // const [maticMana, setMaticMana] = useState({});
  // const [maticDAIContract, setMaticDAIContract] = useState({});
  const [maticLPContract, setMaticLPContract] = useState({});
  const [maticWethContract, setMaticWethContract] = useState({});
  const [instances, setInstances] = useState(false);
  const [mainnetWeb3Provider, setMainnetWeb3Provider] = useState(null);

  let interval = {};
  let currentTime = 0;

  async function fetchData() {
    const mainnetWeb3 = new Web3(Global.CONSTANTS.MAINNET_URL); // pass Matic provider URL to Web3 constructor
    const maticWeb3 = new Web3(state.appConfig.polygonRPC); // pass Matic provider URL to Web3 constructor
    setMainnetWeb3Provider(mainnetWeb3);

    const [pointerContract, pointerContractNew, DGTokenContract, DGLightTokenContract, DGMaticContract, XDGMaticContract, DGLightMaticContract] = await Promise.all([
      Transactions.pointerContract(maticWeb3), // this is for mining DG
      Transactions.pointerContractNew(maticWeb3), // this is for affiliates
      Transactions.DGTokenContract(mainnetWeb3), // set up dg token contract (same for both pools)
      Transactions.DGLightTokenContract(mainnetWeb3), // set up dg token contract (same for both pools)
      Transactions.DGTokenContract(maticWeb3), // matic contract to get DG balance on matic chain for modal
      Transactions.XDGTokenContractChild(maticWeb3), // matic contract to get xDG balance on matic chain for modal,
      Transactions.DGLightTokenContract(maticWeb3) // matic contract to get DGLight balance on matic chain for modal
    ]);
    setPointerContract(pointerContract);
    setPointerContractNew(pointerContractNew);
    setDGTokenContract(DGTokenContract);
    setDGLightTokenContract(DGLightTokenContract);
    setDGMaticContract(DGMaticContract);
    setXDGMaticContract(XDGMaticContract);
    setDGLightMaticContract(DGLightMaticContract);

    // // matic contract to get xDG balance on main chain for modal
    // const XDGMainContract = await Transactions.XDGTokenContractMain(web3);
    // setXDGMainContract(XDGMainContract);

    // const MATIC_MANA = new maticWeb3.eth.Contract(
    //   ABI_CHILD_TOKEN_MANA,
    //   Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA
    // );
    // setMaticMana(MATIC_MANA);

    // const maticDAIContract = new maticWeb3.eth.Contract(
    //   ABI_CHILD_TOKEN_MANA,
    //   Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI
    // );
    // setMaticDAIContract(maticDAIContract);

    const maticLPContract = new maticWeb3.eth.Contract(ABI_ICE_LP, '0x9e3880647C07BA13E65663DE29783eCD96Ec21dE');
    setMaticLPContract(maticLPContract);

    const maticWethContract = new maticWeb3.eth.Contract(ABI_CHILD_TOKEN_MANA, '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619');
    setMaticWethContract(maticWethContract);

    const [stakingContractPool1, stakingContractPool2, keeperContract, townHallGovernance, stakeContractGovernance, BPTContract1, stakingContractUniswap] = await Promise.all([
      Transactions.stakingContractPool1(mainnetWeb3),
      Transactions.stakingContractPool2(mainnetWeb3),
      Transactions.keeperContract(mainnetWeb3),
      Transactions.townHallGovernance(mainnetWeb3),
      Transactions.stakingContractGovernance(mainnetWeb3),
      Transactions.BPTContract1(mainnetWeb3),
      Transactions.stakingContractUniswap(mainnetWeb3)
    ]);

    setStakingContractPool1(stakingContractPool1);

    setStakingContractPool2(stakingContractPool2);

    setKeeperContract(keeperContract);

    setTownHallGovernance(townHallGovernance);

    setStakeContractGovernance(stakeContractGovernance);

    setBPTContract1(BPTContract1);

    setStakingContractUniswap(stakingContractUniswap);

    setInstances(true); // contract instantiation complete
  }

  useEffect(() => {
    if (state.userStatus >= 4 && !!state.appConfig.polygonRPC) {
      fetchData();

      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });
    } else {
      setInstances(false);
    }
  }, [state.networkID, state.userStatus, state.appConfig.polygonRPC]);

  // anytime user updates values on /dg pages this code will execute
  useEffect(() => {
    if (instances) {
      (async function () {
        dispatch({
          type: 'dg_balances_loading',
          data: true
        });

        dispatch({
          type: 'staking_balances_loading',
          data: true
        });

        const [tokenBalances, DGGameplayCollected, balancesStaking] = await Promise.all([
          getTokenBalances(), // update global state unclaimed DG points balances
          getDGGameplayCollected(), // get historical gameplay collected amount
          getBalancesStaking() // update global state staking DG and balancer pool tokens
        ]);

        dispatch({
          type: 'dg_balances',
          data: tokenBalances
        });

        dispatch({
          type: 'dg_gameplay_collected',
          data: DGGameplayCollected
        });

        dispatch({
          type: 'staking_balances',
          data: balancesStaking
        });

        dispatch({
          type: 'dg_balances_loading',
          data: false
        });

        dispatch({
          type: 'staking_balances_loading',
          data: false
        });
      })();
    }
  }, [instances, state.refreshBalances]);

  // get user's DG staking balance every few seconds for the reward period duration
  useEffect(() => {
    if (state.stakeTime) {
      currentTime = Math.round(new Date().getTime() / 1000);

      if (currentTime < state.stakeTime) {
        interval = setInterval(() => {
          (async () => {
            // update global state BPT balances
            const refresh = !state.refreshBalances;

            dispatch({
              type: 'refresh_balances',
              data: refresh
            });
          })();

          currentTime = Math.round(new Date().getTime() / 1000);
          if (currentTime >= state.stakeTime) clearInterval(interval);
        }, 3000);

        return () => clearInterval(interval);
      }
    }
  }, [state.stakeTime]);

  async function getTokenBalances() {
    try {
      const batch = new mainnetWeb3Provider.BatchRequest();
      const batchPromises = makeBatchedPromises(batch, [
        [DGTokenContract.methods.balanceOf(state.userAddress), bigNumberResult(0)],
        [DGLightTokenContract.methods.balanceOf(state.userAddress), bigNumberResult(0)],
        [stakingContractPool1.methods.earned(state.userAddress), bigNumberResult(3)],
        [stakingContractPool2.methods.earned(state.userAddress), bigNumberResult(3)],
        [stakeContractGovernance.methods.earned(state.userAddress), bigNumberResult(3)],
        [stakingContractUniswap.methods.earned(state.userAddress), bigNumberResult(3)]
      ]);

      batch.execute();
      const [balances, BALANCE_MINING_DG, BALANCE_MINING_DG_V2, BALANCE_KEEPER_DG, BALANCE_CHILD_DG, BALANCE_CHILD_DG_LIGHT, BALANCE_CHILD_TOKEN_XDG] = await Promise.all([
        batchPromises,
        getDGBalanceGameplay(),
        getDGBalanceGameplayV2(),
        getDGBalanceKeeper(),
        Transactions.balanceOfToken(DGMaticContract, state.userAddress, 3),
        Transactions.balanceOfToken(DGLightMaticContract, state.userAddress, 3),
        Transactions.balanceOfToken(XDGMaticContract, state.userAddress, 3)
      ]);

      const [BALANCE_ROOT_DG, BALANCE_ROOT_DG_LIGHT, BALANCE_STAKING_BALANCER_1, BALANCE_STAKING_BALANCER_2, BALANCE_STAKING_GOVERNANCE, BALANCE_STAKING_UNISWAP] = balances;

      return {
        BALANCE_ROOT_DG: BALANCE_ROOT_DG,

        BALANCE_ROOT_DG_LIGHT: BALANCE_ROOT_DG_LIGHT,

        BALANCE_CHILD_DG,

        BALANCE_CHILD_DG_LIGHT,
        BALANCE_CHILD_TOKEN_XDG,
        BALANCE_MAIN_TOKEN_XDG: 0,

        BALANCE_STAKING_BALANCER_1: BALANCE_STAKING_BALANCER_1,
        BALANCE_STAKING_BALANCER_2: BALANCE_STAKING_BALANCER_2,
        BALANCE_STAKING_GOVERNANCE: BALANCE_STAKING_GOVERNANCE,
        BALANCE_STAKING_UNISWAP: BALANCE_STAKING_UNISWAP,
        BALANCE_MINING_DG: BALANCE_MINING_DG,

        BALANCE_MINING_DG_V2: BALANCE_MINING_DG_V2,

        BALANCE_KEEPER_DG: BALANCE_KEEPER_DG
      };
    } catch (error) {
      console.error('Token balances error: ', error);
    }
  }

  // get user's DG points balance from smart contract for gameplay mining
  async function getWETH() {
    try {
      const amount = await maticWethContract.methods.balanceOf('0x3c383B7Ffd5d2bF24EBd1fc8509ceFa9b7D1976f').call();

      const pointsAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return pointsAdjusted;
    } catch (error) {
      console.log('No DG points found: ' + error);
    }
  }

  // get user's DG points balance from smart contract for gameplay mining
  async function getDGBalanceGameplay() {
    try {
      const amount = await pointerContract.methods.pointsBalancer(state.userAddress).call();

      const pointsAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return pointsAdjusted;
    } catch (error) {
      console.log('No DG points found: ' + error);
    }
  }

  // get historical DG gameplay rewards amount from dgPointer smart contract
  async function getDGGameplayCollected() {
    try {
      const events = await DGMaticContract.getPastEvents('Transfer', {
        filter: {
          to: state.userAddress,
          from: Global.ADDRESSES.DG_POINTER_CONTRACT_ADDRESS_NEW
        },
        fromBlock: 7564153, // 16890328,
        toBlock: 'latest'
      });

      let valueAdjusted = 0;
      if (events.length) {
        const value = events[0].returnValues.value;
        valueAdjusted = (value / Global.CONSTANTS.FACTOR).toFixed(3);

        console.log('Returned gameplay rewards collected value: ' + valueAdjusted);
      } else {
        console.log('No gameplay rewards collected thus far');
      }

      return valueAdjusted;
    } catch (error) {
      console.log('Get gameplay rewards collected error: ' + error);
    }
  }

  // get user's DG points balance from smart contract for gameplay mining
  async function getDGBalanceGameplayV2() {
    try {
      const amount = await pointerContractNew.methods.pointsBalancer(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG).call();

      const pointsAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return pointsAdjusted;
    } catch (error) {
      console.log('No DG points found: ' + error);
    }
  }

  // get user's DG unclaimed balance from smart contract for keeping funds
  async function getDGBalanceKeeper() {
    try {
      const amount = await keeperContract.methods.availableBalance(state.userAddress).call();
      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG keeper balance found: ' + error);
    }
  }

  // get ice and usdc balances in lp pool
  async function getUSDCBalanceLP() {
    try {
      const amount = await maticLPContract.methods.getReserves().call();

      const usdc = amount[0] / 1000000;

      return usdc;
    } catch (error) {
      console.log('No DG keeper balance found: ' + error);
    }
  }

  async function getICEBalanceLP() {
    try {
      const amount = await maticLPContract.methods.getReserves().call();

      const ice = amount[1] / 1000000000000000000;

      return ice;
    } catch (error) {
      console.log('No DG keeper balance found: ' + error);
    }
  }

  async function getPolygonDG() {
    try {
      const amount = await maticLPContract.methods.getReserves().call();

      const ice = amount[1] / 1000000000000000000;

      return ice;
    } catch (error) {
      console.log('No DG keeper balance found: ' + error);
    }
  }

  // get contracts DG unclaimed balance from smart contract for keeping funds
  // async function getDGGameplayUnclaimed() {
  //   try {
  //     const amount = await keeperContract.methods
  //       .availableBalance('0x9e78ADcc93eA1CD666f37ECfC3c5a868Ae55d274')
  //       .call();
  //     const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

  //     return balanceAdjusted;
  //   } catch (error) {
  //     console.log('No DG keeper balance found: ' + error);
  //   }
  // }

  // get user's affiliate balances
  async function getAffiliateBalances() {
    try {
      const [amountMana, amountDai, amountUSDT, amountAtri, amountEth] = await Promise.all([
        pointerContractNew.methods.profitPagination(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA, 0, 50).call(),
        pointerContractNew.methods.profitPagination(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI, 0, 50).call(),
        pointerContractNew.methods.profitPagination(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT, 0, 50).call(),
        pointerContractNew.methods.profitPagination(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI, 0, 50).call(),
        pointerContractNew.methods.profitPagination(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH, 0, 50).call()
      ]);

      const wrappedResult = amountMana._players.map((address, index) => {
        return {
          address,
          mana: amountMana._profits[index] / Global.CONSTANTS.FACTOR,
          dai: amountDai._profits[index] / Global.CONSTANTS.FACTOR,
          usdt: amountUSDT._profits[index] / Global.CONSTANTS.FACTOR,
          atri: amountAtri._profits[index] / Global.CONSTANTS.FACTOR,
          eth: amountEth._profits[index] / Global.CONSTANTS.FACTOR
        };
      });

      return wrappedResult;
    } catch (error) {
      console.log('Affiliate array not found: ' + error);
    }
  }

  async function getBalancesStaking() {
    try {
      const batch = new mainnetWeb3Provider.BatchRequest();
      const batchPromises = makeBatchedPromises(batch, [
        [BPTContract1.methods.balanceOf(Global.ADDRESSES.DG_STAKING_BALANCER_ADDRESS_1), bigNumberResult(4)],
        [DGTokenContract.methods.balanceOf(Global.ADDRESSES.DG_STAKING_BALANCER_ADDRESS_1), bigNumberResult(4)],
        [DGLightTokenContract.methods.balanceOf(Global.ADDRESSES.ROOT_DG_TOWN_HALL_ADDRESS), bigNumberResult(0)],
        [stakeContractGovernance.methods.balanceOf(state.userAddress), bigNumberResult(0)],
        [townHallGovernance.methods.balanceOf(state.userAddress), bigNumberResult(0)],
        [stakingContractUniswap.methods.balanceOf(state.userAddress), bigNumberResult(0)]
      ]);
      batch.execute();

      const [BALANCE_CONTRACT_BPT_1, BALANCE_CONTRACT_DG_1, BALANCE_CONTRACT_TOWNHALL, BALANCE_USER_GOVERNANCE_OLD, BALANCE_USER_GOVERNANCE, BALANCE_STAKED_UNISWAP] =
        await batchPromises;

      return {
        BALANCE_CONTRACT_BPT_1: BALANCE_CONTRACT_BPT_1,
        BALANCE_CONTRACT_DG_1: BALANCE_CONTRACT_DG_1,
        BALANCE_CONTRACT_TOWNHALL: BALANCE_CONTRACT_TOWNHALL,
        BALANCE_USER_GOVERNANCE_OLD: BALANCE_USER_GOVERNANCE_OLD,
        BALANCE_USER_GOVERNANCE: BALANCE_USER_GOVERNANCE,
        BALANCE_STAKED_UNISWAP: BALANCE_STAKED_UNISWAP
      };
    } catch (error) {
      console.log('Staking balances error: ' + error);
    }
  }

  return null;
}

export default DGBalances;
