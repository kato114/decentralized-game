import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import { Modal, Icon, Button, Checkbox, Input } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import Global from 'components/Constants';
import styles from './ModalDepositBinance.module.scss';
import Images from '../../../common/Images';
import Fetch from '../../../common/Fetch';


const ModalDepositBinance = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [safari, setSafari] = useState(false);
  const [secondOpen, setSecondOpen] = useState(false);
  const [connectPressed, setConnectPressed] = useState(false);
  const [continuePressed, setContinuePressed] = useState(false);
  const [checkedOne, setCheckedOne] = useState(false);
  const [checkedTwo, setCheckedTwo] = useState(false);
  const [checkedThree, setCheckedThree] = useState(false);
  const [withdrawSelected, setWithdrawSelected] = useState(false);
  const [amountInput, setAmountInput] = useState('0 BUSD');


  
  function isCheckedOne() {
    if (checkedOne === true) {
      setCheckedOne(false);
    } else {
      setCheckedOne(true);
    }
  }

  function isCheckedTwo() {
    if (checkedTwo === true) {
      setCheckedTwo(false);
    } else {
      setCheckedTwo(true);
    }
  }

  function isCheckedThree() {
    if (checkedThree === true) {
      setCheckedThree(false);
    } else {
      setCheckedThree(true);
    }
  }

  useEffect(() => {
    if (!open) {
      setCheckedOne(false);
      setCheckedTwo(false);
      setCheckedThree(false);
    }
  }, [open, checkedOne, checkedTwo, checkedThree]);

  
  function handleChange(e) {
    setAmountInput(e.target.value);
  }

  function pressed() {
    setConnectPressed(true);
  };

  console.log('!!!');
  console.log(amountInput);

  
  return (
    <span>
      <Modal
        className={styles.deposit_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={
          <button className={cn('btn', styles.deposit_modal_binance)}>
            Play Now
          </button>
        }
      >
        <div style={{ margin: '-60px 0px 50px -30px' }}>
          <span className="mailchimp-close" onClick={() => setOpen(false)}>
            <Icon name="close" />
          </span>
        </div>

        <h4 className={styles.title}>  Terms of Service </h4>

        <div>
          <p className={styles.subtitle}>
            {' '}
            Please read our{' '}
            <a className="terms-a" href="https://docs.decentral.games/disclaimer"> Disclaimer</a>. To continue, you'll need to accept the following <a className="terms-a" href="https://docs.decentral.games/disclaimer"> Terms of Service </a> by checking each box.
          </p>

          <span style={{ display: 'flex' }}>
            <Checkbox
              style={{ padding: '0px 36px 0px 0px' }}
              onClick={() => isCheckedOne()}
            />
            <p className={styles.subtitle_2} style={{ paddingTop: '3px' }}> I am at least 18 years old </p>
          </span>

          <span style={{ display: 'flex', paddingTop: '16px' }}>
            <Checkbox
              style={{ padding: '8px 36px 0px 0px' }}
              onClick={() => isCheckedTwo()}
            />
            <p className={styles.subtitle_2}> I reside in a jurisdiction where online gambling is permitted </p>
          </span>

          <span style={{ display: 'flex', paddingTop: '16px', paddingBottom: '24px' }}>
            <Checkbox
              style={{ padding: '8px 36px 0px 0px' }}
              onClick={() => isCheckedThree()}
            />
            <p className={styles.subtitle_2}> I have read and accept the <a className="terms-a" href="https://docs.decentral.games/disclaimer"> Terms of Service </a></p>
          </span>

          {checkedOne && checkedTwo && checkedThree ? (
            <button
              className={cn('btn', styles.continue_binance)}
              onClick={() => {
                setOpen(false);
                setSecondOpen(true);
              }}
            >
              Continue
            </button>
          ) : (
            <button
              className={cn('btn', styles.continue_binance)}
              disabled
            >
              Continue
            </button>
          )}
        </div>
      </Modal>

      <Modal
        className={styles.busd_modal}
        onClose={() => setSecondOpen(false)}
        open={secondOpen}
        close
      >
        <div style={{ margin: '-60px 0px 50px -30px' }}>
          <span className="mailchimp-close" onClick={() => setSecondOpen(false)}>
            <Icon name="close" />
          </span>
        </div>

        <span style={{ display: 'flex' }}>
          <Button 
            className={withdrawSelected ? "binance-deposit-button grey" : "binance-deposit-button"}
            onClick={() => setWithdrawSelected(false)}
          >
            Deposit
          </Button>
          <Button 
            className={withdrawSelected ? "binance-withdraw-button grey" : "binance-withdraw-button"}
            onClick={() => setWithdrawSelected(true)}
          >
            Withdraw
          </Button>
        </span>

        {!withdrawSelected ? (
          <span>
            <h3 className={styles.title}> Send BUSD to your address </h3>

            <p className={styles.subtitle} style={{ textAlign: 'center' }}>
              (The address below is your Metamask wallet)
            </p>

            <Button className={styles.outline_button}>
              <span style={{ display: 'flex', flexDirection: 'row' }}>
                <img
                  className={styles.busd_img}
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620415238/BUSD_ytjkgd.png"
                />
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ display: 'flex' }}>
                    <h3 className={styles.deposit_address}>
                      {state.userAddress.substr(0, 8) +
                      '...' +
                      state.userAddress.substr(-12)}
                    </h3>
                  </span>
                  <p className={styles.deposit_subtitle}>
                    Your Metamask Address
                  </p>
                </span>
                <svg style={{ margin: '12px 0px 0px 34px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.25 24L17.25 24C18.5156 24 19.5 22.9687 19.5 21.75L19.5 19.5L21.75 19.5C23.0156 19.5 24 18.4688 24 17.25L24 2.25C24 0.984375 23.0156 -8.60567e-08 21.75 -1.96701e-07L6.75 -1.50804e-06C5.53125 -1.61459e-06 4.5 0.984373 4.5 2.25L4.5 4.5L2.25 4.5C1.03125 4.5 1.79353e-06 5.48437 1.68289e-06 6.75L3.71547e-07 21.75C2.65001e-07 22.9687 1.03125 24 2.25 24ZM7.03125 2.25L21.4688 2.25C21.6563 2.25 21.75 2.34375 21.75 2.53125L21.75 16.9687C21.75 17.1094 21.6563 17.25 21.4688 17.25L19.5 17.25L19.5 6.75C19.5 5.48437 18.5156 4.5 17.25 4.5L6.75 4.5L6.75 2.53125C6.75 2.34375 6.89063 2.25 7.03125 2.25ZM2.53125 6.75L16.9688 6.75C17.1563 6.75 17.25 6.84375 17.25 7.03125L17.25 21.4687C17.25 21.6094 17.1563 21.75 16.9688 21.75L2.53125 21.75C2.39063 21.75 2.25 21.6094 2.25 21.4687L2.25 7.03125C2.25 6.84375 2.39063 6.75 2.53125 6.75Z" fill="white"/>
                </svg>
              </span>
            </Button>

            <span style={{ display: 'flex', margin: '32px 24px 32px 24px' }}>
              <img
                className={styles.busd_img_2}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620415238/BUSD_ytjkgd.png"
              />
              <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ display: 'flex', flexDirection: 'column', marginTop: '-4px' }}>
                  <h3 className={styles.deposit_address}>
                    BUSD
                  </h3>
                  <p className={styles.deposit_subtitle_2}>
                    Balance
                  </p>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', margin: '-4px 0px 0px 0px' }}>
                  <h3 className={styles.deposit_address_2} style={{ textAlign: 'right' }}>
                   {state.userBalances[3][1].toFixed(2)} BUSD
                  </h3>
                  <p className={styles.deposit_subtitle_3}>
                    ${state.userBalances[3][1].toFixed(2)}
                  </p>
                </span>
              </span>
            </span>
            
            <button className={cn('btn', styles.copy_binance)}>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                Copy Wallet Address
                <svg style={{ marginLeft: '12px', marginTop: '4px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.25 24L15.75 24C17.0156 24 18 22.9687 18 21.75L18 8.25C18 6.98437 17.0156 6 15.75 6L2.25 6C1.03125 6 1.6624e-06 6.98437 1.55176e-06 8.25L3.71547e-07 21.75C2.65001e-07 22.9687 1.03125 24 2.25 24ZM15.75 4.5C17.8594 4.5 19.5 6.14062 19.5 8.25L19.5 18L21.75 18C23.0156 18 24 16.9688 24 15.75L24 2.25C24 0.984375 23.0156 -8.60567e-08 21.75 -1.96701e-07L8.25 -1.37691e-06C7.03125 -1.48345e-06 6 0.984373 6 2.25L6 4.5L15.75 4.5Z" fill="black"/>
                </svg>
              </span>
            </button>

            <h3 className={styles.continue_subtitle}>
              Continue to Casino
            </h3>
          </span>
        ) : (
          <span>
            <span style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
              <Input
                className="withdraw_input"
                placeholder="Amount"
                value={amountInput}
                onChange={handleChange}
              />
            </span>

            <p className={styles.subtitle} style={{ textAlign: 'center' }}>
              ${amountInput}
            </p>

            <button 
              className={cn('btn', styles.max_button)}
              onClick={() => {
                setAmountInput(state.userBalances[3][1].toFixed(2));
                setContinuePressed(true);
              }}
            >
              Max
            </button>

            <Input
              className={styles.outline_input}
              fluid
              placeholder="To: Paste BUSD Address Here"
            />

            <span style={{ display: 'flex', margin: '32px 24px 32px 24px' }}>
              <img
                className={styles.busd_img_2}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620415238/BUSD_ytjkgd.png"
              />
              <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ display: 'flex', flexDirection: 'column', marginTop: '-4px' }}>
                  <h3 className={styles.deposit_address}>
                    BUSD
                  </h3>
                  <p className={styles.deposit_subtitle_2}>
                    Balance
                  </p>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', margin: '-4px 0px 0px 0px' }}>
                  <h3 className={styles.deposit_address_2} style={{ textAlign: 'right' }}>
                   {state.userBalances[3][1].toFixed(2)} BUSD
                  </h3>
                  <p className={styles.deposit_subtitle_3}>
                    ${state.userBalances[3][1].toFixed(2)}
                  </p>
                </span>
              </span>
            </span>
            
            <button className={cn('btn', styles.copy_binance)} style={{ marginBottom: '42px' }}>
              Continue to Metamask
            </button>
          </span>
        )}

      </Modal>
    </span>
  );
};

export default ModalDepositBinance;