import React, { FC, ReactElement, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '@/store';
import { Button, Table } from 'semantic-ui-react';
import FoxAnimation from 'components/lottieAnimation/animations/Fox';
import HourglassAnimation from 'components/lottieAnimation/animations/HourGlass';
import ModalSearchToolHistory from 'components/modal/ModalSearchToolHistory/ModalSearchToolHistory';
import Fetch from 'common/Fetch';
import styles from './SearchTool.module.scss';
import cn from 'classnames';
import { useEffect } from 'react';

enum TimePeriods {
  Weekly = 'week',
  Monthly = 'month',
  All = 'all'
}

export interface GamePlayType {
  chipsWon: number;
  leaderboardPercentile: number;
  checkedIn: number;
  numChallengesCompleted: number;
}

export interface IceSearchToolType {
  className?: string;
}

const IceSearchTool: FC<IceSearchToolType> = ({ className = '' }: IceSearchToolType): ReactElement => {
  // get delegation data from the Context API store
  const [state] = useContext(GlobalContext);
  const router = useRouter();

  // define local variables
  const [time, setTime] = useState(TimePeriods.All);
  const [isLoading, setIsLoading] = useState(false);
  const [gameReports, setGameReports] = useState([]);
  const [gamePlay, setGamePlay] = useState({ chipsWon: 0, leaderboardPercentile: 0, checkedIn: 0, numChallengesCompleted: 0, isBanned: false });
  const [searchAddress, updateSearchAddress] = useState('');
  const [searchBoxValue, updateSearchBoxValue] = useState('');
  const [isShowingHistory, setShowingHistory] = useState(false);

  async function searchGameplay(): Promise<void> {
    if (state.userLoggedIn) {
      if (!searchBoxValue) {
        setIsLoading(false);
        updateSearchAddress('');
        setGameReports([]);
        setGamePlay({ chipsWon: 0, leaderboardPercentile: 0, checkedIn: 0, numChallengesCompleted: 0, isBanned: false });
      } else {
        setIsLoading(true);
        updateSearchAddress(searchBoxValue);

        // Get Gameplay Reports from the API
        const playerInfo = await Fetch.PLAYER_INFO(searchBoxValue);
        const response = playerInfo === 'User Not Found' ? [] : await Fetch.GAMEPLAY_REPORTS(searchBoxValue, time);

        const gamePlay = {
          chipsWon: 0,
          leaderboardPercentile: 0,
          checkedIn: 0,
          numChallengesCompleted: 0,
          isBanned: playerInfo === 'User Not Found' ? true : playerInfo.isBanned
        };

        for (let i = 0; i < response.length; i++) {
          if (response[i] && Object.keys(response[i].gameplay).length > 0 && Object.getPrototypeOf(response[i]) === Object.prototype) {
            gamePlay.chipsWon += response[i].gameplay.chipsWon ? response[i].gameplay.chipsWon : 0;
            gamePlay.leaderboardPercentile += response[i].gameplay.leaderboardPercentile;
            gamePlay.checkedIn += 1;
            gamePlay.numChallengesCompleted += response[i].gameplay.numChallengesCompleted;
          }
        }

        if (gamePlay.checkedIn > 0) {
          gamePlay.chipsWon = Math.round(gamePlay.chipsWon / gamePlay.checkedIn);
        }

        setGameReports(response);
        setGamePlay(gamePlay);
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    searchGameplay();
  }, [time]);

  function unlockPremium(): ReactElement {
    return (
      <section className={styles.unlock}>
        <div className={styles.unlock_img}>
          <img className={styles.search} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1644858496/image_39_e6ceyn.png" alt="search" />
          <img className={styles.lock} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1644858497/image_42_steaei.png" alt="lock" />
        </div>
        <h1 className={styles.unlock_title}>Look Up Any Player & Their History</h1>
        <p className={styles.unlock_description}>
          Unlock the ICE Poker player database to <br />
          discover and compare new potential delegates
        </p>
        <Button
          className={styles.blue_button}
          onClick={() => {
            router.push('/premium');
          }}
        >
          Unlock Premium
        </Button>
      </section>
    );
  }

  function playerLookUpHeader(): ReactElement {
    return (
      <section className={styles.header}>
        <h1 className={styles.title}>Player Look Up</h1>

        {/* Filter by Timeline */}
        <div className={cn(styles.filter_pills, styles.timeline)}>
          <div
            className={time === TimePeriods.All ? styles.active : null}
            onClick={() => {
              setTime(TimePeriods.All);
            }}
          >
            All Time
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
            className={time === TimePeriods.Weekly ? styles.active : null}
            onClick={() => {
              setTime(TimePeriods.Weekly);
            }}
          >
            Weekly
          </div>
        </div>
      </section>
    );
  }

  function searchBox(): ReactElement {
    return (
      <section className={styles.search_box}>
        <input
          type="text"
          placeholder="Search for players by ETH address..."
          value={searchBoxValue}
          onChange={e => {
            updateSearchBoxValue(e.target.value);
          }}
        />
        <Button
          className={styles.search}
          onClick={() => {
            searchGameplay();
          }}
        >
          Search
        </Button>
      </section>
    );
  }

  function lookingForSomeone(): ReactElement {
    return (
      <section className={styles.looking_for}>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1644858496/image_39_e6ceyn.png" alt="search" />
        <h1 className={styles.title}>Looking for Someone?</h1>
        <p className={styles.description}>
          Search the ICE Poker player database to <br />
          discover and consider new potential delegates.
        </p>
      </section>
    );
  }

  function gamePlayTable(): ReactElement {
    return (
      <section className={styles.gameplay_table}>
        <div className={styles.fixed}>
          <Table fixed unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ width: '200px' }}>Player Address</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row style={{ background: 'rgba(255, 255, 255, 0.08', width: '200px' }}>
                <Table.Cell className={styles.user_info}>
                  <img className={styles.avatar} src={`https://events.decentraland.org/api/profile/${searchAddress}/face.png`} alt="avatar" />
                  {gamePlay.isBanned && <img className={styles.is_banned} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1648811759/ban_gniyiu.svg" alt="banned" />}
                  <h1>{searchAddress.substr(0, 4) + '...' + searchAddress.substr(-4)}</h1>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>

        <div className={styles.scroll}>
          <Table fixed unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ width: '200px' }}>Status</Table.HeaderCell>
                <Table.HeaderCell style={{ width: '200px' }}>Net Chips Score</Table.HeaderCell>
                <Table.HeaderCell style={{ width: '230px' }}>Avg.Leaderboard Tier</Table.HeaderCell>
                <Table.HeaderCell style={{ width: '150px' }}>Check-Ins</Table.HeaderCell>
                <Table.HeaderCell style={{ width: '220px' }}>Finished Challenges</Table.HeaderCell>
                <Table.HeaderCell style={{ width: '170px' }}>History</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                {/* Status */}
                <Table.Cell style={{ minWidth: '200px' }}>
                  <div className={styles.status} style={{ textAlign: 'center' }}>
                    {gamePlay.isBanned ? 'Banned' : 'Active'}
                  </div>
                </Table.Cell>

                {/* Net Chips Score */}
                <Table.Cell style={{ minWidth: '200px' }}>
                  <div className={styles.net_chips_score} style={{ textAlign: 'center' }}>
                    {gamePlay.chipsWon.toLocaleString()}
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635212177/FREE_Coin_c08hyk.png" alt="chips" />
                  </div>
                </Table.Cell>

                {/* Avg.Leaderboard Tier */}
                <Table.Cell style={{ minWidth: '230px' }}>
                  <div className={styles.tier} style={{ textAlign: 'center' }}>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175017/cup_w68eni.png" alt="cup" />
                    {gamePlay.leaderboardPercentile / gamePlay.checkedIn + 5 <= 50
                      ? `Top ${Math.round(gamePlay.leaderboardPercentile / gamePlay.checkedIn) + 5}%`
                      : `Bottom ${100 - Math.round(gamePlay.leaderboardPercentile / gamePlay.checkedIn)}%`}
                  </div>
                </Table.Cell>

                {/* Check-Ins */}
                <Table.Cell style={{ minWidth: '150px' }}>{gamePlay.checkedIn}</Table.Cell>

                {/* Finished Challenges */}
                <Table.Cell style={{ minWidth: '220px' }}>
                  {gamePlay.numChallengesCompleted} of {3 * gamePlay.checkedIn}
                </Table.Cell>

                {/* History */}
                <Table.Cell style={{ minWidth: '170px' }}>
                  <Button className={styles.breakdown} onClick={() => setShowingHistory(true)}>
                    See History
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </section>
    );
  }

  function noResult(): ReactElement {
    return (
      <section className={styles.no_result}>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1644858496/image_40_woadzu.png" alt="search" />
        <h1 className={styles.title}>Can&apos;t Seem to Find That Player!</h1>
        <p className={styles.description}>
          Looks like we don’t have any information yet
          <br />
          on that player. Try searching for another.
        </p>
      </section>
    );
  }

  return (
    <section className={`ice-search-tool component ${className}`}>
      {!state.userLoggedIn ? (
        <section className={styles.connect_metamask}>
          <FoxAnimation />
        </section>
      ) : (
        <>
          {state.userIsPremium ? (
            <section className={styles.playerLookUp}>
              {playerLookUpHeader()}
              {searchBox()}

              {isLoading ? (
                <section style={{ marginTop: '120px' }}>
                  <HourglassAnimation />
                </section>
              ) : !searchAddress ? (
                lookingForSomeone()
              ) : searchAddress && gamePlay.checkedIn > 0 ? (
                gamePlayTable()
              ) : (
                noResult()
              )}
            </section>
          ) : (
            unlockPremium()
          )}

          {isShowingHistory ? <ModalSearchToolHistory playerAddress={searchAddress} gameReports={gameReports} setShowingHistory={setShowingHistory} /> : null}
        </>
      )}
    </section>
  );
};

export default IceSearchTool;
