import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Link from 'next/link';
import { useMediaQuery } from 'hooks';
import Home from '../../content/ContentIcePoker/Home/Home';
import GetStarted from '../../content/ContentIcePoker/GetStarted/GetStarted';
import MarketPlace from '../../content/ContentIcePoker/MarketPlace/MarketPlace';
import Leaderboard from '../../content/ContentIcePoker/Leaderboard/Leaderboard';
import IceRewards from '../../content/ContentIcePoker/IceRewards/IceRewards';
import SearchTool from '../../content/ContentIcePoker/SearchTool/SearchTool';
import DelegationDashboard from '../../content/ContentIcePoker/Delegation/DelegationDashboard';
import MyAccount from '../../content/ContentIcePoker/MyAccount/MyAccount';
import styles from './IcePoker.module.scss';

const IcePoker = props => {
  const iceState = props.iceState;
  const [state, dispatch] = useContext(GlobalContext);

  // Responsive
  const isMobile = useMediaQuery('(max-width: 1040px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(!isMobile);
  }, [isMobile]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // Sub Menu
  function submenu() {
    return (
      <>
        {!mobileOpen ? (
          <div className={styles.tablet_menu_container}>
            <div className={styles.burger_icon} onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="9" height="15" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={styles.menu_list}>
              <div>
                <Link href="/ice">
                  <div className={styles.menu_item} style={{ marginTop: '2px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0.621277 11.0642C0.621277 11.5987 1.03246 12.0613 1.69036 12.0613C2.00902 12.0613 2.29685 11.8865 2.55384 11.6809L3.72572 10.6941V20.2541C3.72572 21.7755 4.6406 22.6801 6.21338 22.6801H20.1217C21.6842 22.6801 22.6094 21.7755 22.6094 20.2541V10.6427L23.8429 11.6809C24.0896 11.8865 24.3774 12.0613 24.6961 12.0613C25.3026 12.0613 25.7652 11.6809 25.7652 11.0847C25.7652 10.7352 25.6316 10.4577 25.3643 10.2315L22.6094 7.90831V3.5292C22.6094 3.06662 22.3112 2.77879 21.8487 2.77879H20.4301C19.9778 2.77879 19.6694 3.06662 19.6694 3.5292V5.44121L14.6632 1.23685C13.7689 0.486439 12.6381 0.486439 11.7438 1.23685L1.03246 10.2315C0.754912 10.4577 0.621277 10.766 0.621277 11.0642ZM16.1538 13.9013C16.1538 13.4182 15.8454 13.1098 15.3622 13.1098H11.0448C10.5617 13.1098 10.243 13.4182 10.243 13.9013V20.6345H6.7582C6.12087 20.6345 5.77136 20.2747 5.77136 19.6271V8.97739L12.7512 3.11802C13.039 2.87131 13.368 2.87131 13.6558 3.11802L20.5534 8.91572V19.6271C20.5534 20.2747 20.2039 20.6345 19.5666 20.6345H16.1538V13.9013Z"
                        fill={iceState === 'home' ? 'white' : '#808080'}
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/ice/start">
                  <div className={styles.menu_item} style={{ marginTop: '2px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V12C1 11.4696 1.21071 10.9609 1.58579 10.5858C1.96086 10.2107 2.46957 10 3 10H6M13 8V4C13 3.20435 12.6839 2.44129 12.1213 1.87868C11.5587 1.31607 10.7956 1 10 1L6 10V21H17.28C17.7623 21.0055 18.2304 20.8364 18.5979 20.524C18.9654 20.2116 19.2077 19.7769 19.28 19.3L20.66 10.3C20.7035 10.0134 20.6842 9.72068 20.6033 9.44225C20.5225 9.16382 20.3821 8.90629 20.1919 8.68751C20.0016 8.46873 19.7661 8.29393 19.5016 8.17522C19.2371 8.0565 18.9499 7.99672 18.66 8H13Z"
                        stroke={iceState === 'getStarted' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/ice/marketplace">
                  <div className={styles.menu_item} style={{ marginTop: '2px' }}>
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_6:997)">
                        <path
                          d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                          stroke={iceState === 'marketplace' ? 'white' : '#808080'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M3 6H21" stroke={iceState === 'marketplace' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                          d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                          stroke={iceState === 'marketplace' ? 'white' : '#808080'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6:997">
                          <rect width="24" height="24" fill="white" transform="translate(0 0.234375)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </Link>

                <Link href="/ice/delegation">
                  <div className={styles.menu_item} style={{ marginTop: '2px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                        stroke={iceState === 'delegation' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M3 9H21" stroke={iceState === 'delegation' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 21V9" stroke={iceState === 'delegation' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>

                <Link href="/ice/leaderboard">
                  <div className={styles.menu_item} style={{ marginTop: '2px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.75 6H9.75V20H14.75V6ZM9.75 4C8.64543 4 7.75 4.89543 7.75 6V11.1454C7.51839 11.0516 7.26522 11 7 11H3C1.89543 11 1 11.8954 1 13V20C1 21.1046 1.89543 22 3 22H7C7.5326 22 8.01658 21.7918 8.375 21.4524C8.73342 21.7918 9.21739 22 9.75 22H14.75C15.1672 22 15.5545 21.8723 15.875 21.6538C16.1955 21.8723 16.5828 22 17 22H22C23.1046 22 24 21.1046 24 20V9C24 7.89543 23.1046 7 22 7H17C16.9153 7 16.8319 7.00526 16.75 7.01547V6C16.75 4.89543 15.8546 4 14.75 4H9.75ZM7 13H3V20H7V13ZM17 9H22V20H17V9Z"
                        fill={iceState === 'leaderboard' ? 'white' : '#808080'}
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/ice/search">
                  <div className={styles.menu_item} style={{ marginTop: '2px' }}>
                    <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11.0874 19.5847C15.5057 19.5847 19.0874 16.0029 19.0874 11.5847C19.0874 7.16638 15.5057 3.58466 11.0874 3.58466C6.66912 3.58466 3.0874 7.16638 3.0874 11.5847C3.0874 16.0029 6.66912 19.5847 11.0874 19.5847Z"
                        stroke={iceState === 'search' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M21.0873 21.5847L16.7373 17.2346"
                        stroke={iceState === 'search' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/ice/claim">
                  <div className={styles.menu_item} style={{ marginTop: '2px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                        stroke={iceState === 'iceRewards' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
                        stroke={iceState === 'iceRewards' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/account">
                  <div className={styles.menu_item} style={{ marginTop: '2px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                        stroke={iceState === 'account' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke={iceState === 'account' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.menu_container}>
            <div className={styles.menu_list}>
              <div className={styles.menu_header}>
                <span>ICE Poker</span>
                {isMobile && (
                  <div className={styles.burger_icon} onClick={() => setMobileOpen(!mobileOpen)}>
                    <svg width="9" height="15" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>

              <div>
                <Link href="/ice">
                  <div className={iceState === 'home' ? styles.menu_item_active : styles.menu_item} id={iceState === 'home' ? styles.active_padding : ''}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0.621277 11.0642C0.621277 11.5987 1.03246 12.0613 1.69036 12.0613C2.00902 12.0613 2.29685 11.8865 2.55384 11.6809L3.72572 10.6941V20.2541C3.72572 21.7755 4.6406 22.6801 6.21338 22.6801H20.1217C21.6842 22.6801 22.6094 21.7755 22.6094 20.2541V10.6427L23.8429 11.6809C24.0896 11.8865 24.3774 12.0613 24.6961 12.0613C25.3026 12.0613 25.7652 11.6809 25.7652 11.0847C25.7652 10.7352 25.6316 10.4577 25.3643 10.2315L22.6094 7.90831V3.5292C22.6094 3.06662 22.3112 2.77879 21.8487 2.77879H20.4301C19.9778 2.77879 19.6694 3.06662 19.6694 3.5292V5.44121L14.6632 1.23685C13.7689 0.486439 12.6381 0.486439 11.7438 1.23685L1.03246 10.2315C0.754912 10.4577 0.621277 10.766 0.621277 11.0642ZM16.1538 13.9013C16.1538 13.4182 15.8454 13.1098 15.3622 13.1098H11.0448C10.5617 13.1098 10.243 13.4182 10.243 13.9013V20.6345H6.7582C6.12087 20.6345 5.77136 20.2747 5.77136 19.6271V8.97739L12.7512 3.11802C13.039 2.87131 13.368 2.87131 13.6558 3.11802L20.5534 8.91572V19.6271C20.5534 20.2747 20.2039 20.6345 19.5666 20.6345H16.1538V13.9013Z"
                        fill={iceState === 'home' ? 'white' : '#808080'}
                      />
                    </svg>
                    <div className={styles.menu_title}>ICE Dashboard</div>
                  </div>
                </Link>

                <Link href="/ice/start">
                  <div className={iceState === 'getStarted' ? styles.menu_item_active : styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V12C1 11.4696 1.21071 10.9609 1.58579 10.5858C1.96086 10.2107 2.46957 10 3 10H6M13 8V4C13 3.20435 12.6839 2.44129 12.1213 1.87868C11.5587 1.31607 10.7956 1 10 1L6 10V21H17.28C17.7623 21.0055 18.2304 20.8364 18.5979 20.524C18.9654 20.2116 19.2077 19.7769 19.28 19.3L20.66 10.3C20.7035 10.0134 20.6842 9.72068 20.6033 9.44225C20.5225 9.16382 20.3821 8.90629 20.1919 8.68751C20.0016 8.46873 19.7661 8.29393 19.5016 8.17522C19.2371 8.0565 18.9499 7.99672 18.66 8H13Z"
                        stroke={iceState === 'getStarted' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <div className={styles.menu_title}>Get Started</div>
                  </div>
                </Link>

                <Link href="/ice/marketplace">
                  <div className={iceState === 'marketplace' ? styles.menu_item_active : styles.menu_item}>
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_6:997)">
                        <path
                          d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                          stroke={iceState === 'marketplace' ? 'white' : '#808080'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M3 6H21" stroke={iceState === 'marketplace' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                          d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                          stroke={iceState === 'marketplace' ? 'white' : '#808080'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6:997">
                          <rect width="24" height="24" fill="white" transform="translate(0 0.234375)" />
                        </clipPath>
                      </defs>
                    </svg>

                    <div className={styles.menu_title}>Marketplace</div>
                  </div>
                </Link>

                <Link href="/ice/delegation">
                  <div className={iceState === 'delegation' ? styles.menu_item_active : styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                        stroke={iceState === 'delegation' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M3 9H21" stroke={iceState === 'delegation' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 21V9" stroke={iceState === 'delegation' ? 'white' : '#808080'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <div className={styles.menu_title}>Delegation Stats</div>
                  </div>
                </Link>

                <Link href="/ice/leaderboard">
                  <div className={iceState === 'leaderboard' ? styles.menu_item_active : styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.75 6H9.75V20H14.75V6ZM9.75 4C8.64543 4 7.75 4.89543 7.75 6V11.1454C7.51839 11.0516 7.26522 11 7 11H3C1.89543 11 1 11.8954 1 13V20C1 21.1046 1.89543 22 3 22H7C7.5326 22 8.01658 21.7918 8.375 21.4524C8.73342 21.7918 9.21739 22 9.75 22H14.75C15.1672 22 15.5545 21.8723 15.875 21.6538C16.1955 21.8723 16.5828 22 17 22H22C23.1046 22 24 21.1046 24 20V9C24 7.89543 23.1046 7 22 7H17C16.9153 7 16.8319 7.00526 16.75 7.01547V6C16.75 4.89543 15.8546 4 14.75 4H9.75ZM7 13H3V20H7V13ZM17 9H22V20H17V9Z"
                        fill={iceState === 'leaderboard' ? 'white' : '#808080'}
                      />
                    </svg>

                    <div className={styles.menu_title}>Player Leaderboard</div>
                  </div>
                </Link>

                <Link href="/ice/search">
                  <div className={iceState === 'search' ? styles.menu_item_active : styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11.0874 19.5847C15.5057 19.5847 19.0874 16.0029 19.0874 11.5847C19.0874 7.16638 15.5057 3.58466 11.0874 3.58466C6.66912 3.58466 3.0874 7.16638 3.0874 11.5847C3.0874 16.0029 6.66912 19.5847 11.0874 19.5847Z"
                        stroke={iceState === 'search' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M21.0873 21.5847L16.7373 17.2346"
                        stroke={iceState === 'search' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <div className={styles.menu_title}>Search Tool</div>
                  </div>
                </Link>

                <Link href="/ice/claim">
                  <div className={iceState === 'iceRewards' ? styles.menu_item_active : styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                        stroke={iceState === 'iceRewards' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
                        stroke={iceState === 'iceRewards' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <div className={styles.menu_title}>ICE Rewards</div>
                  </div>
                </Link>

                <Link href="/account">
                  <div className={iceState === 'account' ? styles.menu_item_active : styles.menu_item}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                        stroke={iceState === 'account' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke={iceState === 'account' ? 'white' : '#808080'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <div className={styles.menu_title}>Account & Upgrade</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ marginTop: state.appConfig.webNotice ? '50px' : '0px' }}>
      <div className="d-flex flex-row">
        {submenu()}
        <div className={styles.main_container}>
          {iceState === 'home' ? (
            <Home />
          ) : iceState === 'getStarted' ? (
            <GetStarted />
          ) : iceState === 'marketplace' ? (
            <MarketPlace />
          ) : iceState === 'leaderboard' ? (
            <Leaderboard />
          ) : iceState === 'search' ? (
            <SearchTool />
          ) : iceState === 'iceRewards' ? (
            <IceRewards />
          ) : iceState === 'delegation' ? (
            <DelegationDashboard />
          ) : iceState === 'account' ? (
            <MyAccount />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default IcePoker;
