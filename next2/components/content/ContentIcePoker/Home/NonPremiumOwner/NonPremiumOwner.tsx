import React, { ReactElement, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '@/store';
import Fetch from '@/common/Fetch';
import cn from 'classnames';
import { Button } from 'semantic-ui-react';
import LoadingAnimation from 'components/lottieAnimation/animations/LoadingAnimation';
import Spinner from 'components/lottieAnimation/animations/SpinnerUpdated';
import styles from './NonPremiumOwner.module.scss';
import { formatPrice } from '@/common/utils';

enum TimePeriods {
  Weekly = 'week',
  Monthly = 'month',
  All = 'all'
}

interface PlayerStats {
  chipsWon: number;
  leaderboardPercentile: number;
  checkedIn: number;
  numChallengesCompleted: number;
}

export interface NonPremiumProps {
  content?: any;
}

const IceDashboardNonPremium = (): ReactElement => {
  // dispatch user's ICE amounts to the Context API store
  const [state, dispatch] = useContext<any>(GlobalContext);
  const router = useRouter();

  // define local variables
  const [isLoadingPlayerStats, setIsLoadingPlayerStats] = useState(true);
  const [gameReports, setGameReports] = useState([]);
  const initialPlayerStats: PlayerStats = {
    chipsWon: 0,
    leaderboardPercentile: 0,
    checkedIn: 0,
    numChallengesCompleted: 0
  };
  const [playerStats, setPlayerStats] = useState(initialPlayerStats);
  const [time, setTime] = useState(TimePeriods.Weekly);
  const [isClaimClicked, setIsClaimClicked] = useState(false);
  const [totalIce, setTotalIce] = useState(0);
  const [totalUnclaimedAmount, setTotalUnclaimedAmount] = useState(0);
  const [isXdgClicked, setIsXdgClicked] = useState(false);
  const { xDG: xDgPrice } = state.DGPrices;

  async function getGameplay(): Promise<void> {
    setIsLoadingPlayerStats(true);

    if (state.userLoggedIn) {
      // Get Gameplay Reports from the API
      const response = await Fetch.GAMEPLAY_REPORTS(state.userAddress, time);

      const playerStats: PlayerStats = {
        chipsWon: 0,
        leaderboardPercentile: 0,
        checkedIn: 0,
        numChallengesCompleted: 0
      };

      for (let i = 0; i < response.length; i++) {
        if (response[i] && Object.keys(response[i].gameplay).length > 0 && Object.getPrototypeOf(response[i]) === Object.prototype) {
          playerStats.chipsWon += response[i].gameplay.chipsWon ? response[i].gameplay.chipsWon : 0;
          playerStats.leaderboardPercentile += response[i].gameplay.leaderboardPercentile;
          playerStats.checkedIn += 1;
          playerStats.numChallengesCompleted += response[i].gameplay.numChallengesCompleted;
        }
      }

      setGameReports(response);
      setPlayerStats(playerStats);
    }

    setIsLoadingPlayerStats(false);
  }

  useEffect(() => {
    getGameplay();
  }, [time]);

  async function updateAmountForClaim(): Promise<void> {
    // update user status in database
    const { totalUnclaimedAmount: amount2 } = await Fetch.XDG_CLAIM_REWARDS_AMOUNT(state.userAddress);

    setTotalUnclaimedAmount(amount2);
  }

  useEffect(() => {
    (async () => {
      if (state.userAddress) {
        await updateAmountForClaim();
      }
    })();
  }, [totalIce, state.userAddress]);

  // after claiming rewards this code gets executed
  useEffect(() => {
    setIsClaimClicked(false);
  }, [state.iceAmounts]);

  useEffect(() => {
    (async (): Promise<void> => {
      setTotalIce(state.iceTotalAmount.totalUnclaimedAmount);
    })();
  }, [state.iceTotalAmount.totalUnclaimedAmount]);

  async function claimTokens(): Promise<void> {
    setIsClaimClicked(true);

    // Show Toast Message
    let msg = '';

    try {
      const json = await Fetch.CLAIM_REWARDS();

      if (json.status) {
        // update global state ice amounts
        const doesRefresh = !state.refreshICEAmounts;

        dispatch({
          type: 'refresh_ice_amounts',
          data: doesRefresh
        });

        // Show Toast Message
        msg = 'ICE claimed successfully!';
        setTotalIce(0);
      } else {
        msg = 'ICE claimed failed!';
        setIsClaimClicked(false);
      }

      dispatch({
        type: 'show_toastMessage',
        data: msg
      });
    } catch (error) {
      msg = 'API request timeout error';
      dispatch({
        type: 'show_toastMessage',
        data: msg
      });

      setIsClaimClicked(false);
    }
  }

  async function claimRewards(): Promise<void> {
    let msg = '';

    setIsXdgClicked(true);

    try {
      const json = await Fetch.XDG_CLAIM_REWARDS();

      if (json.status) {
        msg = 'xDG claimed successful!';
      } else {
        msg = 'xDG claimed failed!';
      }

      setIsXdgClicked(false);
    } catch (error) {
      msg = 'API request timeout error';
      setIsXdgClicked(false);
    }

    dispatch({
      type: 'show_toastMessage',
      data: msg
    });

    await updateAmountForClaim();
  }

  return (
    <section className={cn('row', styles.main_wrapper)}>
      <div className={cn('col-xl-8', styles.overview_container)}>
        <div className={styles.container_left}>
          <p className={styles.welcome_text}>Welcome Guild Owner!</p>
          <h1 className={styles.dashboard_text}>Your ICE Dashboard</h1>
        </div>

        <div className={styles.blue_container}>
          <div className={styles.blue_text}>
            <p className={styles.blue_header}>
              Stake Your DG. <br />
              Unlock Everything.
            </p>
            <p className={styles.blue_lower}>
              Hold 1K xDG per wearable to unlock
              <br /> premium guild tools and Guild League.
            </p>
            <Button
              className={styles.blue_button}
              onClick={() => {
                router.push('/premium');
              }}
            >
              Unlock Premium Now
            </Button>
          </div>
          <img className={styles.blue_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645819661/image_42_dfmreb.png" />
        </div>

        <div className={styles.second_container}>
          <div className={cn(styles.box, styles.delegation_dashboard)}>
            <h1 className={styles.title}>Delegation Dashboard</h1>
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645784052/image_10_aztbms.png" alt="dashboard" />
            <p>Unlock the full dashboard with delegate histories and so much more.</p>
            <Button
              className={styles.blue_button}
              onClick={() => {
                router.push('/premium');
              }}
            >
              Unlock Dashboard
            </Button>
          </div>
          <div className={cn(styles.box, styles.guild_league)}>
            <h1 className={styles.title}>Guild League</h1>
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645784053/PNG_1_wu03tm.png" alt="guild" />
            <p>Get access to guild-on-guild leagues that pay out $10k+/mo. Learn more.</p>
            <Button className={styles.blue_button} disabled={true}>
              Coming Soon
            </Button>
          </div>
        </div>

        <div className={styles.stats_container}>
          <h1 className={styles.title}>My Player Stats</h1>

          {/* Filter by Timeline */}
          <div className={cn(styles.filter_pills, styles.timeline)}>
            <div
              className={time === TimePeriods.Weekly ? styles.active : null}
              onClick={() => {
                setTime(TimePeriods.Weekly);
              }}
            >
              Weekly
            </div>
            <div
              className={time === TimePeriods.Monthly ? styles.active : null}
              onClick={() => {
                setTime(TimePeriods.Monthly);
              }}
            >
              Monthly
            </div>
            <div
              className={time === TimePeriods.All ? styles.active : null}
              onClick={() => {
                setTime(TimePeriods.All);
              }}
            >
              All Time
            </div>
          </div>

          <div className={styles.stats_info}>
            <div className={styles.stats_box}>
              <div className={styles.stats_img}>
                <img className={styles.background} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/image_24_geei7u.png" />
                <img className={styles.leaderboard_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645784052/image_47_sc7pba.png" />
              </div>
              <div className={styles.stats_balance}>
                <p className={styles.title}>Average Leaderboard</p>
                <p className={styles.amount}>
                  {isLoadingPlayerStats ? (
                    <Spinner width={24} height={24} />
                  ) : playerStats.checkedIn === 0 ? (
                    <abbr>--</abbr>
                  ) : playerStats.leaderboardPercentile / playerStats.checkedIn + 5 <= 50 ? (
                    `Top ${Math.round(playerStats.leaderboardPercentile / playerStats.checkedIn) + 5}%`
                  ) : (
                    `Bottom ${100 - Math.round(playerStats.leaderboardPercentile / playerStats.checkedIn)}%`
                  )}
                </p>
              </div>
            </div>
            <div className={styles.stats_box}>
              <div className={styles.stats_img}>
                <img className={styles.background} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/image_24_geei7u.png" />
                <img className={styles.chips_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645037931/Chip_n5cvkl.png" />
              </div>
              <div className={styles.stats_balance}>
                <p className={styles.title}>Net Chips</p>
                <p className={styles.amount}>{isLoadingPlayerStats ? <Spinner width={24} height={24} /> : playerStats.checkedIn === 0 ? <abbr>--</abbr> : playerStats.chipsWon}</p>
              </div>
            </div>
            <div className={styles.stats_box}>
              <div className={styles.stats_img}>
                <img className={styles.background} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/image_24_geei7u.png" />
                <img className={styles.challenges_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645784052/check_xtxnzv.png" />
              </div>
              <div className={styles.stats_balance}>
                <p className={styles.title}>Finished Challenges</p>
                <p className={styles.amount}>
                  {isLoadingPlayerStats ? (
                    <Spinner width={24} height={24} />
                  ) : playerStats.checkedIn === 0 ? (
                    <abbr>--</abbr>
                  ) : (
                    <>
                      {playerStats.numChallengesCompleted} of {3 * gameReports.length}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cn('col-xl-4', styles.sub_profile)}>
        <div className={cn(styles.lower)}>
          <img className={styles.lower_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1650574409/ICE_Poker_Logo_cbkbed.png" alt="ice" />
          <Button
            className={styles.lower_button}
            onClick={() => {
              window.open('https://api.decentral.games/ice/play', '_blank');
            }}
          >
            Play Now
          </Button>
        </div>

        <div className={styles.lower}>
          <p className={styles.lower_header}>Claim ICE Rewards</p>
          <div className={styles.lower_ice_amount}>
            {totalIce}
            <svg width="35" height="31" viewBox="0 0 35 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_222_8512)" filter="url(#filter0_d_222_8512)">
                <g clipPath="url(#clip1_222_8512)">
                  <path d="M10.3749 12.6672L17.0674 30.3191H17.8631L24.5555 12.6672H10.3749Z" fill="#7ECAFF" />
                  <path
                    d="M16.0121 29.7306C16.2915 30.0455 16.6676 30.2415 17.0675 30.3192L10.375 12.6674L1.0208 9.72083C1.0634 10.037 0.0523894 8.54114 16.0121 29.7306Z"
                    fill="#B0E6FF"
                  />
                  <path
                    d="M4.33195 10.7638L1.0208 9.72083C1.0634 10.037 0.0524532 8.54108 16.0121 29.7305C16.219 29.9637 16.479 30.1313 16.7624 30.2343L4.33195 10.7638Z"
                    fill="#70C0E2"
                  />
                  <path d="M6.54779 2.44439L10.375 12.6674L17.4653 4.57862L6.67715 2.38013C6.63029 2.40049 6.58691 2.42209 6.54779 2.44439Z" fill="#B0E6FF" />
                  <path
                    d="M24.5556 12.6674L17.8632 30.3192C18.2631 30.2415 18.6391 30.0455 18.9186 29.7306C23.069 24.2332 33.9589 9.8281 33.9918 9.69507L24.5556 12.6674Z"
                    fill="#B0E6FF"
                  />
                  <path d="M24.5556 12.6673L28.3816 2.44761C28.3365 2.42196 28.2916 2.40024 28.2479 2.38123L17.4653 4.57856L24.5556 12.6673Z" fill="#B0E6FF" />
                  <path d="M10.3749 12.6673H24.5555L17.4652 4.57861L10.3749 12.6673Z" fill="#5EBFF5" />
                  <path
                    d="M6.54773 2.44434C6.29533 2.58787 6.2564 2.67276 5.85963 3.18155C0.694292 9.80533 0.964479 9.30453 1.02075 9.72077L10.375 12.6672L6.54773 2.44434Z"
                    fill="#7ECAFF"
                  />
                  <path
                    d="M4.33182 10.7639L6.6114 2.61462L6.54765 2.44434C6.29532 2.58787 6.25633 2.67276 5.85955 3.18155C0.694149 9.8054 0.964401 9.3046 1.0206 9.72084L4.33182 10.7639Z"
                    fill="#57B5DD"
                  />
                  <path
                    d="M24.5556 12.6673L33.9917 9.69507C34.0184 9.55656 33.9783 9.47451 33.9112 9.38853C29.2317 3.38117 28.5827 2.49655 28.3816 2.44763L24.5556 12.6673Z"
                    fill="#7ECAFF"
                  />
                  <path
                    d="M17.4653 4.57861L28.248 2.38127C28.021 2.28285 27.8402 2.26861 27.8334 2.26738L19.1432 1.09691C16.4092 0.728628 15.2308 1.28531 7.07454 2.27048C7.06197 2.27318 6.88666 2.28897 6.67712 2.38017L17.4653 4.57861Z"
                    fill="#5EBFF5"
                  />
                </g>
              </g>
              <defs>
                <filter id="filter0_d_222_8512" x="0.810345" y="0.810345" width="33.3793" height="29.6811" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="0.0948276" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_222_8512" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_222_8512" result="shape" />
                </filter>
                <clipPath id="clip0_222_8512">
                  <rect width="33" height="29.3017" fill="white" transform="translate(1 1)" />
                </clipPath>
                <clipPath id="clip1_222_8512">
                  <rect width="33" height="29.3017" fill="white" transform="translate(1 1)" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className={styles.lower_ice_usd}>${formatPrice(totalIce * state.DGPrices.ice, 2)}</div>

          {!isClaimClicked ? (
            <Button
              className={styles.lower_button}
              onClick={async () => {
                await claimTokens();
              }}
              disabled={totalIce >= state.appConfig.minIceClaimAmount ? false : true}
            >
              {totalIce >= state.appConfig.minIceClaimAmount ? `Claim ${formatPrice(totalIce, 0)} ICE` : state.appConfig.minIceClaimAmount + ' ICE Minimum to Claim'}
            </Button>
          ) : (
            <Button className={styles.lower_button} disabled>
              <LoadingAnimation />
            </Button>
          )}

          <div
            className={styles.lower_ice_text}
            onClick={() => {
              router.push('/ice/claim');
            }}
          >
            See All Rewards
          </div>
        </div>

        {totalUnclaimedAmount > 0 ? (
          <div className={styles.lower}>
            <p className={styles.lower_header}>Claim League Prizes</p>
            <div className={styles.lower_xdg_amount}>
              {totalUnclaimedAmount}
              <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20.5" r="20" fill="#424242" />
                <path
                  d="M12.8487 13.368L10.2072 10.7331C14.9062 5.91481 23.3304 5.01792 29.1555 10.2867C35.1404 15.6982 35.1573 24.886 29.4966 30.3411C23.6546 35.972 14.9643 35.1094 10.2142 30.2151L12.8458 27.5854C12.8749 27.6109 12.9161 27.6434 12.9562 27.6817C13.4269 28.1032 13.9027 28.5194 14.4356 28.8631C15.3891 29.4799 16.4392 29.9327 17.5425 30.2029C19.8262 30.7588 22.2329 30.4942 24.3409 29.4552C25.2633 29.0002 26.1105 28.4066 26.8528 27.6951C28.5407 26.0792 29.6101 23.9247 29.876 21.6043C30.0372 20.1788 29.8901 18.7354 29.4448 17.3716C28.9996 16.0078 28.2664 14.7553 27.295 13.6989C25.9336 12.2186 24.2688 11.2393 22.3194 10.7499C20.069 10.1989 17.6972 10.4408 15.6047 11.4349C14.6678 11.8704 13.8102 12.459 13.0672 13.1764C13.0091 13.2345 12.9446 13.2926 12.8824 13.346C12.872 13.3545 12.8607 13.3619 12.8487 13.368Z"
                  fill="white"
                />
                <path
                  d="M24.8021 22.8246L22.4861 20.5095H29.0793C29.1543 23.8881 26.9468 27.9523 22.5134 29.2648C20.3692 29.8974 18.0675 29.7259 16.041 28.7825C14.0144 27.8391 12.4025 26.1888 11.5081 24.1416C10.6138 22.0945 10.4985 19.7915 11.1841 17.6654C11.8696 15.5393 13.3087 13.7366 15.231 12.596C19.1857 10.2507 23.8213 11.3299 26.3605 13.9689L23.7214 16.6015C22.7435 15.639 21.5477 15.1177 20.1589 15.048C19.0357 14.9858 17.922 15.284 16.9806 15.8991C16.2732 16.3514 15.6804 16.9613 15.2489 17.6811C14.8173 18.4009 14.5586 19.2108 14.4932 20.0473C14.4279 20.8838 14.5575 21.724 14.872 22.502C15.1865 23.28 15.6773 23.9745 16.3058 24.531C16.9343 25.0875 17.6834 25.4909 18.4943 25.7093C19.3051 25.9278 20.1556 25.9554 20.979 25.79C21.8023 25.6247 22.5761 25.2708 23.2394 24.7563C23.9028 24.2417 24.4377 23.5805 24.8021 22.8246Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className={styles.lower_xdg_usd}>${formatPrice(totalUnclaimedAmount * xDgPrice, 2)}</div>

            <Button
              className={styles.lower_button}
              onClick={async () => {
                await claimRewards();
              }}
              disabled={totalUnclaimedAmount > 0 ? false : true}
            >
              {!isXdgClicked ? `Claim ${totalUnclaimedAmount} xDG` : <LoadingAnimation />}
            </Button>

            <div
              className={styles.lower_xdg_text}
              onClick={() => {
                window.open('https://docs.decentral.games/guilds', '_blank');
              }}
            >
              Learn More
            </div>
          </div>
        ) : null}

        <div className={cn(styles.lower)}>
          <p className={styles.lower_header}>Learn More</p>
          <img className={styles.lower_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645784053/image_45_2x_uf8ioz.png" alt="whitepaper" />
          <p className={styles.lower_text}>Discover more about ICE Poker and its tokenomics in our whitepaper.</p>
          <Button
            className={styles.lower_button}
            onClick={() => {
              window.open('https://docs.decentral.games', '_blank');
            }}
          >
            Read Whitepaper
          </Button>
        </div>

        <div className={cn(styles.lower)}>
          <p className={styles.lower_header}>Tutorials</p>
          <img className={styles.lower_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645796022/Group_902_2x_jptzx9.png" alt="whitepaper" />
          <p className={styles.lower_text}>Prefer videos? Learn how to get started with our video walkthroughs.</p>
          <Button
            className={styles.lower_button}
            onClick={() => {
              window.open('https://www.youtube.com/playlist?list=PLfEH-BqRVnrmGVhHSHoe4jvHIHDaQqQrz', '_blank');
            }}
          >
            Watch Tutorials
          </Button>
        </div>
      </div>
    </section>
  );
};

export default IceDashboardNonPremium;
