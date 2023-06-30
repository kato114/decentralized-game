import { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import { GlobalContext } from '@/store';
import Global from '../Constants';

const MessageBar = () => {
  // get user's network, location, and active status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [message, setMessage] = useState('');
  // const [adminError, setAdminError] = useState(false);
  const [isMobile, setMobile] = useState(false);

  let isSafari = false;
  let web3 = {};
  const router = useRouter();

  // using Safari browser
  useEffect(() => {
    if (window.safari !== undefined) {
      isSafari = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window.orientation !== 'undefined') {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [isMobile]);

  // get network ID
  useEffect(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      (async () => {
        const networkID = await web3.eth.net.getId();

        dispatch({
          type: 'network_id',
          data: networkID,
        });
      })();
    }
  }, []);

  // notify admins to switch to Matic Network
  // useEffect(() => {
  //   if (router.pathname === '/admin') {
  //     if (state.networkID !== Global.CONSTANTS.MATIC_NETWORK_ID) {
  //       setAdminError(true);
  //     } else {
  //       setAdminError(false);
  //     }
  //   }
  // }, [state.networkID]);

  useEffect(() => {
    if (isSafari) {
      setMessage('Please use Brave, Chrome or Firefox to play games');
    } else if (!state.networkID && !isMobile) {
      setMessage('Please connect your wallet to play');
    } else if (!state.networkID && isMobile) {
      setMessage('Please connect your wallet on desktop to play');
    } else if (!state.userStatus && !isMobile) {
      setMessage('Please connect your wallet to play');
    } else if (!state.userStatus && isMobile) {
      setMessage('Please connect your wallet on desktop to play');
      // } else if (adminError) {
      //   setMessage(
      //     'You must switch to Matic Network to deposit and withdraw funds'
      //   );
    } else if (state.networkID !== Global.CONSTANTS.PARENT_NETWORK_ID) {
      if (!Global.pageSelfNetwork) {
        setMessage('Please switch your Network to Ethereum Mainnet');
      }
    } else if (!state.userInfo.tokenArray.includes(true)) {
      setMessage(
        `Make sure you've enabled cypto gameplay on your account page`
      );
    } else if (!state.activeStatus) {
      setMessage(
        'To ensure the security of your funds, a reauthorization signature is required after 12 dormant hours'
      );
      // } else if (!state.userInfo.tokenArray[0]) {
      //   setMessage(
      //     'You must authorize the DAI token contract on your account page to play games with DAI'
      //   );
      // } else if (!state.userInfo.tokenArray[1]) {
      //   setMessage(
      //     'You must authorize the MANA token contract on your account page to play games with MANA'
      //   );
      // } else if (!state.userInfo.tokenArray[2]) {
      //   setMessage(
      //     'You must authorize the USDT token contract on your account page to play games with USDT'
      //   );
      // } else if (!state.userInfo.tokenArray[3]) {
      //   setMessage(
      //     'You must authorize the ATRI token contract on your account page to play games with ATRI'
      //   );
    } else {
      setMessage('');
    }
  }, [
    isSafari,
    state.networkID,
    state.userStatus,
    // adminError,
    state.activeStatus,
    state.userInfo,
  ]);

  if (state.userStatus === 3) {
    return null;
  } else if (message !== '') {
    return (
      <div
        id="message-bar"
        className="mobile-message-bar"
        style={{
          fontFamily: 'Larsseit-Regular',
          color: 'white',
          textAlign: 'center',
          padding: '10px 30px 9px 30px',
          fontSize: '14px',
          letterSpacing: '0.5px',
          fontWeight: 500,
          backgroundColor: '#2085f4',
          minHeight: '38px',
        }}
      >
        {message}
      </div>
    );
  } else {
    return null;
  }
};

export default MessageBar;