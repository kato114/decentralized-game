import cn from 'classnames';
import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '@/store';
import { Button } from 'semantic-ui-react';
import Global from 'components/Constants';
import Transactions from 'common/Transactions';
import Aux from '../../../_Aux';
import { Biconomy } from '@biconomy/mexa';
import Web3 from 'web3';
import styles from './Gameplay.module.scss';
import MetaTx from '../../../../common/MetaTx';
import { formatPrice } from '@/common/utils';

const Gameplay = () => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [pointerContractNew, setPointerContractNew] = useState({});
  const [price, setPrice] = useState(0);
  const [web3, setWeb3] = useState({});

  useEffect(() => {
    setPrice(state.DGPrices.dg);
  }, [state.DGPrices]);

  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize Web3 providers and create contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(new Web3.providers.HttpProvider(state.appConfig.polygonRPC), {
        apiKey: Global.KEYS.BICONOMY_API_1,
        debug: true
      });
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      async function fetchData() {
        const pointerContractNew = await Transactions.pointerContractNew(getWeb3);
        setPointerContractNew(pointerContractNew);
      }

      fetchData();

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Gameplay Rewards');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  // Biconomy API meta-transaction. Dispatch DG tokens to player
  async function metaTransaction() {
    try {
      console.log('Dispatching DG tokens to address: ' + state.userAddress);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = pointerContractNew.methods.distributeTokensForPlayer(state.userAddress).encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(7, functionSignature, pointerContractNew, state.userAddress, web3);

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // update global state BPT balances
        const refresh = !state.refreshBalances;

        dispatch({
          type: 'refresh_balances',
          data: refresh
        });
      }
    } catch (error) {
      console.log('Biconomy meta-transaction error: ' + error);
    }
  }

  return (
    <Aux>
      <div className={cn('d-flex', styles.stake_DG_container)}>
        <div className={styles.lower}>
          <p className={styles.lower_header}>Claim $DG Rewards</p>
          <div className={styles.lower_value}>
            <p className={styles.DG_value}>{formatPrice(state.DGBalances?.BALANCE_MINING_DG_V2, 3)}</p>
            <img style={{ marginTop: '-4px' }} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1624411671/Spinning-Logo-DG_n9f4xd.gif" />
          </div>
          <p className={styles.price}>${(price * state.DGBalances?.BALANCE_MINING_DG_V2).toFixed(2)}</p>

          <Button className={cn(styles.claim_DG, styles.lower_button)} disabled={!Number(state.DGBalances?.BALANCE_MINING_DG_V2)} onClick={() => metaTransaction()}>
            Claim {formatPrice(state.DGBalances?.BALANCE_MINING_DG_V2, 3)} $DG
          </Button>
        </div>
      </div>
    </Aux>
  );
};

export default Gameplay;
