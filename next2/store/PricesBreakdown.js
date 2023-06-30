import { useEffect, useContext } from 'react';
import Web3 from 'web3';
import { GlobalContext } from '@/store';
import Transactions from '../common/Transactions';
import Fetch from '../common/Fetch';
import Global from '../components/Constants';

function PricesBreakdown() {
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      (async () => {
        try {
          const [manaJson, atriJson, ethJson, iceJson, dgJson, xDGJson] = await Promise.all([
            Fetch.MANA_PRICE(),
            Fetch.ATRI_PRICE(),
            Fetch.ETH_PRICE(),
            Fetch.ICE_PRICE(),
            Fetch.DG_SUPPLY_GECKO(),
            Fetch.DG_GOVERNANCE_SUPPLY_GECKO()
          ]);

          const priceMANA = manaJson.market_data.current_price.usd;
          const priceATRI = atriJson.market_data.current_price.usd;
          const priceETH = ethJson.market_data.current_price.usd;
          const priceICE = iceJson.market_data.current_price.usd;
          const priceDG = dgJson.market_data.current_price.usd;
          const priceXDG = xDGJson.market_data.current_price.usd;

          dispatch({
            type: 'dg_prices',
            data: {
              mana: priceMANA,
              atri: priceATRI,
              eth: priceETH,
              dai: 1,
              usdt: 1,
              xDG: priceXDG,
              dg: priceDG,
              ice: priceICE
            }
          });
        } catch (error) {
          console.log('Get prices error', error);
        }
      })();
    }
  }, [state.userStatus]);

  // this is for affiliates
  useEffect(() => {
    if (state.userAddress && state.userStatus >= 4 && !!state.appConfig.polygonRPC) {
      const maticWeb3 = new Web3(state.appConfig.polygonRPC); // pass Matic provider URL to Web3 constructor

      (async () => {
        const pointerContractNew = await Transactions.pointerContractNew(maticWeb3);
        const atri = await pointerContractNew.methods.pointsBalancer(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI).call();

        const usdt = await pointerContractNew.methods.pointsBalancer(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT).call();

        const mana = await pointerContractNew.methods.pointsBalancer(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA).call();

        const dai = await pointerContractNew.methods.pointsBalancer(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI).call();

        const eth = await pointerContractNew.methods.pointsBalancer(state.userAddress, Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH).call();

        dispatch({
          type: 'dg_breakdown',
          data: {
            mana: mana / Global.CONSTANTS.FACTOR,
            atri: atri / Global.CONSTANTS.FACTOR,
            eth: eth / Global.CONSTANTS.FACTOR,
            dai: dai / Global.CONSTANTS.FACTOR,
            usdt: usdt / Global.CONSTANTS.FACTOR
          }
        });
      })();
    }
  }, [state.userStatus, state.appConfig.polygonRPC]);

  return null;
}

export default PricesBreakdown;
