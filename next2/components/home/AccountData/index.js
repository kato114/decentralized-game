import { useState, useEffect, useContext } from 'react';
import cn from 'classnames';
import { Button, Popup } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import Link from 'next/link';
import Spinner from 'components/Spinner';
import LoadingAnimation from 'components/lottieAnimation/animations/SpinnerUpdated';
import ContentAccount from '@/components/content/ContentAccount/ContentAccount';
import Aux from 'components/_Aux';
import styles from './AccountData.module.scss';
import AccountTooltip from 'components/tooltips/AccountTooltip';
import AgeMultiplierTooltip from 'components/tooltips/AgeMultiplierTooltip';
import Fetch from '../../../common/Fetch';
import { formatPrice } from '@/common/utils';

const AccountData = props => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const dataHistory = state.transactions[0];
  const dataPlay = state.transactions[1];

  // define local variables
  const [dataPage, setDataPage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [utm, setUtm] = useState('');
  const [accountAgeMultiplier, setAccountAgeMultiplier] = useState(0);

  // const [DGMined, setDGMined] = useState(''); ********** this needs to be updated for new dgPointer function **********
  const [copied, setCopied] = useState(false);
  const [totalICE, setTotalICE] = useState(0);
  const [chipsWon, setChipsWon] = useState(-1);

  const dataType = props.dataType;
  const maximumCount = 100; // ***** we should limit the data being returned from the server to 100 rows *****

  useEffect(() => {
    if (state.transactions[0].length && state.transactions[1]) {
      setIsLoading(false);
    }
  }, [state.transactions]);

  useEffect(() => {
    (async () => {
      setTotalICE(formatPrice(Number(state.iceTotalAmount.totalUnclaimedAmount) + Number(state.iceTotalAmount.totalClaimedAmount), 0));

      try {
        let response = await Fetch.GAMEPLAY_REPORTS(state.userAddress, 'all');
        let chipsWon = 0;
        let checkedIn = 0;

        for (let i = 0; i < response.length; i++) {
          if (response[i] && Object.keys(response[i].gameplay).length > 0 && Object.getPrototypeOf(response[i]) === Object.prototype) {
            chipsWon += response[i].gameplay.chipsWon ? response[i].gameplay.chipsWon : 0;
            checkedIn += 1;
          }
        }
        setChipsWon(checkedIn === 0 ? -1 : chipsWon);
      } catch (error) {
        console.log('Error with total ICE amounts: ' + error);
      }
    })();
  }, [state.userLoggedIn, state.iceTotalAmount.totalUnclaimedAmount, state.iceTotalAmount.totalClaimedAmount]);

  useEffect(() => {
    if (!isLoading) {
      let result = {};
      if (dataType === 'history') {
        result = dataHistory.slice(0, maximumCount);
      } else if (dataType === 'play') {
        result = dataPlay.slice(0, maximumCount);
      }

      setDataPage(result);
    }
  }, [isLoading]);

  useEffect(() => {
    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);

  // helper functions
  const onCopy = () => {
    navigator.clipboard.writeText(state.userAddress);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);

    // track 'Affiliate Link' button click event
    // analytics.track('Clicked AFFILIATE LINK button');
  };

  function topLinks() {
    return (
      <Aux>
        <div className={cn('row', styles.player_card)}>
          <div className={cn('col-lg-4', 'col-md-4', 'col-sm-12', 'col-xs-12', styles.player_avatar)} style={{ display: 'flex', justifyContent: 'center' }}>
            <span className={styles.avatar_image}>
              {state.userAvatarImg ? (
                <>
                  <img
                    className="avatar-picture main"
                    src={state.userAvatarImg}
                    style={{
                      backgroundColor: '#3B3B3B',
                      width: '180px',
                      display: 'flex'
                    }}
                  />
                  <a href="https://play.decentraland.org/?OPEN_AVATAR_EDITOR&" target="_blank" className="avatar-edit-circle">
                    <svg style={{ margin: '12px' }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M15.2656 3.85938L13.7422 5.38281L10.6172 2.25781L12.1406 0.734375C12.2969 0.578125 12.4922 0.5 12.7266 0.5C12.9609 0.5 13.1562 0.578125 13.3125 0.734375L15.2656 2.6875C15.4219 2.84375 15.5 3.03906 15.5 3.27344C15.5 3.50781 15.4219 3.70312 15.2656 3.85938ZM0.5 12.375L9.71875 3.15625L12.8438 6.28125L3.625 15.5H0.5V12.375Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </>
              ) : (
                <LoadingAnimation width={40} height={40} />
              )}
            </span>
          </div>

          <div
            className={cn('col-lg-8', 'col-md-8', 'col-sm-12', 'col-xs-12', styles.player_name)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              marginLeft: 30,
              paddingLeft: '0px',
              paddingRight: '0px'
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/account">
                <h4 style={{ paddingLeft: '8px', marginTop: '-4px' }}>{state.userInfo.name === null || state.userInfo.name === ' ' ? 'Unnamed' : state.userInfo.name}</h4>
              </Link>
              <span className="account-copy" style={{ display: 'flex', marginTop: 5 }} onClick={() => onCopy()}>
                {state.userAddress ? (
                  <p className="account-address">
                    {state.userAddress.substr(0, 4) + '...' + state.userAddress.substr(-4)}
                    <svg style={{ marginLeft: '8px' }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1.54907 15.7588L10.9241 15.7588C11.7151 15.7588 12.3303 15.1143 12.3303 14.3525L12.3303 12.9463L13.7366 12.9463C14.5276 12.9463 15.1428 12.3018 15.1428 11.54L15.1428 2.16504C15.1428 1.37402 14.5276 0.758789 13.7366 0.758789L4.36157 0.758788C3.59985 0.758788 2.95532 1.37402 2.95532 2.16504L2.95532 3.57129L1.54907 3.57129C0.787355 3.57129 0.142823 4.18652 0.142823 4.97754L0.142822 14.3525C0.142822 15.1143 0.787354 15.7588 1.54907 15.7588ZM4.53735 2.16504L13.5608 2.16504C13.678 2.16504 13.7366 2.22363 13.7366 2.34082L13.7366 11.3643C13.7366 11.4521 13.678 11.54 13.5608 11.54L12.3303 11.54L12.3303 4.97754C12.3303 4.18652 11.7151 3.57129 10.9241 3.57129L4.36157 3.57129L4.36157 2.34082C4.36157 2.22363 4.44946 2.16504 4.53735 2.16504ZM1.72485 4.97754L10.7483 4.97754C10.8655 4.97754 10.9241 5.03613 10.9241 5.15332L10.9241 14.1768C10.9241 14.2646 10.8655 14.3525 10.7483 14.3525L1.72485 14.3525C1.63696 14.3525 1.54907 14.2646 1.54907 14.1768L1.54907 5.15332C1.54907 5.03613 1.63696 4.97754 1.72485 4.97754Z"
                        fill="white"
                        // fillOpacity="0.5"
                      />
                    </svg>
                  </p>
                ) : null}
              </span>
            </span>
            {state.userIsPremium && (
              <Button className={styles.premium_badge}>
                PREMIUM <AccountTooltip data="You’ve unlocked premium features by meeting the xDG requirement! For more info, head to your ICE Dashboard." />
              </Button>
            )}

            {/* {!state.iceWearableItemsLoading && state.iceWearableItems && state.iceWearableItems.length === 0 && (
              <div className={styles.age_multiplier_container}>
                <div className={styles.header}>
                  <p>
                    Account Age Multiplier
                    <AgeMultiplierTooltip />
                  </p>
                </div>
                <div className={styles.content}>
                  <div className={styles.box} style={{ marginLeft: `${accountAgeMultiplier * 10}px` }}>
                    {(0.55 + accountAgeMultiplier * 0.05).toFixed(2)}x
                  </div>
                </div>
                <div className={styles.bottom}>1 2 3 4 5 6 7 8 9 10</div>
              </div>
            )} */}

            <div style={{ display: 'flex' }}>
              <div className={styles.token_container}>
                <div className={styles.tokenImgDiv}>
                  <img className={styles.token_background} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/image_24_geei7u.png" />
                  <img className={styles.token_ice_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" />
                </div>
                <div className={styles.tokenBalance}>
                  <p className={styles.title}>
                    {' '}
                    ICE Earned <AccountTooltip data="This is your total ICE Earned through gameplay." />
                  </p>
                  <p className={styles.amount}> {totalICE} </p>
                </div>
              </div>
              <div className={styles.token_container}>
                <div className={styles.tokenImgDiv}>
                  <img className={styles.token_xp_background} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/image_24_geei7u.png" />
                  <img className={styles.token_xp_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_XP_ICN_f9w2se.svg" />
                </div>
                <div className={styles.tokenBalance}>
                  <p className={styles.title}>
                    {' '}
                    XP Earned <AccountTooltip data="This is your total XP Earned through gameplay." />
                  </p>
                  <p className={styles.amount}> {state.userInfo.totalXP >= 0 ? state.userInfo.totalXP.toLocaleString() : null} </p>
                </div>
              </div>
              <div className={styles.token_container}>
                <div className={styles.tokenImgDiv}>
                  <img className={styles.token_xdg_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1637260602/grayLogo_ojx2hi.png" alt="xDG" />
                </div>
                <div className={styles.tokenBalance}>
                  <p className={styles.title}>
                    {' '}
                    xDG Held <AccountTooltip data="This is your total xDG held. By holding enough xDG, you get access to premium tools." />
                  </p>
                  <p className={styles.amount}>
                    {' '}
                    {formatPrice(Math.floor(parseFloat(state.stakingBalances?.BALANCE_USER_GOVERNANCE) + parseFloat(state.DGBalances?.BALANCE_CHILD_TOKEN_XDG)), 0)}{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn('account-other-tabs', styles.account_other_tabs)} id="account-mobile-tabs" style={{ marginTop: '0px' }}>
          <div className="ml-0">
            <span className="account-other-p d-flex justify-content-center">
              {dataType === 'ice' ? (
                <span className={cn('account-hover', 'active', styles.account_hover)}>&nbsp;&nbsp;ICE&nbsp;&nbsp;</span>
              ) : state.dgLoading ? (
                <span
                  className={cn('account-hover', styles.account_hover)}
                  onClick={() => {
                    dispatch({
                      type: 'set_dgWarningMsg',
                      data: true
                    });
                  }}
                >
                  &nbsp;&nbsp;ICE&nbsp;&nbsp;
                </span>
              ) : (
                <Link href="/account">
                  <span className={cn('account-hover', styles.account_hover)}>&nbsp;&nbsp;ICE&nbsp;&nbsp;</span>
                </Link>
              )}

              {dataType === 'items' ? (
                <span className={cn('account-hover', 'active', styles.account_hover)}>My Items</span>
              ) : state.dgLoading ? (
                <span
                  className={cn('account-hover', styles.account_hover)}
                  onClick={() => {
                    dispatch({
                      type: 'set_dgWarningMsg',
                      data: true
                    });
                  }}
                >
                  My Items
                </span>
              ) : (
                <Link href="/account/items">
                  <span className={cn('account-hover', styles.account_hover)}>My Items</span>
                </Link>
              )}

              {dataType === 'history' ? (
                <span className={cn('account-hover', 'active', styles.account_hover)}>History</span>
              ) : state.dgLoading ? (
                <span
                  className={cn('account-hover', styles.account_hover)}
                  onClick={() => {
                    dispatch({
                      type: 'set_dgWarningMsg',
                      data: true
                    });
                  }}
                >
                  History
                </span>
              ) : (
                <Link href="/account/history">
                  <span className={cn('account-hover', styles.account_hover)}>History</span>
                </Link>
              )}
            </span>
          </div>
        </div>
      </Aux>
    );
  }

  return (
    <div className={`main-container ${state.appConfig.webNotice ? 'web-notice-contained' : null}`}>
      {isLoading ? (
        <Spinner background={1} />
      ) : (
        <Aux>
          <div className="page-container">
            <div className="account-other-inner-container">
              {topLinks()}

              <div id="tx-box-history-2">
                <ContentAccount content={dataType} dataPage={dataPage} />
              </div>
            </div>
          </div>

          {copied ? (
            <div className={copied ? 'copied-toast show' : 'copied-toast'}>
              <h3 className="copied-text">Wallet address copied!</h3>
            </div>
          ) : null}
        </Aux>
      )}
    </div>
  );
};

export default AccountData;
