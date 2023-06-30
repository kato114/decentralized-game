import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { Button } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import Fetch from 'common/Fetch';
import call from 'common/API';
import Aux from 'components/_Aux';
import { useMediaQuery } from 'hooks';
import ModalLoginTop from 'components/modal/ModalLoginTop';
import styles from './ButtonConnect.module.scss';
import Global from 'components/Constants';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import getCachedSession from 'common/GetCachedSession';
import { API_BASE_URL } from 'common/Fetch';

// determine if user has a higher status than a regular user (ex. QA, devs, admins)
async function updateVerificationStatus(arg) {
  if (arg > 0 && arg < 20 && window.location.hostname.includes(Global.CONSTANTS.VERIFY_URL)) {
    dispatch({
      type: 'user_verify',
      data: false
    });
  }
}

/* userStatus Reference:
 * 0: Wallet is neither connected nor authenticated
 * 2: Wallet is connected, but auth token is needed
 * 3: Wallet is in the process of verifying token; waiting on API response
 * 4+: Wallet is connected and authenticated
 */

const loginUser = async (dispatch, userAddress) => {
  try {
    console.log('Logging in user:', userAddress);
    localStorage.setItem(`userAddress`, userAddress);

    let jsonStatus = await Fetch.WEB_LOGIN(userAddress);

    if (!jsonStatus || !jsonStatus.status) {
      return false;
    } else {
      console.log('Dispatching user data');
      updateVerificationStatus(jsonStatus.status);
    }

    if (jsonStatus.status === -1) {
      // user is not registered yet
      jsonStatus = await Fetch.REGISTER(state.affiliateAddress, userAddress);

      if (jsonStatus.status) {
        jsonStatus.status = 4;
      } else {
        console.log('/webRegister failure: ' + jsonStatus.status);
      }
    }

    dispatch({
      type: 'update_status',
      data: jsonStatus.status
    });

    dispatch({
      type: 'user_address',
      data: userAddress
    });

    dispatch({
      type: 'set_userLoggedIn',
      data: true
    });

    return jsonStatus.status;
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const disconnectWallet = (dispatch, clearAllSessions) => {
  dispatch({
    type: 'update_status',
    data: 0
  });

  dispatch({
    type: 'user_address',
    data: ''
  });

  dispatch({
    type: 'set_userLoggedIn',
    data: false
  });

  if (clearAllSessions) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('session-0x')) {
        localStorage.removeItem(key);
      }
    });
  }
};

const storeSession = (userAddress, token) => {
  localStorage.setItem(
    `session-${userAddress}`,
    JSON.stringify({
      userAddress: userAddress,
      token: token,
      expiration: new Date(new Date().getTime() + 60 * 1000 * Global.CONSTANTS.AUTH_TOKEN_TTL)
    })
  );
};

export const assignToken = async (dispatch, web3) => {
  let loginType;
  let userAddress;

  if (window.ethereum?.selectedAddress) {
    userAddress = window.ethereum?.selectedAddress;
    loginType = 'desktop';
  } else {
    userAddress = (await web3.eth.getAccounts())[0]?.toLowerCase();
    loginType = 'mobile';
  }

  console.log('Assigning token using', loginType, 'method');

  try {
    if (userAddress && document.visibilityState === 'visible') {
      // Segment: track wallet connect event
      window.analytics.track('Connected Wallet', {
        userAddress: userAddress
      });

      console.log('Connected wallet with address:', userAddress);
      console.log('Waiting for signature...');

      const timestamp = Date.now();

      const msg = web3.utils.utf8ToHex(`Decentral Games Login\nTimestamp: ${timestamp}`);
      const signature = await web3.eth.personal.sign(msg, userAddress, null);

      const token = await call(`${API_BASE_URL}/authentication/getWebAuthToken?address=${userAddress}&signature=${signature}&timestamp=${timestamp}`, 'GET', false);

      if (!token) {
        console.log('Error retrieving token');

        dispatch({
          type: 'update_status',
          data: 0
        });
        return;
      }

      dispatch({
        type: 'update_status',
        data: 3
      });

      console.log('Assigned token:', token);
      storeSession(userAddress, token);

      await loginUser(dispatch, userAddress);
    }
  } catch (err) {
    console.log(err);

    dispatch({
      type: 'update_status',
      data: 0
    });
  }
};

