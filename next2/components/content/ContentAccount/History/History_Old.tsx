import React, { ReactElement, useEffect, useState, useContext } from 'react';
import { GlobalContext } from '@/store';
import cn from 'classnames';
import moment from 'moment';
import { useMediaQuery } from 'hooks';
import { get, map, sumBy } from 'lodash';
import Global from 'components/Constants';
import Images from 'common/Images';
import poker from 'common/Poker';
import { Modal, Button, Grid, Table } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import styles from './History.module.scss';

const History = (): ReactElement => {
  // get user's transaction history from the Context API store
  const [state] = useContext(GlobalContext);
  const [dataHistory, dataPlay, dataPoker] = state.transactions;

  const isWideScreen = useMediaQuery('(min-width: 1010px)');
  const isTablet = useMediaQuery('(min-width: 800px)');
  const isMobile = useMediaQuery('(min-width: 576px)');

  // define local variables
  const [openId, setOpenId] = useState(null);
  const transactions = dataHistory === 'false' ? [] : dataHistory.filter(h => get(h, 'type', '').includes('Deposit') || get(h, 'type', '').includes('Withdrawal'));

  // console.log('->Data History: ', dataHistory);
  // console.log('->Transactions: ', transactions);

  const newPokerData = dataPoker.map(poker => {
    const userInfoPlayIds = map(poker.tableData, 'playerHandData.userPlayInfoID');

    return {
      ...poker,
      betAmount: sumBy(dataPlay, o => {
        if (userInfoPlayIds.includes(o._id)) {
          return o.betAmount;
        } else {
          return 0;
        }
      }),
      amountWin: sumBy(dataPlay, o => {
        if (userInfoPlayIds.includes(o._id)) {
          return o.amountWin;
        } else {
          return 0;
        }
      }),
      gameType: 9,
      coinName: 'PLAY'
    };
  });

  // console.log('->NewPokerData: ', newPokerData);

  const playData = [...(dataPlay === 'false' ? [] : dataPlay.filter(p => get(p, 'gameType', 0) < 10 && get(p, 'gameType', 0) !== 9 && p.txid !== '')), ...newPokerData].sort(
    (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
  );

  // console.log('->PlayData: ', playData);

  useEffect(() => {
    // console.log('->State.transactions[0]: ', state.transactions[0]);
  }, [state.transactions]);

  return (
    <Aux>
      <div className={styles.history_container}>
        <h1 className={styles.title}>Recent transactions</h1>
        {!transactions.length ? (
          <div className={styles.error_container}>
            <p className={styles.error_state}>No Recent Transactions</p>
          </div>
        ) : (
          <Grid>
            {transactions.map((row, i) => {
              const timestamp = moment(row.createdAt).format('MM/DD/YY hh:mm a');
              const amount = (row.amount / 100000000000000000).toFixed(2);

              return (
                <Grid.Column computer={8} tablet={16} mobile={16} key={i}>
                  <div className={styles.history_column}>
                    {row.type.includes('Deposit') ? (
                      <svg width="25" height="25" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16.5002" cy="16.5" r="16.5" fill="#1F1F1F" />
                        <path d="M21.75 22.75H11.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.75 14.5L16.5 18.25L20.25 14.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.5 18.25V9.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="25" height="25" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16.5002" cy="16.5" r="16.5" fill="#1F1F1F" />
                        <path d="M21.75 22.75H11.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.25 13L16.5 9.25L12.75 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.5 9.25L16.5 18.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span className={styles.left_column}>
                        <h2 className={styles.row_type}>{row.type}</h2>
                        <h3 className={styles.row_date}>{timestamp}</h3>
                      </span>
                      <span className={styles.right_column}>
                        <h2 className={styles.row_type} style={{ textAlign: 'right' }}>
                          {amount}
                        </h2>
                        {row.type.includes('DAI') || row.type.includes('USDT') ? (
                          <h3 className={styles.row_date} style={{ textAlign: 'right' }}>
                            ${(Number(amount) * state.DGPrices.dai).toFixed(2)}
                          </h3>
                        ) : row.type.includes('MANA') ? (
                          <h3 className={styles.row_date} style={{ textAlign: 'right' }}>
                            ${(Number(amount) * state.DGPrices.mana).toFixed(2)}
                          </h3>
                        ) : row.type.includes('ETH') ? (
                          <h3 className={styles.row_date} style={{ textAlign: 'right' }}>
                            ${(Number(amount) * state.DGPrices.eth).toFixed(2)}
                          </h3>
                        ) : (
                          <h3 className={styles.row_date} style={{ textAlign: 'right' }}>
                            ${(Number(amount) * state.DGPrices.atri).toFixed(2)}
                          </h3>
                        )}
                      </span>
                    </span>
                  </div>
                </Grid.Column>
              );
            })}
          </Grid>
        )}
      </div>

      <div className={styles.history_container}>
        <h1 className={styles.title}>Gameplay History</h1>
        <div className="tx-box-overflow">
          {playData.length === 0 ? null : (
            <Table fixed unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{ width: '140px' }}>Game</Table.HeaderCell>
                  {isTablet && <Table.HeaderCell style={{ maxWidth: '180px' }}>Bet</Table.HeaderCell>}
                  <Table.HeaderCell style={{ maxWidth: '180px' }}>Payout</Table.HeaderCell>
                  {isWideScreen && <Table.HeaderCell style={{ maxWidth: '240px' }}>Date</Table.HeaderCell>}
                  <Table.HeaderCell style={{ width: isMobile ? 220 : 120, textAlign: 'right' }}>Transactions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
          )}

          {playData.length === 0 ? (
            <div className={styles.error_container}>
              <p className={styles.error_state}>No Recent Gameplay History</p>
            </div>
          ) : (
            playData.map((row, i) => {
              const timestamp = moment(row.createdAt).format('MM/DD/YY hh:mmA');
              const amount = row.betAmount / Global.CONSTANTS.FACTOR;
              const result = row.amountWin / Global.CONSTANTS.FACTOR;
              let action = '';

              if (row.gameType === 1) {
                action = 'Slots';
              } else if (row.gameType === 8 || row.gameType === 2) {
                action = 'Roulette';
              } else if (row.gameType === 3) {
                action = 'Backgammon';
              } else if (row.gameType === 7 || row.gameType === 4) {
                action = 'Blackjack';
              } else if (row.gameType === 9) {
                action = 'Poker';
              }

              let style = '';

              {
                i % 2 === 0 ? (style = 'rgba(255, 255, 255, 0.08)') : (style = 'black');
              }

              return (
                <Table key={i} fixed unstackable>
                  <Table.Body key={i}>
                    <Table.Row style={{ background: style }}>
                      <Table.Cell style={{ width: '140px' }}>{action}</Table.Cell>
                      {isTablet && (
                        <Table.Cell style={{ maxWidth: '180px' }}>
                          {row.coinName === 'DAI' ? (
                            <img
                              src={Images.DAI_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%'
                              }}
                            />
                          ) : row.coinName === 'MANA' ? (
                            <img
                              src={Images.MANA_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%'
                              }}
                            />
                          ) : row.coinName === 'USDT' ? (
                            <img
                              src={Images.USDT_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%'
                              }}
                            />
                          ) : row.coinName === 'ATRI' ? (
                            <img
                              src={Images.ATRI_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%'
                              }}
                            />
                          ) : row.coinName === 'ETH' ? (
                            <img
                              src={Images.ETH_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%'
                              }}
                            />
                          ) : row.coinName === 'ICE' ? (
                            <img
                              src={Images.ICE_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%'
                              }}
                            />
                          ) : (
                            <img
                              src={Images.PLAY_CIRCLE}
                              style={{
                                width: '21px',
                                marginRight: '8px',
                                verticalAlign: 'middle',
                                marginTop: '-4px',
                                borderRadius: '100%'
                              }}
                            />
                          )}
                          {row.coinName === 'PLAY' ? (
                            <>
                              {amount > 0 ? `-${amount.toFixed(2)}` : amount.toFixed(2)} {row.coinName}
                            </>
                          ) : (
                            <>
                              {amount > 0 ? `-${amount}` : amount} {row.coinName}
                            </>
                          )}
                        </Table.Cell>
                      )}
                      <Table.Cell style={{ maxWidth: '180px' }}>
                        {row.coinName === 'DAI' ? (
                          <img
                            src={Images.DAI_CIRCLE}
                            style={{
                              width: '21px',
                              marginRight: '8px',
                              verticalAlign: 'middle',
                              marginTop: '-4px',
                              borderRadius: '100%'
                            }}
                          />
                        ) : row.coinName === 'MANA' ? (
                          <img
                            src={Images.MANA_CIRCLE}
                            style={{
                              width: '21px',
                              marginRight: '8px',
                              verticalAlign: 'middle',
                              marginTop: '-4px',
                              borderRadius: '100%'
                            }}
                          />
                        ) : row.coinName === 'USDT' ? (
                          <img
                            src={Images.USDT_CIRCLE}
                            style={{
                              width: '21px',
                              marginRight: '8px',
                              verticalAlign: 'middle',
                              marginTop: '-4px',
                              borderRadius: '100%'
                            }}
                          />
                        ) : row.coinName === 'ATRI' ? (
                          <img
                            src={Images.ATRI_CIRCLE}
                            style={{
                              width: '21px',
                              marginRight: '8px',
                              verticalAlign: 'middle',
                              marginTop: '-4px',
                              borderRadius: '100%'
                            }}
                          />
                        ) : row.coinName === 'ETH' ? (
                          <img
                            src={Images.ETH_CIRCLE}
                            style={{
                              width: '21px',
                              marginRight: '8px',
                              verticalAlign: 'middle',
                              marginTop: '-4px',
                              borderRadius: '100%'
                            }}
                          />
                        ) : row.coinName === 'ICE' ? (
                          <img
                            src={Images.ICE_CIRCLE}
                            style={{
                              width: '21px',
                              marginRight: '8px',
                              verticalAlign: 'middle',
                              marginTop: '-4px',
                              borderRadius: '100%'
                            }}
                          />
                        ) : (
                          <img
                            src={Images.PLAY_CIRCLE}
                            style={{
                              width: '21px',
                              marginRight: '8px',
                              verticalAlign: 'middle',
                              marginTop: '-4px',
                              borderRadius: '100%'
                            }}
                          />
                        )}
                        {row.coinName === 'PLAY' ? (
                          <>
                            {result > 0 ? `-${result.toFixed(2)}` : result.toFixed(2)} {row.coinName}
                          </>
                        ) : (
                          <>
                            {result > 0 ? `-${result}` : result} {row.coinName}
                          </>
                        )}
                      </Table.Cell>
                      {isWideScreen && <Table.Cell style={{ maxWidth: '240px' }}>{timestamp}</Table.Cell>}
                      <Table.Cell
                        style={{
                          width: isMobile ? 220 : 120,
                          textAlign: 'right'
                        }}
                      >
                        <span className="d-flex justify-content-end">
                          {row.gameType === 9 && (
                            <Modal
                              className={styles.menu_info_modal}
                              onClose={() => setOpenId(null)}
                              onOpen={() => setOpenId(row.sessionID)}
                              open={openId === row.sessionID}
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
                                <p className={styles.date}>{new Date(row.createdAt).toDateString()}</p>
                                <div className={cn('d-flex', styles.main_wrapper)}>
                                  <div className={styles.your_hand}>
                                    <p className={styles.subtitle}>Your Hand</p>
                                    {(row.tableData || []).map(item => (
                                      <div key={item} className={styles.hand_row}>
                                        {get(item, 'playerHandData.hand', []).map(card => (
                                          <img key={card} src={poker[card[1] - 1][card[0]]} />
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                  <div className={styles.table_cards}>
                                    <p className={styles.subtitle}>Table Cards</p>
                                    {(row.tableData || []).map(item => (
                                      <div key={item} className={styles.hand_row_2}>
                                        {item.communityCards.map(card => (
                                          <img key={card} src={poker[card[1] - 1][card[0]]} />
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                  <div className={styles.pay_out}>
                                    <p className={styles.subtitle}>Payout</p>
                                    {(row.tableData || []).map(item => {
                                      const userPlayInfoId = get(item, 'playerHandData.userPlayInfoID', '');

                                      const amountWin =
                                        get(
                                          dataPlay.filter(play => play._id === userPlayInfoId),
                                          '0.amountWin',
                                          0
                                        ) / Global.CONSTANTS.FACTOR;

                                      const betAmount =
                                        get(
                                          dataPlay.filter(play => play._id === userPlayInfoId),
                                          '0.betAmount',
                                          0
                                        ) / Global.CONSTANTS.FACTOR;

                                      return (
                                        <p key={item} className={styles.pay_out_call}>
                                          {row.coinName === 'DAI' ? (
                                            <img src={Images.DAI_CIRCLE} />
                                          ) : row.coinName === 'MANA' ? (
                                            <img src={Images.MANA_CIRCLE} />
                                          ) : row.coinName === 'USDT' ? (
                                            <img src={Images.USDT_CIRCLE} />
                                          ) : row.coinName === 'ATRI' ? (
                                            <img src={Images.ATRI_CIRCLE} />
                                          ) : row.coinName === 'WETH' ? (
                                            <img src={Images.ETH_CIRCLE} />
                                          ) : (
                                            <img src={Images.PLAY_CIRCLE} />
                                          )}
                                          {amountWin - betAmount > 0 ? `+${amountWin - betAmount}` : amountWin - betAmount}
                                          &nbsp;
                                          {row.coinName}
                                        </p>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </Modal>
                          )}
                          {row.coinName !== 'PLAY' ? (
                            <Aux>
                              <Button
                                href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
                                target="_blank"
                                className={styles.etherscan_button}
                                style={{ marginRight: '12px' }}
                              >
                                tx
                                <svg style={{ marginLeft: '4px' }} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z"
                                    fill="white"
                                  />
                                </svg>
                              </Button>
                            </Aux>
                          ) : null}

                          {row.coinName !== 'PLAY' ? (
                            <Aux>
                              <Button href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.ptxid}`} target="_blank" className={styles.etherscan_button_ptxid}>
                                payout
                                <svg style={{ marginLeft: '4px' }} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z"
                                    fill="white"
                                  />
                                </svg>
                              </Button>
                              <Button href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.ptxid}`} target="_blank" className="etherscan-button-mobile">
                                P Tx
                                <svg style={{ marginLeft: '4px' }} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z"
                                    fill="white"
                                  />
                                </svg>
                              </Button>
                            </Aux>
                          ) : null}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              );
            })
          )}
        </div>
      </div>
    </Aux>
  );
};

export default History;
