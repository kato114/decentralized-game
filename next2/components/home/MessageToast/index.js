import { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { GlobalContext } from '@/store';
import Global from '../../Constants';
import styles from './MessageToast.module.scss';
import cn from 'classnames';

const MessageToast = props => {
  const [state, dispatch] = useContext(GlobalContext);
  const [message, setMessage] = useState('');
  const [mobile, setMobile] = useState(false);
  const [pause, setPause] = useState(false);

  let isSafari = false;
  let web3 = {};
  const [show, setShow] = useState(false);

  const detectNetwork = () => {
    window.addEventListener('resize', function (event) {
      if (window.innerWidth < 499) {
        setMobile(true);
      }
    });
    window.addEventListener('load', function () {
      if (window.ethereum) {
        // use MetaMask's provider
        web3 = new Web3(window.ethereum);

        // get permission to access accounts
        window.ethereum.enable();

        // detect Network account change
        window.ethereum.on('networkChanged', function (networkId) {
          if (parseInt(networkId) !== parseInt(Global.CONSTANTS.PARENT_NETWORK_ID)) {
            console.log('1. networkId: ', networkId);
            console.log('2. Global.CONSTANTS.PARENT_NETWORK_ID: ', Global.CONSTANTS.PARENT_NETWORK_ID);

            if (window.innerWidth < 499) {
              setMobile(true);
            }
          }

          dispatch({
            type: 'network_id',
            data: parseInt(networkId, 10)
          });
        });
      } else {
        console.warn('No web3 detected');
      }
    });
  };

  const makeTimeout = () => {
    setShow(true);
    let timer = setTimeout(() => {
      setShow(false);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  };

  useEffect(() => {
    detectNetwork();
    if (window.safari !== undefined) {
      isSafari = true;
    }

    if (window.ethereum) {
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      (async () => {
        const networkID = await web3.eth.net.getId();

        dispatch({
          type: 'network_id',
          data: networkID
        });
      })();
    }
  }, []);

  useEffect(() => {
    if (state.dgWarningMsg) {
      setMessage('Transfer pending, Please remain on this page!');
      let timer = setTimeout(() => {
        setMessage('');
        dispatch({
          type: 'set_dgWarningMsg',
          data: false
        });
      }, 1500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [state.dgWarningMsg]);

  useEffect(() => {
    if (state.toastMessage !== '') {
      setMessage(state.toastMessage);
      setShow(true);

      let timer = setTimeout(() => {
        setMessage('');
        setShow(false);
        dispatch({
          type: 'show_toastMessage',
          data: ''
        });
      }, 4500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [state.toastMessage]);

  useEffect(() => {
    if (window.innerWidth < 499) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, []);

  useEffect(() => {
    //console.log("Network ID is changed: ", state.networkID);
    //console.log("Mobile Device? ", mobile);

    if (isSafari) {
      setMessage('Please use Brave, Chrome, or Firefox to play games');
    } else if (mobile) {
      // setMessage('Please configure metamask on a desktop browser');
      setMessage('');
    } else if (!mobile && state.networkID !== Global.CONSTANTS.PARENT_NETWORK_ID) {
      if (!Global.pageSelfNetwork && window.ethereum) {
        setMessage('Please switch your Network to Ethereum Mainnet');
      }
      Global.pageSelfNetwork = false;
    } else if (!mobile && pause && !state.userInfo.tokenArray.includes(true)) {
      setMessage(`Make sure you've enabled cypto gameplay on your account page`);
    } else if (!state.activeStatus) {
      setMessage('A reauthorization signature is required after 12 dormant hours');
    } else {
      setMessage('');
    }
    makeTimeout();
    // setMessage('');
  }, [isSafari, state.networkID, state.userStatus, state.activeStatus, state.userInfo]);

  if (state.userStatus === 3) {
    return null;
  } else if (message !== '') {
    return (
      <div className={styles.container}>
        <div className={show ? cn(styles.message_bar_toast, styles.show) : cn(styles.message_bar_toast, styles.hide)}>
          <div className={styles.content}>{message}</div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default MessageToast;
