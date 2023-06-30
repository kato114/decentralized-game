import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';
import { Menu } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import { useMediaQuery } from 'hooks';
import ModalInfo from 'components/modal/ModalInfo';
import ModalPopup from 'components/modal/ModalPopup';
import ButtonConnect from '../../button/ButtonConnect/index.js';
import styles from './MenuTop.module.scss';
import MessageToast from 'components/home/MessageToast';
import ButtonSwitchNetwork from '../../button/ButtonSwitchNetwork/index.js';
import ReactGA from 'react-ga';
import Global from 'components/Constants';

const MenuTop = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const isTablet = useMediaQuery('(min-width: 1150px)');
  const isMobile = useMediaQuery('(min-width: 786px)');
  const isPhone = useMediaQuery('(max-width: 470px)');
  const isSquished = useMediaQuery('(min-width: 920px)');
  const [open, setOpen] = useState(false);
  const [utm, setUtm] = useState('');
  const [scrollState, setScrollState] = useState('top');
  const [ref, setRef] = useState('');
  const router = useRouter();

  let listener = null;
  let linkDocs = '';

  useEffect(() => {
    if (state.userStatus >= 4) {
      ReactGA.event({
        category: 'Logged In',
        action: 'User Logged In',
        label: 'Home Page'
      });
    }
  }, [state.userStatus]);

  useEffect(() => {
    linkDocs = document.getElementById('docs-top-menu');
  }, []);

  useEffect(() => {
    if (linkDocs) {
      analytics.trackLink(linkDocs, 'Clicked DOCS link (top menu)');
    }
  }, [linkDocs]);

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

  // close menu automatically if left open for desktop screen sizes
  useEffect(() => {
    const interval = setInterval(() => {
      const frameWidth = window.innerWidth;

      if (frameWidth > 1240) {
        setOpen(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // set utm
  useEffect(() => {
    const url = window.location.href;

    if (url.includes('?utm_source')) {
      sessionStorage.setItem('utm', url.substring(url.lastIndexOf('/') + 1));
      setUtm(sessionStorage.getItem('utm'));
    } else {
      sessionStorage.setItem('utm', '');
      setUtm(sessionStorage.getItem('utm'));
    }
  }, [utm]);

  // store affiliate address in localStorage
  function setAffiliateState() {
    dispatch({
      type: 'affiliate_address',
      data: localStorage.getItem('ref')
    });
  }

  useEffect(() => {
    const url = window.location.href;

    if (url.includes('0x')) {
      localStorage.setItem('ref', url.substring(url.lastIndexOf('/') + 1));
      setRef(localStorage.getItem('ref'));
    } else {
      localStorage.setItem('ref', '');
      setRef(localStorage.getItem('ref'));
    }

    setAffiliateState();
  }, [ref]);

  const disconnect = () => {
    dispatch({
      type: 'set_initialState'
    });

    //clear localstorage
    localStorage.clear();
  };

  // helper functions

  function DGLogo() {
    return isMobile ? (
      <Link href="/">
        <img
          className={cn(
            // AMNESIA_COMMENT: remove the amnesia logo class
            styles.menu_logo,
            state.isAmnesiaPage && styles.amnesia_logo
          )}
          alt="Decentral Games Logo"
          src={
            // AMNESIA_COMMENT: remove the amnesia logo
            state.isAmnesiaPage
              ? 'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632943973/amnesia/amnesia_dg_logo_uvqb6x.png'
              : 'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/android-chrome-512x512_rmiw1y.png'
          }
        />
      </Link>
    ) : (
      <>
        <Link href="/">
          <img
            className={cn(
              // AMNESIA_COMMENT: remove the amnesia logo class
              styles.menu_logo,
              state.isAmnesiaPage && styles.amnesia_logo
            )}
            alt="Decentral Games Logo"
            src={
              // AMNESIA_COMMENT: remove the amnesia logo
              state.isAmnesiaPage
                ? 'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632943973/amnesia/amnesia_dg_logo_uvqb6x.png'
                : 'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/android-chrome-512x512_rmiw1y.png'
            }
          />
        </Link>
        &nbsp; {isPhone ? 'DG' : 'Decentral Games'}
      </>
    );
  }

  // dropdown menu for mobile
  function dropdownMenu() {
    return (
      <div className={cn(styles.mobile_menu, open ? styles.open : '')}>
        <span className="d-flex flex-column w-100">
          {!isMobile && (
            <Link href={'/account'}>
              <Menu.Item className={styles.menu_style}>My Account</Menu.Item>
            </Link>
          )}
          {!isMobile && (
            <Link href="/ice">
              <Menu.Item className={styles.menu_style}>ICE Poker</Menu.Item>
            </Link>
          )}

          {!isMobile && (
            <Link href="/dg">
              <Menu.Item className={styles.menu_style}>Treasury</Menu.Item>
            </Link>
          )}

          {!isTablet && (
            <Link href="/events">
              <Menu.Item className={styles.menu_style}>Events</Menu.Item>
            </Link>
          )}

          {!isTablet && (
            <Link href="/blog">
              <Menu.Item className={styles.menu_style}>
                {/* {t('navMenu.NEWS_BLOG')} */}
                News & Blog
              </Menu.Item>
            </Link>
          )}

          {!isTablet && (
            <a href="https://docs.decentral.games/" id="docs-top-menu" target="_blank" rel="noreferrer">
              <Menu.Item className={styles.menu_style}>
                {/* {t('navMenu.DOCS')} */}
                Docs
              </Menu.Item>
            </a>
          )}

          {isPhone && state.userLoggedIn && (
            <Link href="/">
              <Menu.Item className={styles.menu_style} onClick={disconnect}>
                Disconnect
              </Menu.Item>
            </Link>
          )}
        </span>
      </div>
    );
  }

  // links are shown or hidden based on user's display resolution
  function shownOrHiddenItems() {
    return (
      <div className={styles.menu_items_to_hide}>
        {isMobile && (
          <section className={styles.menu_item_single}>
            <Link href={'/ice'}>
              <Menu.Item className={styles.menu_style}>ICE Poker</Menu.Item>
            </Link>
            <div className={styles.navigation_submenu} style={{ width: '480px' }}>
              <section className={styles.grid}>
                <div className={styles.grid_component}>
                  <Link href={'/ice'}>
                    <a>
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645180391/Home_Icon_fxnyp8.png" alt="dashboard" />
                      <div className={styles.submenu_description}>
                        <h1 className={styles.title}>ICE Dashboard</h1>
                        <p className={styles.sub_title}>Manage all things ICE</p>
                      </div>
                    </a>
                  </Link>
                  <Link href={'/ice/marketplace'}>
                    <a>
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645180391/image_65_hzpbvu.png" alt="marketplace" />
                      <div className={styles.submenu_description}>
                        <h1 className={styles.title}>Marketplace</h1>
                        <p className={styles.sub_title}>Explore our offerings</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div className={styles.grid_component}>
                  <Link href={'/account/items'}>
                    <a>
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645180391/image_63_rm0hba.png" alt="my items" />
                      <div className={styles.submenu_description}>
                        <h1 className={styles.title}>My Items</h1>
                        <p className={styles.sub_title}>See your wallet's items</p>
                      </div>
                    </a>
                  </Link>
                  <Link href={'/ice/start'}>
                    <a>
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645180391/image_62_nmwv3c.png" alt="my items" />
                      <div className={styles.submenu_description}>
                        <h1 className={styles.title}>Get Started</h1>
                        <p className={styles.sub_title}>For brand new users</p>
                      </div>
                    </a>
                  </Link>
                </div>
              </section>
            </div>
          </section>
        )}

        {isMobile && (
          <section className={styles.menu_item_single}>
            <Link href="/dg">
              <Menu.Item className={styles.menu_style}>DAO</Menu.Item>
            </Link>
            <div className={styles.navigation_submenu} style={{ width: '535px' }}>
              <section className={styles.grid}>
                <div className={styles.grid_component}>
                  <Link href={'/dg'}>
                    <a>
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645180391/Home_Icon_1_n50ko4.png" alt="DAO" />
                      <div className={styles.submenu_description}>
                        <h1 className={styles.title}>DAO Dashboard</h1>
                        <p className={styles.sub_title}>Overview the DAO</p>
                      </div>
                    </a>
                  </Link>
                  <Link href={'/dg/treasury'}>
                    <a>
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645180391/image_69_v6rszv.png" alt="treasury" />
                      <div className={styles.submenu_description}>
                        <h1 className={styles.title}>Treasury</h1>
                        <p className={styles.sub_title}>Explore our assets</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div className={styles.grid_component}>
                  <Link href={'/dg/governance'}>
                    <a>
                      <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645180391/image_63_1_ypath5.png" alt="staking" />
                      <div className={styles.submenu_description}>
                        <h1 className={styles.title}>Governance Staking</h1>
                        <p className={styles.sub_title}>Stake your DG for xDG</p>
                      </div>
                    </a>
                  </Link>
                  <a href="https://snapshot.org/#/decentralgames.eth" target="_blank">
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645180391/image_66_egowyq.png" alt="proposals" />
                    <div className={styles.submenu_description}>
                      <h1 className={styles.title}>Proposals</h1>
                      <p className={styles.sub_title}>Vote on proposals in snapshot</p>
                    </div>
                  </a>
                </div>
              </section>
            </div>
          </section>
        )}

        {!isTablet && (
          <svg
            width="22"
            height="12"
            viewBox="0 0 22 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <path
              d="M1.66671 0.666656C0.930328 0.666656 0.333374 1.26361 0.333374 1.99999C0.333374 2.73637 0.930328 3.33332 1.66671 3.33332H20.3334C21.0698 3.33332 21.6667 2.73637 21.6667 1.99999C21.6667 1.26361 21.0698 0.666656 20.3334 0.666656H1.66671Z"
              fill="white"
            />
            <path
              d="M1.66671 8.66666C0.930328 8.66666 0.333374 9.26361 0.333374 9.99999C0.333374 10.7364 0.930328 11.3333 1.66671 11.3333H20.3334C21.0698 11.3333 21.6667 10.7364 21.6667 9.99999C21.6667 9.26361 21.0698 8.66666 20.3334 8.66666H1.66671Z"
              fill="white"
            />
          </svg>
        )}

        {isTablet && (
          <Link href="/ice/marketplace">
            <Menu.Item className={styles.menu_style}>
              {/* {t('navMenu.SHOP')} */}
              Shop
            </Menu.Item>
          </Link>
        )}

        {isTablet && (
          <Link href="/events">
            <Menu.Item className={styles.menu_style}>
              {/* {t('navMenu.EVENTS')} */}
              Events
            </Menu.Item>
          </Link>
        )}

        {isTablet && (
          <Link href="/blog">
            <Menu.Item className={styles.menu_style}>
              {/* {t('navMenu.NEWS_BLOG')} */}
              News & Blog
            </Menu.Item>
          </Link>
        )}

        {isTablet && (
          <a href="https://docs.decentral.games/" id="docs-top-menu" className="d-flex" target="_blank" rel="noreferrer">
            <Menu.Item className={styles.menu_style}>
              {/* {t('navMenu.DOCS')} */}
              Docs
            </Menu.Item>
          </a>
        )}
      </div>
    );
  }

  // display token balances and 'MY ACCOUNT' button, or 'CONNECT METAMASK' button
  function balancesAndButtons() {
    return (
      <>
        {state.userStatus >= 4 && state.userLoggedIn && (
          <span className={styles.right_menu_items}>
            {state.networkID !== Global.CONSTANTS.PARENT_NETWORK_ID && <ButtonSwitchNetwork />}
            {state.networkID === Global.CONSTANTS.PARENT_NETWORK_ID && isSquished ? <ModalInfo /> : null}
            {!isPhone && <ModalPopup />}
          </span>
        )}
        {(state.userStatus < 3 || !state.userLoggedIn) && (
          <span className={styles.right_menu_items}>
            <ButtonConnect />
          </span>
        )}
      </>
    );
  }

  if (state.isLoading) {
    return null;
  } else {
    return (
      <span>
        <div
          className={cn(
            // AMNESIA_COMMENT: amnesia header class should be removed after we are done with amnesia
            state.isAmnesiaPage && scrollState === 'top' && !open && styles.amnesia_header,
            styles.dashboard_menu_container,
            open || scrollState !== 'top' || router.asPath !== '/' ? styles.dark : ''
          )}
          style={{ top: state.appConfig.webNotice ? '50px' : '0px' }}
        >
          <MessageToast />
          {isPhone ? (
            <Menu className={cn(styles.menu_container)}>
              {DGLogo()}
              {balancesAndButtons()}
              {shownOrHiddenItems()}
            </Menu>
          ) : (
            <Menu className={cn(styles.menu_container)}>
              {DGLogo()}
              {shownOrHiddenItems()}
              {balancesAndButtons()}
            </Menu>
          )}
          {/* <Menu className={cn(styles.menu_container)}>
            {DGLogo()}
            {shownOrHiddenItems()}
            {isPhone && balancesAndButtons()}
          </Menu> */}
          {dropdownMenu()}
        </div>
      </span>
    );
  }
};

export default MenuTop;