const ButtonConnect = props => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const [binance, setBinance] = useState(false);
  const router = useRouter();
  let listener = null;

  useEffect(() => {
    (async () => {
      // check if user is already logged in on app launch
      let userAddress = window.ethereum ? window.ethereum.selectedAddress : undefined;
      const cachedSession = getCachedSession(userAddress);

      if (cachedSession.userAddress) {
        dispatch({
          type: 'update_status',
          data: 3
        });

        userAddress = cachedSession.userAddress;
        const userStatus = await loginUser(dispatch, userAddress);

        if (userStatus === false) {
          // token expired; user needs to reauthenticate account
          console.log('Expired token');

          dispatch({
            type: 'update_status',
            data: 2
          });
        }
      } else {
        dispatch({
          type: 'update_status',
          data: 0
        });
      }

      // add event listeners for desktop wallet
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', accounts => {
          console.log('Account changed to:', accounts[0]);

          disconnectWallet(dispatch, accounts.length === 0);
          window.location.reload();
        });

        window.ethereum.on('disconnect', () => {
          console.log('Wallet disconnected');

          disconnectWallet(dispatch, true);
          window.location.reload();
        });
      }

      if (router.pathname.includes('binance')) {
        setBinance(true);
      } else {
        setBinance(false);
      }
    })();
  }, []);

  useEffect(() => {
    listener = document.addEventListener('scroll', () => {
      const scrolled = document.scrollingElement.scrollTop;

      if (scrolled >= 10) {
        if (scrollState !== 'amir') {
          setScrollState('amir');
        }
      } else {
        if (scrollState !== 'top') {
          setScrollState('top');
        }
      }
    });

    return () => {
      document.removeEventListener('scroll', listener);
    };
  }, [scrollState]);

  useEffect(() => {
    setMetamaskEnabled(true);
    // if (window.ethereum) {
    // } else {
    //   setMetamaskEnabled(false);
    // }
  });

  const getWalletConnectProvider = () => {
    return new WalletConnectProvider({
      infuraId: '1a359efdd4d04d89b5c1b63de776d444',
      qrcodeModalOptions: {
        mobileLinks: ['rainbow', 'metamask', 'ledger', 'argent', 'trust']
      }
    });
  };

  const connectMobileWallet = async dispatch => {
    window.localStorage.removeItem('walletconnect');
    const provider = getWalletConnectProvider();
    const web3 = new Web3(provider);
    dispatch({
      type: 'web3_provider',
      data: web3
    });

    dispatch({
      type: 'network_id',
      data: 1
    });

    provider.on('accountsChanged', async accounts => {
      const address = accounts[0];

      console.log('Wallet connected:', address);

      dispatch({
        type: 'update_status',
        data: 2
      });
    });

    try {
      await provider.enable();
    } catch {
      console.log('Error connecting to wallet');
    }
  };

  const connectDesktopWallet = async dispatch => {
    await window.ethereum.request({ method: 'eth_requestAccounts' }); // open MetaMask for login
    await assignToken(dispatch, new Web3(window.ethereum));
  };

  const connectWallet = async dispatch => {
    if (window.ethereum) {
      dispatch({
        type: 'update_status',
        data: 3
      });
      connectDesktopWallet(dispatch);
    } else {
      if (state.userStatus === 2 && state.web3Provider) {
        // user is in between connecting and signing message on mobile
        assignToken(dispatch, state.web3Provider);
      } else {
        connectMobileWallet(dispatch);
      }
    }
  };

  const tablet = useMediaQuery('(max-width: 992px)');
  const isPhone = useMediaQuery('(min-width: 600px)');

  return (
    <Aux>
      {props.showAlternateButton ? (
        // eslint-disable-next-line react/react-in-jsx-scope
        <Button
          onClick={() => connectWallet()}
          style={{
            background: '#006EFF',
            height: '64px',
            borderRadius: '16px',
            width: '171px',
            color: 'white',
            fontSize: '23px',
            fontFamily: 'Larsseit-Bold',
            alignSelf: 'center',
            marginLeft: '4px'
          }}
        >
          Connect
        </Button>
      ) : metamaskEnabled ? (
        // eslint-disable-next-line react/react-in-jsx-scope
        <div className={styles.main_right_panel}>
          <Button
            color="blue"
            className={cn(
              // AMNESIA_COMMENT: amnesia_button class should be removed after we are done with amnesia
              state.isAmnesiaPage && styles.amnesia_button,
              styles.metamask_button,
              binance ? styles.binance_top : ''
            )}
            onClick={() => {
              connectWallet(dispatch);
            }}
          >
            {tablet ? 
            (state.userStatus === 2 && state.web3Provider ? 'Sign' : 'Connect') : 
            <>
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png" className={styles.metamask_icon} />
              Connect MetaMask
            </>}
          </Button>
          {isPhone && (
            <a href="https://metamask.io/faqs/" target="_blank" className={styles.get_metamask} rel="noreferrer">
              ?
            </a>
          )}
        </div>
      ) : (
        <div className={styles.main_right_panel}>
          <ModalLoginTop />

          {/* Help Button */}
          {isPhone && (
            <a href="https://metamask.io/faqs/" target="_blank" className={styles.get_metamask} rel="noreferrer">
              ?
            </a>
          )}
        </div>
      )}
    </Aux>
  );
};

export default ButtonConnect;
