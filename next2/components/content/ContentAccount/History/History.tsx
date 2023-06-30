import React, { FC, ReactElement, useEffect, useState, useContext } from 'react';
import { GlobalContext } from '@/store';
import cn from 'classnames';
import moment from 'moment';
import { useMediaQuery } from 'hooks';
import { sumBy } from 'lodash';
import Global from 'components/Constants';
import poker from 'common/Poker';
import { Modal, Button, Table } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import styles from './History.module.scss';
import BigNumber from 'bignumber.js';

export interface HistoryType {
  className?: string;
  state?: any;
}

const History: FC<HistoryType> = ({ className = '' }: HistoryType): ReactElement => {
  // get user's transaction history from the Context API store
  const [state] = useContext(GlobalContext);
  const [dataHistory, dataPlay, dataPoker] = state.transactions;

  const isWideScreen = useMediaQuery('(min-width: 1010px)');
  const isTablet = useMediaQuery('(min-width: 800px)');
  const isMobile = useMediaQuery('(min-width: 576px)');

  // define local variables
  const [openId, setOpenId] = useState(null);
  const playData = dataPoker === 'false' ? [] : dataPoker;

  // group function
  const groups = playData.reduce((groups, game) => {
    const date = game.createdAt.split('T')[0];

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(game);

    return groups;
  }, {});

  const groupArrays = Object.keys(groups).map(date => ({
    date,
    games: groups[date]
  }));

  const PokerData = groupArrays.map(x => ({
    session_id: x.games[0].sessionID,
    session_time: x.date,
    session_net_chips: sumBy(x.games, ({ tableData }) =>
      sumBy(tableData, item => (item.playerHandData.netChips ? parseFloat(new BigNumber(item.playerHandData.netChips.$numberDecimal).div(Global.CONSTANTS.FACTOR).toFixed()) : 0))
    ),
    session_data: x.games.map(xx => ({
      dateTime: moment(xx.createdAt).format('hh:mm:ss UTC'),
      session_history: xx.tableData.map(xxx => ({
        netChip: xxx.playerHandData.netChips ? parseFloat(new BigNumber(xxx.playerHandData.netChips.$numberDecimal).div(Global.CONSTANTS.FACTOR).toFixed()) : 0,
        tableCards: xxx.communityCards,
        myCards: xxx.playerHandData.hand,
        winCards: xxx.winningHand && xxx.winningHand.length > 0 ? xxx.winningHand[0] : []
      }))
    }))
  }));

  const newPokerData = PokerData.sort((a, b) => new Date(b.session_time).getTime() - new Date(a.session_time).getTime());

  useEffect(() => {
    console.log('->State.transactions[0]: ', state.transactions[0]);
  }, [state.transactions]);

  return (
    <Aux>
      <div className={styles.history_container}>
        <h1 className={styles.title}>Gameplay History</h1>
        <div className="tx-box-overflow">
          {playData.length === 0 ? null : (
            <Table fixed unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{ textAlign: 'left' }}>Session Time</Table.HeaderCell>
                  <Table.HeaderCell style={{ textAlign: 'center' }}>Net Chips</Table.HeaderCell>
                  <Table.HeaderCell style={{ textAlign: 'right' }}>Hand Histories</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
          )}

          {newPokerData.length === 0 ? (
            <div className={styles.error_container}>
              <p className={styles.error_state}>No Recent Gameplay History</p>
            </div>
          ) : (
            newPokerData.map((row, i) => (
              <Table key={i} fixed unstackable>
                <Table.Body key={i}>
                  <Table.Row style={{ background: i % 2 === 0 ? 'rgba(255, 255, 255, 0.08)' : 'black' }}>
                    <Table.Cell style={{ textAlign: 'left' }}>{row.session_time}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'center' }}>{row.session_net_chips}</Table.Cell>
                    <Table.Cell
                      style={{
                        textAlign: 'right'
                      }}
                    >
                      <span className="d-flex justify-content-end">
                        <Modal
                          className={styles.menu_info_modal}
                          onClose={() => setOpenId(null)}
                          onOpen={() => setOpenId(row.session_id)}
                          open={openId === row.session_id}
                          close
                          size="tiny"
                          centered={true}
                          trigger={<Button className={styles.session_history}>{isWideScreen ? 'Session History' : 'History'}</Button>}
                        >
                          <div>
                            <span className={styles.button_close} onClick={() => setOpenId(null)}>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
                                  fill="white"
                                />
                              </svg>
                            </span>
                          </div>
                          <div>
                            <h1 className={styles.title}>Poker Session History</h1>
                            <p className={styles.date}>{row.session_time + ' UTC'}</p>
                            <div className={cn('d-flex', styles.main_wrapper)}>
                              <div className={styles.table_data}>
                                {row.session_data.map((subRow, subIndex) =>
                                  subRow.session_history.map((item, index) => (
                                    <div key={index} className={styles.table_row}>
                                      <div key={subIndex * 100 + index * 10 + 1} className={styles.hand_row}>
                                        {subIndex === 0 && <p className={styles.subtitle}>Time</p>}
                                        <div className={styles.card_col}>
                                          <div className={styles.empty_data}>{subRow.dateTime}</div>
                                        </div>
                                      </div>

                                      <div key={subIndex * 100 + index * 10 + 2} className={styles.hand_row}>
                                        {subIndex === 0 && <p className={styles.subtitle}>Your Cards</p>}
                                        <div className={styles.card_col}>
                                          {item.myCards.length > 0 ? (
                                            item.myCards.map(card => <img key={card} src={poker[card[1] - 1][card[0]]} />)
                                          ) : (
                                            <div className={styles.empty_data}> -- </div>
                                          )}
                                        </div>
                                      </div>

                                      <div key={subIndex * 100 + index * 10 + 3} className={styles.hand_row_2}>
                                        {subIndex === 0 && <p className={styles.subtitle}>Table Cards</p>}
                                        <div className={styles.card_col}>
                                          {item.tableCards.length > 0 ? (
                                            item.tableCards.map(card => <img key={card} src={poker[card[1] - 1][card[0]]} />)
                                          ) : (
                                            <div className={styles.empty_data}> -- </div>
                                          )}
                                        </div>
                                      </div>

                                      <div key={subIndex * 100 + index * 10 + 4} className={styles.winner_row}>
                                        {subIndex === 0 && <p className={styles.subtitle}>Winner’s Cards</p>}
                                        <div className={styles.card_col}>
                                          {item.winCards && item.winCards.length > 0 ? (
                                            item.winCards.map(card => <img key={card} src={poker[card[1] - 1][card[0]]} />)
                                          ) : (
                                            <div className={styles.empty_data}> -- </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className={styles.net_chip_row}>
                                        {subIndex === 0 && <p className={styles.subtitle}>Net chip</p>}
                                        <div className={styles.net_chip_row2}>
                                          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                              d="M13.3101 6.5C13.3104 6.98085 13.2575 7.46026 13.1524 7.92948C12.9899 8.65447 12.703 9.34584 12.3045 9.97293C11.7888 10.7883 11.0983 11.4788 10.283 11.9945C9.6559 12.3929 8.96453 12.6798 8.23953 12.8423C7.29814 13.0526 6.32197 13.0526 5.38058 12.8423C4.65558 12.6798 3.96421 12.3929 3.33712 11.9945C2.52177 11.4788 1.83127 10.7883 1.3156 9.97293C0.917107 9.34584 0.630243 8.65447 0.467728 7.92948C0.257502 6.98773 0.257502 6.01122 0.467728 5.06948C0.739139 3.87035 1.34462 2.77261 2.21407 1.90334C3.08352 1.03407 4.18139 0.428827 5.38058 0.157671C6.32197 -0.0525571 7.29814 -0.0525571 8.23953 0.157671C9.43858 0.429127 10.5363 1.03447 11.4057 1.90369C12.2751 2.77291 12.8807 3.87049 13.1524 5.06948C13.2576 5.53904 13.3104 6.0188 13.3101 6.5Z"
                                              fill="#B10000"
                                            />
                                            <path
                                              d="M6.81021 10.389C8.95835 10.389 10.6998 8.64756 10.6998 6.49942C10.6998 4.35128 8.95835 2.60986 6.81021 2.60986C4.66207 2.60986 2.92065 4.35128 2.92065 6.49942C2.92065 8.64756 4.66207 10.389 6.81021 10.389Z"
                                              fill="white"
                                            />
                                            <path
                                              d="M8.36085 7.34318C8.56646 7.13757 8.68196 6.85871 8.68196 6.56793C8.68196 6.27716 8.56646 5.9983 8.36085 5.79268L6.81035 4.24219L5.25986 5.79268C5.08912 5.96385 4.97974 6.18666 4.94874 6.42643C4.91775 6.6662 4.96688 6.9095 5.08849 7.11846C5.2101 7.32741 5.39736 7.49032 5.62115 7.58181C5.84493 7.67331 6.09269 7.68828 6.32586 7.62438C6.27834 8.0266 6.14287 8.41343 5.92907 8.75741H7.69195C7.47811 8.41345 7.34264 8.02661 7.29517 7.62438C7.4818 7.67588 7.67875 7.677 7.86596 7.6276C8.05316 7.5782 8.22393 7.48006 8.36085 7.34318V7.34318Z"
                                              fill="#B10000"
                                            />
                                            <path
                                              d="M8.23957 0.157671L7.88455 1.46185H5.73563L5.38062 0.157671C6.32201 -0.0525572 7.29818 -0.0525572 8.23957 0.157671V0.157671Z"
                                              fill="white"
                                            />
                                            <path d="M8.23957 12.8423C7.29818 13.0525 6.32201 13.0525 5.38062 12.8423L5.73563 11.537H7.88455L8.23957 12.8423Z" fill="white" />
                                            <path
                                              d="M12.3044 3.02696L11.1318 3.69732L9.61255 2.177L10.2819 1.00439C11.0978 1.52013 11.7887 2.21103 12.3044 3.02696V3.02696Z"
                                              fill="white"
                                            />
                                            <path d="M4.0078 10.822L3.33744 11.9946C2.52209 11.479 1.83159 10.7884 1.31592 9.9731L2.48853 9.30273L4.0078 10.822Z" fill="white" />
                                            <path
                                              d="M13.3102 6.49986C13.3106 6.98071 13.2577 7.46012 13.1526 7.92933L11.8484 7.57431V5.4254L13.1526 5.06934C13.2577 5.5389 13.3106 6.01866 13.3102 6.49986Z"
                                              fill="white"
                                            />
                                            <path d="M1.7719 5.4254V7.57431L0.467728 7.92933C0.257502 6.98759 0.257502 6.01108 0.467728 5.06934L1.7719 5.4254Z" fill="white" />
                                            <path d="M12.3044 9.9731C11.7888 10.7884 11.0983 11.479 10.2829 11.9946L9.61255 10.822L11.1318 9.30273L12.3044 9.9731Z" fill="white" />
                                            <path d="M4.0078 2.177L2.48853 3.69732L1.31592 3.02696C1.83165 2.21103 2.52255 1.52013 3.33849 1.00439L4.0078 2.177Z" fill="white" />
                                          </svg>
                                          {parseFloat(item.netChip) > 0 ? '+' : null}
                                          {item.netChip}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </Modal>
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            ))
          )}
        </div>
      </div>
    </Aux>
  );
};

export default History;
