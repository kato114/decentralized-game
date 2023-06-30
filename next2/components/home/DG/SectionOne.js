import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Button, Grid } from 'semantic-ui-react';
import cn from 'classnames';
import { useMediaQuery } from 'hooks';
import Fetch from '../../../common/Fetch';
import Aux from 'components/_Aux';
import ModalChooseGamePlay from 'components/modal/ModalChooseGamePlay';
import SpinnerAnimation from 'components/lottieAnimation/animations/Spinner';
import styles from './DG.module.scss';
import { formatBigNumber } from '@/common/utils';
// import { useTranslation, withTranslation, Trans } from 'react-i18next';

function SectionOne(props) {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [showGamePlay, setShowingGamePlay] = useState(false);
  const [dgTreasury, setDgTreasury] = useState(-1);
  const [monthlyRevenue, setMonthlyRevenue] = useState(-1);
  const [dgHolders, setDgHolders] = useState(-1);
  const [monthlyVisitors, setMonthlyVisitors] = useState(-1);
  const mobile = useMediaQuery('(max-width: 576px)');

  useEffect(async () => {
    let response = await Fetch.GET_FRONTPAGE_STATS();
    if (response) {
      setDgTreasury(response.treasuryTotal);
      setMonthlyRevenue(response.monthlyRevenue);
      setDgHolders(response.dgHolders);
      setMonthlyVisitors(response.monthlyVisitors);
    }
  }, [state.appConfig]);

  return (
    <Aux>
      <video
        className={styles.video}
        id="my-video"
        src="https://res.cloudinary.com/dnzambf4m/video/upload/v1641930582/ICE_Landing_Page_rusy2d.webm"
        type="video/mp4"
        frameBorder="0"
        autoPlay={props.autoPlay}
        loop
        muted
      ></video>

      <div className={cn(styles.home_dashboard_content, 'container-fluid')}>
        <div className={cn('row', styles.row, mobile ? 'text-center' : 'text-left')}>
          <div className="col-md-12 col-lg-9 d-flex flex-column">
            <h1>
              {' '}
              {/* { t('Home.PLAY') } */}
              Play & earn gaming {mobile ? <br /> : null} in the metaverse
            </h1>
            <p className={cn(styles.content, mobile ? 'px-6 mx-auto' : 'px-0')}>
              We build games that reward you to play. Play, earn, and scale your own metaverse guild. ICE Poker beta is now live.
            </p>
            <span className={styles.button_group}>
              <Button color="blue" className={styles.earn_dg_button} href="https://decentral.games/ice/start" target="_blank">
                Get Started
              </Button>
              <Button
                color="blue"
                className={styles.play_button}
                onClick={() => {
                  window.open('https://api.decentral.games/ice/play', '_blank');
                }}
                disabled={mobile}
                // href="https://play.decentraland.org/?position=-118%2C135&realm=dg"
                target="_blank"
              >
                Play Now {mobile ? '(Desktop Only)' : ''}
              </Button>
            </span>
          </div>
        </div>

        <Grid className={styles.bottomRow}>
          <Grid.Row>
            <Grid.Column className={styles.section} computer={4} tablet={4} mobile={8}>
              {dgTreasury === -1 ? (
                <section style={{ marginBottom: '20px' }}>
                  <SpinnerAnimation />
                </section>
              ) : (
                <h1>${formatBigNumber(dgTreasury)}</h1>
              )}
              <p className={styles.color1}>In DG Treasury</p>
            </Grid.Column>
            <Grid.Column className={styles.section} computer={4} tablet={4} mobile={8}>
              {monthlyRevenue === -1 ? (
                <section style={{ marginBottom: '20px' }}>
                  <SpinnerAnimation />
                </section>
              ) : (
                <h1>${formatBigNumber(monthlyRevenue)}</h1>
              )}
              <p className={styles.color2}>Revenue Last Month</p>
            </Grid.Column>
            <Grid.Column className={styles.section} computer={4} tablet={4} mobile={8}>
              {monthlyVisitors === -1 ? (
                <section style={{ marginBottom: '20px' }}>
                  <SpinnerAnimation />
                </section>
              ) : (
                <h1>
                  {formatBigNumber(monthlyVisitors)} <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1641876355/user_z93mel.png" alt="user" />
                </h1>
              )}
              <p className={styles.color3}>Monthly Metaverse Visitors</p>
            </Grid.Column>
            <Grid.Column className={styles.section} computer={4} tablet={4} mobile={8}>
              {dgHolders === -1 ? (
                <section style={{ marginBottom: '20px' }}>
                  <SpinnerAnimation />
                </section>
              ) : (
                <h1>
                  {formatBigNumber(dgHolders)} <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1641876355/wallet_gqjtbf.png" alt="wallet" />
                </h1>
              )}
              <p className={styles.color4}>Wallets Holding DG</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {/*<p className={styles.chevron_down}>
          <Icon name="chevron down" />
        </p>*/}
      </div>

      {showGamePlay ? <ModalChooseGamePlay setShowingGamePlay={setShowingGamePlay} /> : null}
    </Aux>
  );
}

export default SectionOne;
