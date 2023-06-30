import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { Biconomy } from '@biconomy/mexa';
import Web3 from 'web3';
import axios from 'axios';
import { Loader, Button, Table } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import Global from 'components/Constants';
import styles from './Overview.module.scss';
import Fetch from '../../../../common/Fetch';
import { formatPrice } from '@/common/utils';
import TreasuryGraph from '../Treasury/graph';

const Overview = props => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const router = useRouter();

  // define local variables
  const [treasuryTotal, setTreasuryTotal] = useState(0);
  const [statsUSDX, setStatsUSDX] = useState([]);
  const [statsUSDY, setStatsUSDY] = useState([]);
  const [gameplayTreasury, setGameplayTreasury] = useState(0);
  const [gameplayHotPercent, setGameplayHotPercent] = useState(0);
  const [weeklyChange, setWeeklyChange] = useState(0);
  const [gameplayAll, setGameplayAll] = useState(0);
  const [gameplayAllPercent, setGameplayAllPercent] = useState(0);
  const [dgTreasury, setDgTreasury] = useState(0);
  const [dgPercent, setDgPercent] = useState(0);
  const [landTreasury, setLandTreasury] = useState(0);
  const [landTreasuryPercent, setLandTreasuryPercent] = useState(0);
  const [nftTreasury, setNftTreasury] = useState(0);
  const [nftTreasuryPercent, setNftTreasuryPercent] = useState(0);
  const [liquidityTreasury, setLiquidityTreasury] = useState(0);
  const [lpPercent, setLpPercent] = useState(0);
  const [maticTreasury, setMaticTreasury] = useState(0);
  const [maticTreasuryPercent, setMaticTreasuryPercent] = useState(0);
  const [wearableSales, setWearableSales] = useState(0);
  const [wearableSalesPercent, setWearableSalesPercent] = useState(0);
  const [unvestedDG, setUnvestedDG] = useState(0);
  const [dgTreasuryPercent, setDgTreasuryPercent] = useState(0);

  const [snapshotOne, setSnapshotOne] = useState([]);
  const [dateOne, setDateOne] = useState('');
  const [activeOne, setActiveOne] = useState('');
  const [IDOne, setIDOne] = useState('');

  const [snapshotTwo, setSnapshotTwo] = useState([]);
  const [dateTwo, setDateTwo] = useState('');
  const [activeTwo, setActiveTwo] = useState('');
  const [IDTwo, setIDTwo] = useState('');

  const [snapshotThree, setSnapshotThree] = useState([]);
  const [dateThree, setDateThree] = useState('');
  const [activeThree, setActiveThree] = useState('');
  const [IDThree, setIDThree] = useState('');

  const [currentDate, setCurrentDate] = useState('');
  const [visible, setVisible] = useState(true);
  const { xDG: xDGPrice } = state.DGPrices;

  const [totalClaimedAmount, setTotalClaimedAmount] = useState(0);
  const [totalUnclaimedAmount, setTotalUnclaimedAmount] = useState(0);
  const [xdgClicked, setXdgClicked] = useState(false);

  useEffect(() => {
    (async () => {
      const biconomy = new Biconomy(new Web3.providers.HttpProvider(state.appConfig.polygonRPC), {
        apiKey: Global.KEYS.BICONOMY_API_1,
        debug: true
      });

      const snapshotData = await axios.post(`https://hub.snapshot.org/graphql`, {
        query: `{
            proposals (
              first: 3,
              skip: 0,
              where: {
                space_in: ["decentralgames.eth"],
                state: ""
              },
              orderBy: "created",
              orderDirection: desc
            ) {
              id
              title
              body
              choices
              start
              end
              snapshot
              state
              author
              space {
                id
                name
              }
            }
          }`
      });

      setSnapshotOne(snapshotData.data.data.proposals[0]);
      setSnapshotTwo(snapshotData.data.data.proposals[1]);
      setSnapshotThree(snapshotData.data.data.proposals[2]);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (state.userAddress) {
        await updateAmountForClaim();
      }
    })();
  }, [state.userAddress]);

  useEffect(() => {
    const temp = new Date(snapshotOne.end * 1000);
    setDateOne(temp.toDateString());
    setIDOne(snapshotOne.id);

    const temp_two = new Date(snapshotTwo.end * 1000);
    setDateTwo(temp_two.toDateString());
    setIDTwo(snapshotTwo.id);

    const temp_three = new Date(snapshotThree.end * 1000);
    setDateThree(temp_three.toDateString());
    setIDThree(snapshotThree.id);

    let today = new Date();

    if (temp < today) {
      setActiveOne(true);
    }

    if (temp_two < today) {
      setActiveTwo(true);
    }

    if (temp_three < today) {
      setActiveThree(true);
    }
  }, [snapshotOne, snapshotTwo, snapshotThree, currentDate]);

  // use for both the graph and the stats
  // that'll just be week? to match discord bot 'in the past week'
  // that data will include the percent changes for both daily/weekly in the changes object
  // call .weekly to match labels
  useEffect(() => {
    try {
      if (Object.keys(state.treasuryNumbers).length !== 0) {
        const usd = state.treasuryNumbers.totalBalanceUSD.graph;
        let xAxis = [];
        let i;
        for (i = 0; i < usd.length; i += 4) {
          let temp_x = new Date(usd[i].primary);
          let temp_x2 = temp_x.toDateString();
          xAxis.push(temp_x2.slice(0, 1));
        }

        let yAxis = [];
        let j;
        for (j = 0; j < usd.length; j += 4) {
          let temp_y = usd[j].secondary;
          yAxis.push(temp_y / 1000000);
        }

        const totalUSD = state.treasuryNumbers.totalBalanceUSD.graph;
        const api_usd = Number(totalUSD.slice(-1)[0].secondary);
        setTreasuryTotal(formatPrice(api_usd, 0));

        setStatsUSDX(xAxis);
        setStatsUSDY(yAxis);

        const temp_start = totalUSD[0].secondary;
        const temp_end = api_usd;
        const change = temp_end - temp_start;
        setWeeklyChange(change);

        const gameplayTotal = state.treasuryNumbers.allTimeGameplayUSD;
        const game_temp = Number(gameplayTotal.graph.slice(-1)[0].secondary);
        setGameplayAll(formatPrice(game_temp, 0));

        const gameplayTotal_temp = gameplayTotal.changes.weekly.percent.toFixed(2);
        setGameplayAllPercent(Number(gameplayTotal_temp));

        const gameplay = state.treasuryNumbers.totalGameplayUSD;
        const gameplay_temp = Number(gameplay.graph.slice(-1)[0].secondary);
        setGameplayTreasury(formatPrice(gameplay_temp, 0));

        const gameplay_temp2 = gameplay.changes.weekly.percent.toFixed(2);
        setGameplayHotPercent(Number(gameplay_temp2));

        const land = state.treasuryNumbers?.totalLandUSD;
        setLandTreasury(formatPrice(land.graph.slice(-1)[0].secondary, 0));

        const land_temp = land?.changes?.weekly?.percent.toFixed(2);
        setLandTreasuryPercent(Number(land_temp));

        const wearables = state.treasuryNumbers.totalWearablesUSD;
        setNftTreasury(formatPrice(wearables.graph.slice(-1)[0].secondary, 0));

        const wearables_temp = wearables?.changes?.weekly?.percent.toFixed(2);
        setNftTreasuryPercent(Number(wearables_temp));

        const ice_wearables = state.treasuryNumbers.totalIceWearablesUSD;
        setWearableSales(formatPrice(ice_wearables.graph.slice(-1)[0].secondary, 0));

        const ice_percent = ice_wearables.changes.weekly.percent.toFixed(2);
        setWearableSalesPercent(Number(ice_percent));

        setDgTreasury(Number(state.treasuryNumbers?.totalDgWalletUSD?.graph[state.treasuryNumbers.totalDgWalletUSD.graph.length - 1].secondary));
        setUnvestedDG(formatPrice(dgTreasury, 0));

        const dg_temp = state.treasuryNumbers?.totalDgWalletUSD?.changes?.weekly?.percent.toFixed(2);
        setDgTreasuryPercent(Number(dg_temp));

        const liq = state.treasuryNumbers.totalLiquidityProvided;
        const old_liq = Number(liq.graph.slice(-1)[0].secondary);
        setLiquidityTreasury(formatPrice(old_liq, 0));

        const liq_temp = liq.changes.weekly.percent.toFixed(2);
        setLpPercent(Number(liq_temp));

        const maticBal = state.treasuryNumbers.totalMaticUSD;
        setMaticTreasury(formatPrice(maticBal.graph.slice(-1)[0].secondary, 0));

        const matic_temp = maticBal.changes.weekly.percent.toFixed(2);
        setMaticTreasuryPercent(Number(matic_temp));
      }
    } catch (error) {
      console.log('Treasury Numbers Error: ' + error);
    }
  }, [state.treasuryNumbers, dgTreasury]);

  useEffect(() => {
    if (state.userStatus && state.stakingBalances?.BALANCE_USER_GOVERNANCE > 0) {
      setVisible(false);
    }
  }, [state.userStatus, state.stakingBalances?.BALANCE_USER_GOVERNANCE]);

  // helper functions
  function getWeeklyChange() {
    return (
      <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {weeklyChange > 0 && treasuryTotal ? (
          <span
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '-6px',
              paddingBottom: '9px'
            }}
          >
            <p className={styles.earned_percent_pos}>
              +$
              {weeklyChange.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </p>
            <p className={styles.earned_text}>this week</p>
          </span>
        ) : treasuryTotal ? (
          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <p className={styles.earned_percent_neg}>
              -$
              {(weeklyChange * -1).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </p>
            <p className={styles.earned_text}>this week</p>
          </span>
        ) : null}
      </span>
    );
  }

  function getLoader() {
    return (
      <Table.Cell textAlign="right">
        <Loader active inline size="small" className="treasury-loader" />
      </Table.Cell>
    );
  }

  function showDiv() {
    return (
      <div className={styles.blue_container}>
        <div className={styles.blue_text}>
          <p className={styles.blue_header}>
            Stake DG to earn, <br /> govern, and more
          </p>
          <p className={styles.blue_lower}>
            By staking DG, you can govern the <br /> treasury, add proposals, and earn yield.
          </p>
          <Button
            className={styles.blue_button}
            onClick={() => {
              router.push('/dg/governance');
            }}
          >
            Start Staking $DG
          </Button>
        </div>
        <img className={styles.blue_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1643226580/Bitcoin_Dashboard_sqe5wt.png" />
        <div className={styles.close_button} onClick={() => setVisible(false)}>
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.18262 10.8501C0.772461 11.2676 0.750488 12.0366 1.19727 12.4761C1.64404 12.9229 2.40576 12.9082 2.82324 12.4907L6.9541 8.35986L11.0776 12.4834C11.5098 12.9229 12.2568 12.9155 12.6963 12.4688C13.1431 12.0293 13.1431 11.2822 12.7109 10.8501L8.5874 6.72656L12.7109 2.5957C13.1431 2.16357 13.1431 1.4165 12.6963 0.977051C12.2568 0.530273 11.5098 0.530273 11.0776 0.962402L6.9541 5.08594L2.82324 0.955078C2.40576 0.544922 1.63672 0.522949 1.19727 0.969727C0.757812 1.4165 0.772461 2.17822 1.18262 2.5957L5.31348 6.72656L1.18262 10.8501Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    );
  }

  async function updateAmountForClaim() {
    // update user status in database
    const { totalClaimedAmount: amount1, totalUnclaimedAmount: amount2 } = await Fetch.XDG_CLAIM_REWARDS_AMOUNT(state.userAddress);

    console.log(amount1);
    console.log(amount2);

    setTotalClaimedAmount(amount1);
    setTotalUnclaimedAmount(amount2);
  }

  async function claimRewards() {
    let msg = '';

    setXdgClicked(true);

    try {
      const json = await Fetch.XDG_CLAIM_REWARDS();

      if (json.status) {
        console.log('Claim xDG rewards request successful');
        msg = 'xDG claimed successful!';
      } else {
        console.log('Claim xDG rewards request error: ' + json.reason);
        msg = 'xDG claimed failed!';
      }

      setXdgClicked(false);
    } catch (error) {
      console.log(error); // API request timeout error
      msg = 'API request timeout error';
      setXdgClicked(false);
    }

    dispatch({
      type: 'show_toastMessage',
      data: msg
    });

    await updateAmountForClaim();
  }

  const weekly = {
    labels: statsUSDX,
    datasets: [
      {
        fill: true,
        lineTension: 0.5,
        backgroundColor: '#000000',
        borderColor: '#67DD6C',
        borderWidth: 6,
        data: statsUSDY
      }
    ]
  };

  return (
    <div>
      <div className={cn('row', styles.main_wrapper)}>
        <div className={cn('col-xl-8', styles.overview_container)}>
          <div className={styles.container_left}>
            {state.userInfo.name === null || state.userInfo.name === '' ? (
              <p className={styles.welcome_text}>Welcome,</p>
            ) : (
              <p className={styles.welcome_text}>Welcome {state.userInfo.name},</p>
            )}
            <h1 className={styles.dashboard_text}>Your DAO Dashboard</h1>
          </div>

          {visible ? showDiv() : null}

          <div className={styles.treasury_wrapper}>
            <TreasuryGraph />
          </div>

          <div className={cn('d-flex justify-content-between', styles.stake_DG_container)}>
            <div className={styles.lower}>
              <p className={styles.lower_header}>Stake Your $DG</p>
              <video
                src="https://res.cloudinary.com/dnzambf4m/video/upload/q_auto:best/v1626798440/Wallet_1_k0dqit.webm"
                className={styles.lower_img}
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
              <p className={styles.lower_text}>Stake $DG to govern the treasury, vote on proposals, and earn yields.</p>
              <Button
                className={styles.lower_button}
                onClick={() => {
                  router.push('/dg/governance');
                }}
              >
                Stake Your DG
              </Button>
            </div>

            <div className={styles.lower}>
              <p className={styles.lower_header_two}>Governance Proposals</p>

              <div className={styles.governance_container}>
                <div className={styles.state_box}>
                  <p className={activeOne ? styles.state_closed : styles.state}>{snapshotOne.state}</p>
                </div>

                <a href={`https://snapshot.org/#/decentralgames.eth/proposal/${IDOne}`} target="_blank">
                  <div className={styles.gov_right}>
                    <div className="d-flex flex-column mr-2" style={{ maxWidth: '150px' }}>
                      <p className={styles.gov_top}>{dateOne}</p>
                      <p className={styles.gov_title}>{snapshotOne.title}</p>
                    </div>
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'flex', alignSelf: 'center' }}>
                      <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </a>
              </div>

              <div className={styles.governance_container}>
                <div className={styles.state_box}>
                  <p className={activeTwo ? styles.state_closed : styles.state}>{snapshotTwo.state}</p>
                </div>

                <a href={`https://snapshot.org/#/decentralgames.eth/proposal/${IDTwo}`} target="_blank">
                  <div className={styles.gov_right}>
                    <div className="d-flex flex-column" style={{ maxWidth: '150px' }}>
                      <p className={styles.gov_top}>{dateTwo}</p>
                      <p className={styles.gov_title}>{snapshotTwo.title}</p>
                    </div>
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'flex', alignSelf: 'center' }}>
                      <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </a>
              </div>

              <div className={styles.governance_container}>
                <div className={styles.state_box}>
                  <p className={activeThree ? styles.state_closed : styles.state}>{snapshotThree.state}</p>
                </div>

                <a href={`https://snapshot.org/#/decentralgames.eth/proposal/${IDThree}`} target="_blank">
                  <div className={styles.gov_right}>
                    <div className="d-flex flex-column" style={{ maxWidth: '150px' }}>
                      <p className={styles.gov_top}>{dateThree}</p>
                      <p className={styles.gov_title}>{snapshotThree.title}</p>
                    </div>
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'flex', alignSelf: 'center' }}>
                      <path d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </a>
              </div>

              <div className={styles.button_span}>
                <Button
                  className={styles.button_gov}
                  onClick={() => {
                    window.open('https://decentral.games/discord', '_blank');
                  }}
                >
                  Discussion
                </Button>
                <Button
                  className={styles.button_gov}
                  onClick={() => {
                    window.open('https://snapshot.org/#/decentralgames.eth ', '_blank');
                  }}
                >
                  Proposals
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className={cn('col-xl-4', styles.sub_profile)}>
          <div className={styles.lower}>
            <p className={styles.lower_header}>Claim xDG Airdrop</p>
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
            <div className={styles.lower_xdg_usd}>${formatPrice(totalUnclaimedAmount * xDGPrice, 2)}</div>
            <Button
              className={styles.lower_button}
              onClick={async () => {
                await claimRewards();
              }}
              disabled={totalUnclaimedAmount > 0 ? false : true}
            >
              {!xdgClicked ? `Claim ${totalUnclaimedAmount} xDG` : <Loader active inline size="small" className="treasury-loader" />}
            </Button>
            <a
              className={styles.lower_xdg_text}
              target="_blank"
              href="https://snapshot.org/#/decentralgames.eth/proposal/0xa5933d9cf0621e2f0b0db7e8eacd069f7398cb599b16d9ee1bce81b41bea50e7"
            >
              See Governance Proposal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
