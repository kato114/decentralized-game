import React from 'react'
import { Modal } from 'semantic-ui-react';
import styles from './ModalChooseGamePlay.module.scss';

const ModalChooseGamePlay = ({
    setShowingGamePlay
}) => {

    return (
        <Modal
            className={styles.gamePlay_modal}
            onClose={() => {
                setShowingGamePlay(false)
            }}
            open={true}
            close
        >
            <div className={styles.close_icon} onClick={() => setShowingGamePlay(false)}>
                <span className={styles.button_close}>
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
                            fill="white"
                        />
                    </svg>
                </span>
            </div>

            <div className={styles.body}>
                <div className={styles.title}>
                    <h2>Choose Gameplay</h2>
                </div>
                <div className={styles.content}>
                    <div className={styles.section}>
                        <img
                            src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637263761/GamePlayDext_grjsqp.png"
                            alt=""
                            onClick={() => {
                                window.open("https://api.decentral.games/ice/play", "_blank");
                            }}
                        />
                        <h1>Play to Earn<br />ICE Poker</h1>
                        <p>Play-to-Earn, free to play poker in <br />our skyline ICE Poker Lounge.</p>
                    </div>
                    <div className={styles.section}>
                        <img
                            src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1637263761/GamePlayTominoya_shvjsc.png"
                            alt=""
                            onClick={() => {
                                window.open("https://play.decentraland.org/?position=-118%2C135&realm=dg", "_blank");
                            }}
                        />
                        <h1>Tominoya<br />Casino</h1>
                        <p>Play with free play or crypto in <br />blackjack, roulette, and slots</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalChooseGamePlay;