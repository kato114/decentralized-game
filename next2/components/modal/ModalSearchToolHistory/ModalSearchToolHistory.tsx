import React, { FC, ReactElement, useContext, useState } from 'react';
import moment from 'moment';
import { Modal } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import styles from './ModalSearchToolHistory.module.scss';
import cn from 'classnames';

export interface ModalIceSearchToolHistoryType {
  playerAddress: string;
  gameReports: any;
  setShowingHistory: any;
  className?: string;
}

const ModalIceSearchToolHistory: FC<ModalIceSearchToolHistoryType> = ({
  playerAddress,
  gameReports,
  setShowingHistory,
  className = ''
}: ModalIceSearchToolHistoryType): ReactElement => {
  const [state] = useContext(GlobalContext);
  const [isCopied, setCopied] = useState(false);

  // helper functions
  function onCopy(playerAddress): void {
    navigator.clipboard.writeText(playerAddress);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  const defaultImgs = [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png'
  ];

  return (
    <section className={`modal-ice-search-tool component ${className}`}>
      <Modal
        className={styles.search_tool_history_modal}
        onClose={() => {
          setShowingHistory(false);
        }}
        open={true}
        close
      >
        <div className={styles.close_icon} onClick={() => setShowingHistory(false)}>
          <span className={styles.button_close}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
                fill="white"
              />
            </svg>
          </span>
        </div>

        <div className={styles.body}>
          <div className={styles.title}>
            <div className={cn('account-copy', styles.player_address)} onClick={() => onCopy(playerAddress)}>
              {state.userAddress ? (
                <p className="account-address">
                  {playerAddress}
                  <svg style={{ marginLeft: '8px' }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.54907 15.7588L10.9241 15.7588C11.7151 15.7588 12.3303 15.1143 12.3303 14.3525L12.3303 12.9463L13.7366 12.9463C14.5276 12.9463 15.1428 12.3018 15.1428 11.54L15.1428 2.16504C15.1428 1.37402 14.5276 0.758789 13.7366 0.758789L4.36157 0.758788C3.59985 0.758788 2.95532 1.37402 2.95532 2.16504L2.95532 3.57129L1.54907 3.57129C0.787355 3.57129 0.142823 4.18652 0.142823 4.97754L0.142822 14.3525C0.142822 15.1143 0.787354 15.7588 1.54907 15.7588ZM4.53735 2.16504L13.5608 2.16504C13.678 2.16504 13.7366 2.22363 13.7366 2.34082L13.7366 11.3643C13.7366 11.4521 13.678 11.54 13.5608 11.54L12.3303 11.54L12.3303 4.97754C12.3303 4.18652 11.7151 3.57129 10.9241 3.57129L4.36157 3.57129L4.36157 2.34082C4.36157 2.22363 4.44946 2.16504 4.53735 2.16504ZM1.72485 4.97754L10.7483 4.97754C10.8655 4.97754 10.9241 5.03613 10.9241 5.15332L10.9241 14.1768C10.9241 14.2646 10.8655 14.3525 10.7483 14.3525L1.72485 14.3525C1.63696 14.3525 1.54907 14.2646 1.54907 14.1768L1.54907 5.15332C1.54907 5.03613 1.63696 4.97754 1.72485 4.97754Z"
                      fill="white"

                      // fillOpacity="0.5"
                    />
                  </svg>
                </p>
              ) : null}
            </div>
            <p>Player History</p>
          </div>

          <div className={styles.history}>
            <div className={styles.header}>
              <div className={styles.address}>Date</div>
              <div className={styles.nfts}>Player Nfts</div>
              <div className={styles.net_chips_score}>Net Chips Score</div>
              <div className={styles.tier}>Leaderboard Tier</div>
              <div className={styles.challenges}>Finished Challenges</div>
            </div>
            <div className={styles.content}>
              {gameReports.map((report, index) => {
                if (report && Object.keys(report.gameplay).length > 0 && Object.getPrototypeOf(report) === Object.prototype) {
                  return (
                    <div key={index} className={styles.row}>
                      <div className={styles.address}>{moment.utc(report.gameplay.gameplayDay).format('MM/DD/YY')}</div>
                      <div className={styles.nfts} style={{ marginTop: '10px' }}>
                        {defaultImgs.map((def, i) => {
                          if (
                            report.gameplay.wearableSnapshot &&
                            report.gameplay.wearableSnapshot.wearableData.length > 0 &&
                            report.gameplay.wearableSnapshot.wearableData.length > i
                          ) {
                            return (
                              <div key={i} className={styles.nft}>
                                <img src={`${report.gameplay.wearableSnapshot.wearableData[i].image}`} />
                                <div className={styles.rank}> {report.gameplay.wearableSnapshot.wearableData[i].rank} </div>
                                <div className={styles.bottomInfo}>
                                  +{report.gameplay.wearableSnapshot.wearableData[i].bonus}%
                                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div key={i} className={styles.nft}>
                                <img src={`${def}`} />
                                <div className={styles.bottomInfo} style={{ opacity: 0.6 }}>
                                  +0%
                                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                      <div className={styles.net_chips_score}>
                        {report.gameplay.chipsWon ? (
                          <>
                            {report.gameplay.chipsWon}
                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635212177/FREE_Coin_c08hyk.png" alt="chips" />
                          </>
                        ) : (
                          '--'
                        )}
                      </div>
                      <div className={styles.tier} style={{ paddingLeft: '65px', textAlign: 'left' }}>
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175017/cup_w68eni.png" alt="xp" />
                        {report.gameplay.leaderboardPercentile + 5 <= 50
                          ? `Top ${report.gameplay.leaderboardPercentile + 5}%`
                          : `Bottom ${100 - report.gameplay.leaderboardPercentile}%`}
                      </div>
                      <div className={styles.challenges} style={{ textAlign: 'center' }}>
                        {report.gameplay.numChallengesCompleted} / 3
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </div>
      </Modal>

      {isCopied ? (
        <div className={isCopied ? 'copied-toast show' : 'copied-toast'}>
          <h3 className="copied-text">Wallet address copied!</h3>
        </div>
      ) : null}
    </section>
  );
};

export default ModalIceSearchToolHistory;
