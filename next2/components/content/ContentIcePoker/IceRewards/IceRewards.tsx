import React, { FC, ReactElement, useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { GlobalContext } from '../../../../store';
import { Table, Button } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
import cn from 'classnames';
import { useMediaQuery } from 'hooks';
import styles from './IceRewards.module.scss';
import Fetch from '../../../../common/Fetch';
import FoxAnimation from 'components/lottieAnimation/animations/Fox';
import EmptyResultAnimation from 'components/lottieAnimation/animations/EmptyResult';
import ModalIceBreakdown from '@/components/modal/ModalIceBreakDown/ModalIceBreakDown';
import LoadingAnimation from 'components/lottieAnimation/animations/LoadingAnimation';
import HourglassAnimation from 'components/lottieAnimation/animations/HourGlass';
import { formatPrice, getRemainingTime } from '@/common/utils';

export interface IceRewardsType {
  className?: string;
}

const IceRewards: FC<IceRewardsType> = ({ className = '' }: IceRewardsType): ReactElement => {
  // dispatch user's ICE amounts to the Context API store
  const [state, dispatch] = useContext<any>(GlobalContext);

  const isTablet = useMediaQuery('(min-width: 1200px)');

  // define local variables
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payoutTime, setPayoutTime] = useState('--');
  const [totalIce, setTotalIce] = useState(0);
  const [statsUsdx, setStatsUsdx] = useState([]);
  const [statsUsdy, setStatsUsdy] = useState([]);
  const [iceEarned, setIceEarned] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [iceRewardHistory, setHistory] = useState([]);
  const [showBreakDown, setShowingBreakDown] = useState(-1);

  // after claiming rewards this code gets executed
  useEffect(() => {
    setIsClicked(false);
  }, [state.iceAmounts]);

  useEffect(() => {
    (async (): Promise<void> => {
      setTotalIce(state.iceTotalAmount.totalUnclaimedAmount);
    })();
  }, [state.iceTotalAmount.totalUnclaimedAmount]);

  useEffect(() => {
    const id = setInterval(() => {
      let remainingTime = getRemainingTime() / 60;

      // Set Remain Time Text
      if (remainingTime >= 60) {
        remainingTime = Math.floor(remainingTime / 60);
        setPayoutTime(remainingTime + 'h');
      } else {
        setPayoutTime(Math.floor(remainingTime) + 'min');
      }
    }, 1000);

    return () => clearInterval(id);
  });

  useEffect(() => {
    (async (): Promise<void> => {
      if (state.userStatus) {
        setIsLoading(true);

        // Get Gameplay Reports from the API
        const response = await Fetch.GAMEPLAY_REPORTS();

        // Set xAxis
        const xAxis = [];
        const today = new Date().toUTCString();
        const todayMoment = moment.utc(new Date(today).toUTCString());

        for (let i = 0; i < response.length; i++) {
          xAxis.push(moment.utc(response[i].day).format('M/D'));
        }

        setStatsUsdx(xAxis);

        // Set yAxis
        const datasets = [
          {
            label: 'Gameplay',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: ['#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF', '#B0E6FF'],
            barThickness: 20,
            borderWidth: 2,
            borderRadius: 10
          },
          {
            label: 'Delegation',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: ['#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5', '#5EBFF5'],
            barThickness: 20,
            borderWidth: 2,
            borderRadius: 10
          }
        ];

        let i: number,
          j: number,
          totalIceEarned = 0,
          totalXpEarned = 0;
        const history = [];

        for (i = response.length - 1; i >= 0; i--) {
          let gamePlayIceEarned = 0,
            gamePlayXpEarned = 0,
            delegationIceEarned = 0,
            delegationXpEarned = 0;
          const day = moment.utc(new Date(response[i].day));
          const xAxisIndex = day.diff(todayMoment, 'days') + 7;

          // get GamePlay
          if (response[i].gameplay && Object.keys(response[i].gameplay).length !== 0) {
            gamePlayIceEarned += response[i].gameplay.iceEarnedPlayer;

            if (!response[i].gameplay.wearableSnapshot.delegatorAddress) {
              gamePlayXpEarned = response[i].gameplay.xpEarned;
            }
          }

          // get Delegation
          for (j = 0; j < response[i].delegation.length; j++) {
            delegationIceEarned += response[i].delegation[j].iceEarnedDelegator;
            delegationXpEarned += response[i].delegation[j].xpEarned;
          }

          totalIceEarned += gamePlayIceEarned + delegationIceEarned;
          totalXpEarned += gamePlayXpEarned + delegationXpEarned;

          // set yAxis data
          datasets[0].data[xAxisIndex] = gamePlayIceEarned;
          datasets[1].data[xAxisIndex] = delegationIceEarned;

          // add Gameplay history
          if (gamePlayIceEarned !== 0 || gamePlayXpEarned !== 0) {
            history.push({
              date: moment.utc(response[i].day).format('MM/DD/YY'),
              type: 'Gameplay',
              iceEarned: gamePlayIceEarned,
              xpEarned: gamePlayXpEarned,
              records: Object.keys(response[i].gameplay).length !== 0 ? [].concat(response[i].gameplay) : []
            });
          }

          // add Delegation history
          if (delegationIceEarned !== 0 || delegationXpEarned !== 0) {
            history.push({
              date: moment.utc(response[i].day).format('MM/DD/YY'),
              type: 'Delegation',
              iceEarned: delegationIceEarned,
              xpEarned: delegationXpEarned,
              records: response[i].delegation
            });
          }
        }

        setIceEarned(totalIceEarned);
        setXpEarned(totalXpEarned);
        setStatsUsdy(datasets);
        setHistory(history);
        setIsLoading(false);
      }
    })();
  }, [state.userStatus]);

  async function claimTokens(): Promise<void> {
    setIsClicked(true);

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

        msg = 'ICE claimed successfully!';
        setTotalIce(0);
      } else {
        msg = 'ICE claimed failed!';

        setIsClicked(false);
      }
    } catch (error) {
      msg = 'ICE claimed failed!';

      setIsClicked(false);
    }

    dispatch({
      type: 'show_toastMessage',
      data: msg
    });
  }

  return (
    <section className={`ice-rewards component ${className}`}>
      {!state.userStatus ? (
        <div className={styles.fullWidth}>
          <FoxAnimation />
        </div>
      ) : (
        <div className={styles.main_wrapper}>
          <div className={styles.topDiv}>
            <div className={styles.claimICEDiv}>
              <div className={styles.title}>
                <h1>Claim ICE Rewards</h1>
              </div>

              <div className={styles.lower}>
                <div className={styles.lower_header}>
                  <h1>ICE Poker Rewards</h1>
                  <p>
                    Payouts at midnight UTC daily&nbsp;
                    <abbr>(in {payoutTime})</abbr>
                  </p>
                </div>

                <div>
                  <div className={styles.lower_value}>
                    <p className={styles.ICE_value}>{totalIce}</p>
                    <img style={{ marginTop: '-4px' }} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" />
                  </div>
                  <p className={styles.price}>${formatPrice(totalIce * state.DGPrices.ice, 2)}</p>
                </div>

                <Button
                  className={cn(styles.claim_ICE, styles.lower_button)}
                  onClick={() => claimTokens()}
                  disabled={isClicked || totalIce >= state.appConfig.minIceClaimAmount ? false : true}
                >
                  {!isClicked ? (
                    <>{totalIce >= state.appConfig.minIceClaimAmount ? `Claim ${formatPrice(totalIce, 0)} ICE` : state.appConfig.minIceClaimAmount + ' ICE Minimum to Claim'}</>
                  ) : (
                    <LoadingAnimation />
                  )}
                </Button>
              </div>
            </div>

            <div className={styles.iceEarnedDiv}>
              <div className={styles.title}>
                <h1>ICE Earned (past 7 Days - UTC)</h1>
              </div>
              <div className={styles.graph}>
                {isLoading ? (
                  <div style={{ marginTop: '50px' }}>
                    <HourglassAnimation />
                  </div>
                ) : (
                  <>
                    <Bar
                      height={180}
                      data={{
                        labels: statsUsdx,
                        datasets: statsUsdy
                      }}
                      options={{
                        maintainAspectRatio: false,
                        cornerRadius: 10,
                        title: { display: false },
                        legend: { display: false },
                        scales: {
                          xAxes: [
                            {
                              stacked: true
                            }
                          ],
                          yAxes: [
                            {
                              stacked: true,
                              ticks: {
                                autoSkip: true,
                                autoSkipPadding: 25,
                                maxRotation: 0,
                                minRotation: 0
                              }
                            }
                          ]
                        },
                        elements: {
                          point: { radius: 10 }
                        }
                      }}
                    />
                    <div className={styles.bottomDiv}>
                      <div className={styles.legend}>
                        <div>
                          <section className={styles.delegationBG} />
                          Delegation
                        </div>
                        <div>
                          <section className={styles.gamePlayBG} />
                          Gameplay
                        </div>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.ice}>
                          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                          {iceEarned} ICE
                        </div>
                        <div className={styles.xp}>
                          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_XP_ICN_f9w2se.svg" alt="xp" />
                          {xpEarned} XP
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.history}>
            <div className={styles.title}>
              <h1>ICE Reward History</h1>
            </div>
            {isLoading ? (
              <Table fixed unstackable style={{ marginBottom: '0px' }}>
                <Table.Header>
                  <Table.Row>
                    <HourglassAnimation />
                  </Table.Row>
                </Table.Header>
              </Table>
            ) : iceRewardHistory && iceRewardHistory.length > 0 ? (
              <>
                <Table fixed unstackable style={{ marginBottom: '0px' }}>
                  <Table.Header>
                    <Table.Row>
                      {isTablet && <Table.HeaderCell style={{ width: '15%' }}>Date</Table.HeaderCell>}
                      <Table.HeaderCell style={{ width: '18%' }}>Type</Table.HeaderCell>
                      <Table.HeaderCell style={{ width: '18%' }}>ICE Earned</Table.HeaderCell>
                      <Table.HeaderCell style={{ width: '18%' }}>XP Earned</Table.HeaderCell>
                      {isTablet && <Table.HeaderCell style={{ width: '30%' }}>Breakdown</Table.HeaderCell>}
                    </Table.Row>
                  </Table.Header>
                </Table>
                <Table fixed unstackable>
                  <Table.Body>
                    {iceRewardHistory.map((row, i) => {
                      let style = '';

                      {
                        i % 2 === 0 ? (style = 'rgba(255, 255, 255, 0.08)') : (style = 'black');
                      }

                      return (
                        <Table.Row key={i} style={{ background: style }}>
                          {isTablet && <Table.Cell style={{ width: '15%' }}>{row.date}</Table.Cell>}
                          <Table.Cell style={{ width: '18%' }}>{row.type}</Table.Cell>
                          <Table.Cell className={styles.iceEarned} style={{ width: '18%' }}>
                            <div className={styles.earnedDiv}>{row.iceEarned.toLocaleString()}</div>
                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                          </Table.Cell>
                          <Table.Cell className={styles.xpEarned} style={{ width: '18%' }}>
                            <div className={styles.earnedDiv}>{row.xpEarned.toLocaleString()}</div>
                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_XP_ICN_f9w2se.svg" alt="xp" />
                          </Table.Cell>
                          {isTablet && (
                            <Table.Cell style={{ width: '30%', textAlign: 'right' }}>
                              <Button className={styles.breakdown} onClick={() => setShowingBreakDown(i)} disabled={row.records && row.records.length > 0 ? false : true}>
                                See Complete Breakdown
                              </Button>
                            </Table.Cell>
                          )}
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </>
            ) : (
              <div style={{ marginTop: '50px' }}>
                <EmptyResultAnimation />
              </div>
            )}
          </div>

          {showBreakDown !== -1 ? <ModalIceBreakdown history={iceRewardHistory[showBreakDown]} setShowingBreakDown={setShowingBreakDown} /> : null}
        </div>
      )}
    </section>
  );
};

export default IceRewards;
