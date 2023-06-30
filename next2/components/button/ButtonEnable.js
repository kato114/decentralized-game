import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Biconomy } from '@biconomy/mexa';
import Web3 from 'web3';
import { Button } from 'semantic-ui-react';
import Global from '../Constants';
import Fetch from '../../common/Fetch';
import MetaTx from '../../common/MetaTx';
import Aux from '../_Aux';
import Transactions from '../../common/Transactions';

function ButtonEnable() {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [parentContract, setParentContract] = useState({});
  const [web3, setWeb3] = useState({});
  const [maticWeb3, setMaticWeb3] = useState({});

  const sessionDuration = Global.CONSTANTS.ACTIVE_PERIOD;

  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize Web3 providers and create token contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const maticWeb3 = new Web3(state.appConfig.polygonRPC); // pass Matic provider URL to Web3 constructor

      setMaticWeb3(maticWeb3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(state.appConfig.polygonRPC),
        {
          apiKey: Global.KEYS.BICONOMY_API_1,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      (async function () {
        const parentContract = await Transactions.treasuryContract(getWeb3);
        setParentContract(parentContract);
      })();

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Active Status Enable');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  function dispatchActiveStatus(status, txHash) {
    // update global state active status
    dispatch({
      type: 'active_status',
      data: status,
    });

    // post reauthorization to database
    console.log('Posting reauthorization transaction to db');

    Fetch.POST_HISTORY(
      state.userAddress,
      Global.CONSTANTS.MAX_AMOUNT,
      'Reauthorization',
      'Confirmed',
      txHash,
      state.userStatus
    );
  }

  // Biconomy API meta-transaction. User must re-authorize treasury contract after dormant period
  async function metaTransaction() {
    try {
      console.log('Session Duration: ' + sessionDuration);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = parentContract.methods
        .enableAccount(sessionDuration)
        .encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        1,
        functionSignature,
        parentContract,
        state.userAddress,
        web3
      );

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        const activeStatus = await Transactions.getActiveStatus(
          state.userAddress,
          maticWeb3
        );
        console.log('Active status (updated): ' + activeStatus);
        dispatchActiveStatus(activeStatus, txHash);
      }
    } catch (error) {
      console.log('Metatx error: ' + error);
    }
  }

  return (
    <Aux>
      <span>
        <Button
          className="account-connected-play-button"
          onClick={() => metaTransaction()}
        >
          REAUTHORIZE
        </Button>
      </span>

      <Button
        className="account-connected-play-button-mobile"
        onClick={() => metaTransaction()}
      >
        REAUTHORIZE
      </Button>
    </Aux>
  );
}

export default ButtonEnable;
