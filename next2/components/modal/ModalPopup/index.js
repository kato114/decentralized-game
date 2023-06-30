import { useEffect, useContext, useState } from 'react';
import Link from 'next/link';
import { Popup, Button, Transition } from 'semantic-ui-react';
import LoadingAnimation from 'components/lottieAnimation/animations/SpinnerUpdated';
import { GlobalContext } from '@/store';
import { useRouter } from 'next/router';
// import { useTranslation, withTranslation, Trans } from 'react-i18next';

const ModalPopup = () => {
  //const { t, i18n } = useTranslation();
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const router = useRouter();

  // define local variables
  const [copied, setCopied] = useState(false);
  const [casinoBalance, setCasinoBalance] = useState(0);
  const [binance, setBinance] = useState(false);
  const [meatamaskEnabled, setMetamaskEnabled] = useState(false);
  const [isToastShow, setIsToastShow] = useState(false);

  const [visibleStatus, setVisibleStatus] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const showStatus = () => {
      setVisibleStatus(true);
    };
    const hideStatus = () => {
      setTimeout(() => {
        setVisibleStatus(false);

        //reset
        dispatch({
          type: 'set_dgLoading',
          data: 0
        });

        dispatch({
          type: 'set_openModal',
          data: {
            resumeID: 0,
            lockID: 0
          }
        });
      }, 5000);
    };

    showStatus();
    if (state.dgLoading === 2) {
      hideStatus();
    }
  }, [state.dgLoading]);

  const onCopy = () => {
    navigator.clipboard.writeText(state.userAddress);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);

    // track 'Affiliate Link' button click event
    analytics.track('Clicked AFFILIATE LINK button');
  };

  const disconnect = () => {
    dispatch({
      type: 'set_initialState'
    });

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

    //clear localstorage
    localStorage.clear();
  };

  useEffect(() => {
    if (window.location.href.indexOf('binance') != -1) {
      setBinance(true);
    } else {
      setBinance(false);
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    const mana = Number(state.DGPrices.mana * state.userBalances[1][1]);
    const eth = Number(state.DGPrices.eth * state.userBalances[2][3]);
    const atri = Number(state.DGPrices.atri * state.userBalances[2][2]);
    const dai = Number(state.userBalances[0][1]);
    const usdt = Number(state.userBalances[2][1] * 1000000000000);
    const ice = Number(state.iceAmounts?.ICE_AVAILABLE_AMOUNT * state.DGPrices.ice, 2);
    const balance = mana + eth + atri + dai + usdt + ice;

    setCasinoBalance(balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }, [state.userBalances[1][1], state.userBalances[2][3], state.userBalances[2][2], state.userBalances[0][1], state.userBalances[2][1]]);

  return (
    <div>
      <Transition visible={open} animation="fade" duration={300}>
        <Popup
          on="click"
          position="bottom right"
          className="account-popup"
          onClose={() => {
            setOpen(false);
          }}
          onOpen={() => {
            setOpen(true);
          }}
          open={open}
          trigger={
            <div>
              {visibleStatus > 0 && state.dgLoading > 0 && (
                <div
                  style={{
                    background: state.dgLoading > 1 ? '#007d39' : '#1c70c3',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px',
                    borderRadius: '11px',
                    position: 'absolute',
                    marginTop: '-21px',
                    marginLeft: '80px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    zIndex: 9999
                  }}
                  className="account-transfer"
                  onClick={event => {
                    event.stopPropagation();

                    const pathURL = window.location.pathname;
                    if (pathURL !== '/account') {
                      router.push('/account');
                    }
                    const currentModal = state.openModal;
                    console.log('dgLoading: =>', state.dgLoading);
                    console.log('currentModal: =>', currentModal);

                    dispatch({
                      type: 'set_dgShow',
                      data: true
                    });
                  }}
                >
                  {state.dgLoading > 1 ? 'Transfer Complete' : 'Transfer Pending'}
                </div>
              )}
              <Button
                className="account-button"
                style={{
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  marginTop: 0,
                  marginRight: 0,
                  zIndex: 1
                }}
                // onClick={()=> {
                //   // setIsOpen(!isOpen);
                //   console.log(isOpen? "Closed ++++++++++++++++ " : "Opened +++++++++++++++++ ");
                //   setIsOpen(!isOpen);
                // }}
              >
                <span>
                  <svg style={{ marginRight: '6px', marginBottom: '-2px' }} width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9.88965 18.9707C14.9961 18.9707 19.1973 14.7695 19.1973 9.66309C19.1973 4.54785 14.9961 0.34668 9.88086 0.34668C4.76562 0.34668 0.573242 4.54785 0.573242 9.66309C0.573242 14.7695 4.77441 18.9707 9.88965 18.9707ZM9.88965 12.7832C7.68359 12.7832 5.96094 13.5479 4.95898 14.5322C3.72852 13.2842 2.97266 11.5615 2.97266 9.66309C2.97266 5.82227 6.04883 2.7373 9.88086 2.7373C13.7129 2.7373 16.8066 5.82227 16.8066 9.66309C16.8066 11.5615 16.0508 13.2842 14.8115 14.5322C13.8096 13.5479 12.0957 12.7832 9.88965 12.7832ZM9.88965 11.4297C11.6123 11.4385 12.9395 9.96191 12.9395 8.08984C12.9395 6.32324 11.5947 4.82031 9.88965 4.82031C8.18457 4.82031 6.82227 6.32324 6.83984 8.08984C6.83984 9.96191 8.16699 11.4209 9.88965 11.4297Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <span>
                  {/* {t('navMenu.MYACCOUNT')} */}
                  My Account
                </span>
              </Button>
            </div>
          }
        >
          <span>
            <span style={{ display: 'flex' }}>
              <Link href="/account">
                {state.userAvatarImg ? (
                  <img className={binance ? 'avatar-picture-binance' : 'avatar-picture-home'} src={state.userAvatarImg} />
                ) : (
                  <LoadingAnimation width={50} height={50} />
                )}
              </Link>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="/account">
                  {state.userInfo.name === null || state.userInfo.name === '' ? (
                    <h4 style={{ paddingLeft: '8px', marginTop: '-4px' }}>Unnamed</h4>
                  ) : (
                    <h4 style={{ paddingLeft: '8px', marginTop: '-4px' }}>{state.userInfo.name}</h4>
                  )}
                </Link>
                <span className="account-copy" style={{ display: 'flex' }} onClick={() => onCopy()}>
                  {state.userAddress ? (
                    <p className="account-address">
                      {state.userAddress.substr(0, 8) + '...' + state.userAddress.substr(-8)}
                      <svg style={{ marginLeft: '8px' }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M1.54907 15.7588L10.9241 15.7588C11.7151 15.7588 12.3303 15.1143 12.3303 14.3525L12.3303 12.9463L13.7366 12.9463C14.5276 12.9463 15.1428 12.3018 15.1428 11.54L15.1428 2.16504C15.1428 1.37402 14.5276 0.758789 13.7366 0.758789L4.36157 0.758788C3.59985 0.758788 2.95532 1.37402 2.95532 2.16504L2.95532 3.57129L1.54907 3.57129C0.787355 3.57129 0.142823 4.18652 0.142823 4.97754L0.142822 14.3525C0.142822 15.1143 0.787354 15.7588 1.54907 15.7588ZM4.53735 2.16504L13.5608 2.16504C13.678 2.16504 13.7366 2.22363 13.7366 2.34082L13.7366 11.3643C13.7366 11.4521 13.678 11.54 13.5608 11.54L12.3303 11.54L12.3303 4.97754C12.3303 4.18652 11.7151 3.57129 10.9241 3.57129L4.36157 3.57129L4.36157 2.34082C4.36157 2.22363 4.44946 2.16504 4.53735 2.16504ZM1.72485 4.97754L10.7483 4.97754C10.8655 4.97754 10.9241 5.03613 10.9241 5.15332L10.9241 14.1768C10.9241 14.2646 10.8655 14.3525 10.7483 14.3525L1.72485 14.3525C1.63696 14.3525 1.54907 14.2646 1.54907 14.1768L1.54907 5.15332C1.54907 5.03613 1.63696 4.97754 1.72485 4.97754Z"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </svg>
                    </p>
                  ) : null}
                </span>
              </span>
            </span>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/account">
                <Button className="casino-balance-button">
                  <p className="casino-balance-text"> Polygon Balance </p>
                  <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {binance ? <p className="casino-balance-text two"> ${state.userBalances[3][1].toFixed(2)} </p> : <p className="casino-balance-text two"> ${casinoBalance} </p>}
                    <svg style={{ margin: '4px 0px 0px 8px' }} width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8.21289 7.06445C8.20605 6.70215 8.08301 6.41504 7.78906 6.12793L2.6416 1.09668C2.42285 0.884766 2.16992 0.775391 1.85547 0.775391C1.22656 0.775391 0.707031 1.28809 0.707031 1.91016C0.707031 2.22461 0.836914 2.51172 1.07617 2.75098L5.5332 7.05762L1.07617 11.3779C0.836914 11.6104 0.707031 11.8975 0.707031 12.2188C0.707031 12.8408 1.22656 13.3535 1.85547 13.3535C2.16309 13.3535 2.42285 13.251 2.6416 13.0322L7.78906 8.00098C8.08301 7.71387 8.21289 7.41992 8.21289 7.06445Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </Button>
              </Link>

              <Link href="/account">
                <p className="account-dropdown-item" style={{ marginTop: '12px' }}>
                  {' '}
                  My Account{' '}
                </p>
              </Link>
              <Link href="/account/items">
                <p className="account-dropdown-item"> My Items </p>
              </Link>
              <Link href="/account/history">
                <p className="account-dropdown-item"> Gameplay History </p>
              </Link>
              <a onClick={disconnect}>
                <p className="account-dropdown-item"> Disconnect </p>
              </a>
              <Button
                className={binance ? 'buy-dg-button binance' : 'buy-dg-button'}
                href="https://app.uniswap.org/#/swap?outputCurrency=0x4b520c812e8430659fc9f12f6d0c39026c83588d"
                target="_blank"
              >
                Buy DG
              </Button>
            </span>
          </span>
        </Popup>
      </Transition>

      {copied ? (
        <div className={copied ? 'copied-toast show' : 'copied-toast'}>
          <h3 className="copied-text">Wallet address copied!</h3>
        </div>
      ) : null}
    </div>
  );
};

export default ModalPopup;
