import { useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Fetch from '../common/Fetch';
import Global from '../components/Constants';

function UserStatus() {
  // dispatch user's status value to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';

  useEffect(() => {
    if (state.userLoggedIn) {
      if (window.ethereum) {
        userAddress = window.ethereum?.selectedAddress;
        localStorage.setItem(`userAddress`, userAddress);

        if (userAddress) {
          // set user status to 3 to denote fetching user status, and dispatch the user address
          dispatch({
            type: 'update_status',
            data: 3
          });

          dispatch({
            type: 'user_address',
            data: userAddress
          });

          // fetch user status
          async function fetchData() {
            const response = await getUserStatus();

            // if the response is truthy set the user's respective status, else set status back to 0
            // (/websiteLogin API call will return error if new wallet address)
            if (response) {
              dispatch({
                type: 'update_status',
                data: response
              });
            } else {
              dispatch({
                type: 'update_status',
                data: 0
              });
            }
          }

          fetchData();
        }
      }
    }
  }, [state.userLoggedIn]);

  async function upateVerified(arg) {
    if (arg > 0 && arg < 20 && window.location.hostname.includes(Global.CONSTANTS.VERIFY_URL)) {
      dispatch({
        type: 'user_verify',
        data: false
      });
    }
  }

  async function getUserStatus() {
    console.log('Get user status: UserStatus');

    try {
      const jsonStatus = await Fetch.USER_STATUS(userAddress, '');
      await upateVerified(jsonStatus.status);

      if (jsonStatus?.status == undefined || jsonStatus.status == -1) return false;

      return jsonStatus.status;
    } catch (e) {
      console.log('Unregistered wallet: UserStatus');

      return false;
    }
  }

  return null;
}

export default UserStatus;
