import { useEffect, useContext, useState } from 'react';
import { isEmpty } from 'lodash';
import Web3 from 'web3';
import { GlobalContext } from '@/store';
import ABI_ROOT_TOKEN from '../components/ABI/ABIDummyToken';
import ABI_CHILD_TOKEN_MANA from '../components/ABI/ABIChildTokenMANA';
import ABI_CHILD_TOKEN_DAI from '../components/ABI/ABIChildTokenDAI';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';
import { bigNumberResult, makeBatchedPromises } from './DGBalances';

function UserBalances() {
  // dispatch user's token balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let binance = {};
  let balances = [];
  let ethBalances = '';

  const [web3Provider, setWeb3Provider] = useState({});
  const [maticWeb3, setMaticWeb3] = useState({});

  useEffect(() => {
    if (state.userLoggedIn && !!state.appConfig.polygonRPC && !!state.userAddress) {
      setWeb3Provider(new Web3(Global.CONSTANTS.MAINNET_URL)); // pass MetaMask provider to Web3 constructor
      setMaticWeb3(new Web3(state.appConfig.polygonRPC)); // pass Matic provider URL to Web3 constructor
      binance = new Web3('https://bsc-dataseed1.binance.org:443');

      async function fetchData() {
        balances = await getTokenBalances();

        if (balances)
          dispatch({
            type: 'update_balances',
            data: balances
          });
      }

      if (!isEmpty(web3Provider) && !isEmpty(maticWeb3)) {
        fetchData();
      }
    }
  }, [state.userLoggedIn, state.userAddress, state.appConfig.polygonRPC]);

  useEffect(() => {
    if (state.userAddress && state.userStatus >= 4) {
      setWeb3Provider(new Web3(Global.CONSTANTS.MAINNET_URL)); // pass MetaMask provider to Web3 constructor

      async function fetchDataEth() {
        ethBalances = await getEthBalance();

        dispatch({
          type: 'update_eth_balance',
          data: ethBalances
        });
      }

      if (!isEmpty(web3Provider)) {
        fetchDataEth();
      }
    }
  }, [state.userStatus]);

  async function getEthBalance() {
    const amountETH = await web3Provider.eth.getBalance(state.userAddress);
    return amountETH / 1000000000000000000;
  }

  // get balances on mainnet and Matic networks
  async function getTokenBalances() {
    const tokenContractRoot = new web3Provider.eth.Contract(ABI_ROOT_TOKEN, Global.ADDRESSES.ROOT_TOKEN_ADDRESS_MANA);

    const tokenContractChild = new maticWeb3.eth.Contract(ABI_CHILD_TOKEN_MANA, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA);

    const DAIContractChild = new maticWeb3.eth.Contract(ABI_CHILD_TOKEN_DAI, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI);

    const USDTContractChild = new maticWeb3.eth.Contract(ABI_CHILD_TOKEN_DAI, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT);

    const ATRIContractChild = new maticWeb3.eth.Contract(ABI_CHILD_TOKEN_DAI, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI);

    const WETHContractChild = new maticWeb3.eth.Contract(ABI_CHILD_TOKEN_DAI, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH);

    const BUSDContract = new binance.eth.Contract(ABI_ROOT_TOKEN, '0xe9e7cea3dedca5984780bafc599bd69add087d56');

    try {
      const batch = new maticWeb3.BatchRequest();
      const batchPromises = makeBatchedPromises(batch, [
        [tokenContractChild.methods.balanceOf(state.userAddress), bigNumberResult(0)],
        [tokenContractRoot.methods.balanceOf(state.userAddress), bigNumberResult(0)],
        [DAIContractChild.methods.balanceOf(state.userAddress), bigNumberResult(0)],
        [USDTContractChild.methods.balanceOf(state.userAddress), bigNumberResult(0)]
      ]);
      batch.execute();

      const [amountMANA1, amountMANA2, amountDAI2, amountUSDT] = await batchPromises;

      // get user or contract token balance from MetaMask
      async function balanceOfBUSD(tokenContract, userOrContractAddress, units) {
        try {
          if (tokenContract.methods) {
            const amount = await tokenContract.methods.balanceOf(userOrContractAddress).call();

            return amount / Global.CONSTANTS.FACTOR;
          }
        } catch (error) {
          console.log('Get balance failed', error);
        }
      }

      const amountBUSD = await balanceOfBUSD(BUSDContract, state.userAddress, 0);

      // get user or contract token balance from MetaMask
      async function balanceOfAtari(tokenContract, userOrContractAddress, units) {
        try {
          if (tokenContract.methods) {
            const amount = await tokenContract.methods.balanceOf(userOrContractAddress).call();

            return amount;
          }
        } catch (error) {
          console.log('Get balance failed', error);
        }
      }

      const amountATRI = await balanceOfAtari(ATRIContractChild, state.userAddress, 0);

      const amountWETH = await Transactions.balanceOfToken(WETHContractChild, state.userAddress, 3);

      return [
        [0, amountDAI2],
        [amountMANA1, amountMANA2],
        [0, amountUSDT, amountATRI, amountWETH],
        [0, amountBUSD]
      ];
    } catch (error) {
      console.log('Get user balances error: ', error);
    }
  }

  return null;
}

export default UserBalances;
