import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Button } from 'semantic-ui-react';
import Aux from '../_Aux';
import Global from '../Constants';

function ButtonReward(props) {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [userAddress, setUserAddress] = useState('');
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (state.userStatus >= 4 && state.userAddress) {
      const userAddress = state.userAddress.toUpperCase();
      // setUserAddress(userAddress);

      const ownerAddress = Global.ADDRESSES.OWNER_WALLET_ADDRESS.toUpperCase();
      if (userAddress === ownerAddress) setDisabled(false);
    }
  }, [state.userStatus]);

  async function transactionReward() {
    console.log('Notify reward amount: start 40 minute cycle');
    setDisabled(true);

    try {
      const data = await props.stakingContractPool1.methods.notifyRewardAmount(props.rewardAmount).send({ from: state.userAddress });

      setDisabled(false);

      // confirm reward amount on smart contract
      const returnReward = data.events.RewardAdded.returnValues.reward;
      const rewardAdjusted = returnReward / Global.CONSTANTS.FACTOR;

      props.rewardData(rewardAdjusted);
    } catch (error) {
      setDisabled(false);

      console.log('Notify reward amount error: ' + error);
    }
  }

  return (
    <Aux>
      {disabled ? (
        <Button disabled id="balances-padding-correct">
          START REWARD CYCLE (Pool 1)
        </Button>
      ) : (
        <Button id="balances-padding-correct" onClick={transactionReward}>
          START REWARD CYCLE (Pool 1)
        </Button>
      )}
    </Aux>
  );
}

export default ButtonReward;
