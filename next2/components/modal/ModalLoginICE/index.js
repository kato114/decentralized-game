import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import { Modal, Button } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import styles from './ModalLoginICE.module.scss';
import Fetch from '../../../common/Fetch';

const ModalLoginICE = () => {
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
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

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
    if (window.ethereum) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

  async function openMetaMask() {
    // can we remove this?
  }

  return (
    <>
      {metamaskEnabled && !state.userLoggedIn ? (
        <Modal
          className={styles.connect_metamask_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={<Button className={styles.wearable_button}>Connect Metamask</Button>}
        >
          <div
            style={{
              marginTop: '-72px',
              marginBottom: '58px',
              marginLeft: '-38px'
            }}
          >
            <span className={styles.button_close} onClick={() => setOpen(false)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
                  fill="white"
                />
              </svg>
            </span>
          </div>

          <div className={styles.connect_modal}>
            <h1 className={styles.title}>Connect Your Wallet</h1>
            <button
              className={cn('btn btn-primary w-100', styles.busd_button)}
              onClick={() => {
                openMetaMask();
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png"
                  style={{ height: '36px', margin: '6px 24px 0px -48px' }}
                />
                Connect MetaMask
              </span>
            </button>
            <a href="https://metamask.io/faqs/" target="_blank">
              <button className={styles.need_help}>Need Help?</button>
            </a>
          </div>
        </Modal>
      ) : safari ? (
        <Modal
          className={styles.connect_metamask_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={<Button className={styles.wearable_button}>Connect Metamask</Button>}
        >
          <div
            style={{
              marginTop: '-72px',
              marginBottom: '58px',
              marginLeft: '-38px'
            }}
          >
            <span className={styles.button_close} onClick={() => setOpen(false)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
                  fill="white"
                />
              </svg>
            </span>
          </div>
          <div>
            <h1 className={styles.title}>Download Brave</h1>
            <Button className={styles.busd_button} href="https://brave.com/" target="_blank">
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                Brave Browser
                <svg style={{ margin: '15px 0px 0px 18px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.6152 13.2617V2.50879C17.6152 1.50977 16.9385 0.822266 15.9287 0.822266H5.16504C4.21973 0.822266 3.51074 1.54199 3.51074 2.40137C3.51074 3.26074 4.24121 3.92676 5.1543 3.92676H9.21484L12.5342 3.80859L10.6758 5.46289L1.28711 14.8623C0.932617 15.2168 0.739258 15.6357 0.739258 16.0654C0.739258 16.9033 1.52344 17.6982 2.37207 17.6982C2.80176 17.6982 3.20996 17.5049 3.5752 17.1504L12.9746 7.76172L14.6396 5.90332L14.5 9.10449V13.2725C14.5 14.1963 15.166 14.916 16.0254 14.916C16.8955 14.916 17.6152 14.1855 17.6152 13.2617Z"
                    fill="white"
                  />
                </svg>
              </span>
            </Button>
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
          trigger={<Button className={styles.wearable_button}>Connect Metamask</Button>}
        >
          <div
            style={{
              marginTop: '-72px',
              marginBottom: '58px',
              marginLeft: '-38px'
            }}
          >
            <span className={styles.button_close} onClick={() => setOpen(false)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
                  fill="white"
                />
              </svg>
            </span>
          </div>
          <div>
            <h1 className={styles.title}>Download Metamask</h1>
            <a href="https://metamask.io/faqs/" target="_blank">
              <Button className={styles.busd_button}>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  Set Up Metamask
                  <svg style={{ margin: '15px 0px 0px 18px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.6152 13.2617V2.50879C17.6152 1.50977 16.9385 0.822266 15.9287 0.822266H5.16504C4.21973 0.822266 3.51074 1.54199 3.51074 2.40137C3.51074 3.26074 4.24121 3.92676 5.1543 3.92676H9.21484L12.5342 3.80859L10.6758 5.46289L1.28711 14.8623C0.932617 15.2168 0.739258 15.6357 0.739258 16.0654C0.739258 16.9033 1.52344 17.6982 2.37207 17.6982C2.80176 17.6982 3.20996 17.5049 3.5752 17.1504L12.9746 7.76172L14.6396 5.90332L14.5 9.10449V13.2725C14.5 14.1963 15.166 14.916 16.0254 14.916C16.8955 14.916 17.6152 14.1855 17.6152 13.2617Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </Button>
            </a>
            <p className={styles.subtitle}>
              {' '}
              We currently only support{' '}
              <a className="modal-a" href="https://metamask.io">
                Metamask wallets
              </a>
              . For more instructions on how to set up Metamask,{' '}
              <a className="modal-a" href="https://metamask.io">
                click here
              </a>
              .
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ModalLoginICE;
