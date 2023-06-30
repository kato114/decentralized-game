import { useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Fetch from '../common/Fetch';

function UsersList() {
  // dispatch users status list to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus === 28) {
      (async () => {
        const json = await Fetch.USERS_LIST(state.userAddress);

        dispatch({
          type: 'users_list',
          data: json
        });
      })();
    }
  }, [state.userStatus]);

  return null;
}

export default UsersList;
