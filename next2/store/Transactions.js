import { useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Fetch from '../common/Fetch';

function Transactions() {
  // dispatch users transaction history data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userAddress && state.userStatus >= 4) {
      (async function () {
        const jsonHistory = await Fetch.HISTORY_DATA(state.userAddress);
        if (jsonHistory && jsonHistory.result) {
          const dataHistory = jsonHistory.result;

          const jsonPlay = await Fetch.PLAY_DATA(state.userAddress);
          if (jsonPlay && jsonPlay.result) {
            const dataPlay = jsonPlay.result;

            const jsonPoker = await Fetch.POKER_DATA(state.userAddress);
            // const jsonPoker = await Fetch.POKER_DATA('0x44318097a96D3734518F69F0EB472Bba4e96B60E');
            const response = [dataHistory, dataPlay, jsonPoker];

            dispatch({
              type: 'update_history',
              data: response
            });
          }
        }
      })();
    }
  }, [state.userAddress, state.userStatus]);

  return null;
}

export default Transactions;
