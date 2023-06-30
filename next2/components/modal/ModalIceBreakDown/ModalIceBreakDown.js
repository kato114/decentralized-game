import React from 'react';
import { Modal } from 'semantic-ui-react';
import styles from './ModalIceBreakDown.module.scss';

const ModalIceBreakDown = ({ history, setShowingBreakDown }) => {
  const defaultImgs = [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175172/playerStatsItemBg_mhds5h.png'
  ];

  function displayNickName(record) {
    return record.delegateNickname
      ? record.delegateNickname.length > 10
        ? record.delegateNickname.substr(0, 9) + '...'
        : record.delegateNickname
      : record.address.substr(0, 5) + '...' + record.address.substr(record.address.length - 4, record.address.length);
  }

  return (
    <>
      <Modal
        className={styles.breakdown_modal}
        onClose={() => {
          setShowingBreakDown(-1);
        }}
        open={true}
        close
      >
        <div className={styles.close_icon} onClick={() => setShowingBreakDown(-1)}>
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
            <h2>{history.type} Breakdown</h2>
            <p>{history.date}</p>
          </div>

          <div className={styles.history}>
            <div className={styles.header}>
              <div className={styles.address}>Address</div>
              <div className={styles.nfts}>NFTS Worn</div>
              <div className={styles.iceEarned}>ICE Earned</div>
              <div className={styles.xpEarned}>XP Earned</div>
              <div className={styles.tier}>Leaderboard Tier</div>
            </div>
            <div className={styles.content}>
              {history.records.map((record, index) => (
                <div key={index} className={styles.row}>
                  <div className={styles.address}>{displayNickName(record)}</div>
                  <div className={styles.nfts} style={{ marginTop: '10px' }}>
                    {defaultImgs.map((def, i) => {
                      if (record.wearableSnapshot && record.wearableSnapshot.wearableData.length > 0 && record.wearableSnapshot.wearableData.length > i) {
                        return (
                          <div key={i} className={styles.nft}>
                            <img src={`${record.wearableSnapshot.wearableData[i].image}`} />
                            <div className={styles.rank}> {record.wearableSnapshot.wearableData[i].rank} </div>
                            <div className={styles.bottomInfo}>
                              +{record.wearableSnapshot.wearableData[i].bonus}%
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
                  <div className={styles.iceEarned} style={{ paddingLeft: '53px', textAlign: 'left' }}>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                    {history.type === 'Gameplay' ? record.iceEarnedPlayer : record.iceEarnedDelegator} ICE
                  </div>
                  <div className={styles.xpEarned} style={{ paddingLeft: '60px', textAlign: 'left' }}>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_XP_ICN_f9w2se.svg" alt="xp" />
                    {history.type === 'Gameplay' ? history.xpEarned : record.xpEarned} XP
                  </div>
                  <div className={styles.tier} style={{ paddingLeft: '65px', textAlign: 'left' }}>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637175017/cup_w68eni.png" alt="xp" />
                    {record.leaderboardPercentile + 5 <= 50 ? `Top ${record.leaderboardPercentile + 5}%` : `Bottom ${100 - record.leaderboardPercentile}%`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalIceBreakDown;
