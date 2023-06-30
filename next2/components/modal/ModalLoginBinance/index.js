import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import Global from 'components/Constants';
import styles from './ModalLoginBinance.module.scss';
import Images from '../../../common/Images';
import Fetch from '../../../common/Fetch';

const ModalLoginBinance = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [safari, setSafari] = useState(false);

  // using Safari browser
  useEffect(() => {
    if (window.safari !== undefined) {
      setSafari(true);
    }
  }, []);

  // get network ID
  useEffect(() => {
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

  let userAddress = '';

  useEffect(() => {
    if (window.ethereum) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

  async function openMetaMask() {
    // can we remove this?
  }

  async function getUserStatus() {
    console.log('Get user status: ModalLoginBinance');
  }

  return (
    <span>
      {state.networkID ? (
        <Modal
          className={styles.connect_metamask_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={<button className={cn('btn', styles.play_now_modal_binance)}>Play Now</button>}
        >
          <div style={{ margin: '-68px 0px 50px -40px' }}>
            <span className="mailchimp-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </span>
          </div>
          <div>
            <h1 className={styles.title}>Connect Your Wallet</h1>
            <button
              className={cn('btn w-100', styles.busd_button_binance)}
              onClick={() => {
                openMetaMask();
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png"
                  style={{ height: '36px', margin: '0px 24px 0px -48px' }}
                />
                Connect MetaMask
              </span>
            </button>
            <p className={styles.subtitle}>
              {' '}
              We currently only support{' '}
              <a className="modal-a" href="https://metamask.io/faqs/" target="_blank">
                {' '}
                Metamask wallets{' '}
              </a>
              . We will never have access to your private keys and we can not access your funds without your direct confirmation.{' '}
            </p>
            {/*<p className={styles.subtitle_2}>
                {' '}
                For the other casinos,{' '}
                <a className="modal-a" href="https://metamask.io"> click here </a>.
              </p>*/}
          </div>
        </Modal>
      ) : safari ? (
        <Modal
          className={styles.connect_metamask_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={<button className={cn('btn btn-primary', styles.play_now_modal)}>Play Now</button>}
        >
          <div style={{ margin: '-68px 0px 50px -40px' }}>
            <span className="mailchimp-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </span>
          </div>
          <div>
            <h1 className={styles.title}>Download Brave</h1>
            <button className={cn('btn btn-primary w-100', styles.busd_button)} href="https://brave.com/" target="_blank">
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                Brave Browser
                <Icon style={{ fontSize: '20px', padding: '3px 0px 0px 18px' }} name="external alternate" />
              </span>
            </button>
            <p className={styles.subtitle}>
              {' '}
              We currently only support{' '}
              <a className="modal-a" href="https://metamask.io" target="_blank">
                {' '}
                Metamask{' '}
              </a>{' '}
              Enabled browsers. For more instructions on how to set up Metamask,{' '}
              <a className="modal-a" href="https://metamask.io/faqs/" target="_blank">
                {' '}
                click here{' '}
              </a>
              .
            </p>
          </div>
        </Modal>
      ) : (
        <Modal
          className={styles.connect_metamask_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={<button className={cn('btn btn-primary', styles.play_now_modal_binance)}>Play Now</button>}
        >
          <div style={{ margin: '-68px 0px 50px -40px' }}>
            <span className="mailchimp-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </span>
          </div>
          <div>
            <h1 className={styles.title}>Download Metamask</h1>
            <button
              className={cn('btn btn-primary w-100', styles.busd_button)}
              onClick={() => {
                openMetaMask();
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                Set Up MetaMask
                <Icon style={{ fontSize: '20px', padding: '3px 0px 0px 18px' }} name="external alternate" />
              </span>
            </button>
            <p className={styles.subtitle}>
              {' '}
              We currently only support{' '}
              <a className="modal-a" href="https://metamask.io">
                {' '}
                Metamask wallets{' '}
              </a>
              . For more instructions on how to set up Metamask,{' '}
              <a className="modal-a" href="https://metamask.io">
                {' '}
                click here{' '}
              </a>
              .
            </p>
          </div>
        </Modal>
      )}
    </span>
  );
};

export default ModalLoginBinance;
