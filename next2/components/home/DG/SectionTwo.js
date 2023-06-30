import { Button } from 'semantic-ui-react';
import cn from 'classnames';
import { Grid } from 'semantic-ui-react';
import { useMediaQuery } from 'hooks';
import Aux from 'components/_Aux';
import images from 'common/Images';
import styles from './DG.module.scss';
// import { useTranslation, withTranslation, Trans } from 'react-i18next';

function SectionTwo() {
  const mobile = useMediaQuery('(max-width: 767px)');
  const isSmallDevice = useMediaQuery('(max-width: 576px)');
  const tablet = useMediaQuery('(max-width: 992px)');
  // const { t, i18n } = useTranslation();

  return (
    <Aux>
      <div className={cn(styles.section_two, 'container-fluid')}>
        <section className={styles.backedBy}>
          <p className={styles.title}>
            BACKED BY
          </p>

          <Grid>
            <Grid.Row>
              <Grid.Column className={styles.section} computer={2} tablet={4} mobile={8}>
                <img src={images.C_C} alt="C+C" />
              </Grid.Column>
              <Grid.Column className={styles.section} computer={2} tablet={4} mobile={8}>
                <img src={images.BINANCE} alt="BINANCE" />
              </Grid.Column>
              <Grid.Column className={styles.section} computer={2} tablet={4} mobile={8}>
                <img src={images.POLYGON} alt="POLYGON" />
              </Grid.Column>
              <Grid.Column className={styles.section} computer={2} tablet={4} mobile={8}>
                <img src={images.DCG} alt="DCG" />
              </Grid.Column>
              <Grid.Column className={styles.section} computer={2} tablet={4} mobile={8}>
                <img src={images.DECENTRALAND} alt="DECENTRALAND" />
              </Grid.Column>
              <Grid.Column className={styles.section} computer={2} tablet={4} mobile={8}>
                <img src={images.CLUSTER} alt="CLUSTER" />
              </Grid.Column>
              <Grid.Column className={styles.section} computer={2} tablet={4} mobile={8}>
                <img src={images.HASHKEY} alt="HASHKEY" />
              </Grid.Column>
              <Grid.Column className={styles.section} computer={2} tablet={4} mobile={8}>
                <img src={images.GBV} alt="GBV" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </section>

        <div className={styles.tout_container}>
          <p className={styles.tout_subTitle}>DECENTRAL GAMES ICE POKER</p>
          <h1 className={styles.tout_h1}>
            Get Wearable &nbsp;{"->"}&nbsp;{mobile && (<br />)}  Play Free Poker &nbsp;{"->"} &nbsp;Earn ICE</h1>
          <div>
            {!mobile && (
              <video
                className={styles.tout_image}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1641930738/ICE_Poker_Table_Home_Page_3_iufyq3.webm"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
            )}
            {mobile && (
              <img
                className={styles.tout_image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1641906605/icePokerTable_c1ilew.png"
                alt="img"
              />
            )}
          </div>
          <p className={styles.tout_p}>
            Play to earn with free play poker in the metaverse or in your web browser. Metaverse beta is now live!
          </p>
          <span className={styles.tout_span}>
            <Button className={styles.grey_button} href="/ice/start">
              Get Started
            </Button>
            <Button
              className={styles.blue_button}
              href="https://api.decentral.games/ice/play"
              target="_blank"
              disabled={isSmallDevice}
            >
              Play Now {isSmallDevice ? '(Desktop Only)': ''}
            </Button>
          </span>

          {/* <a href="https://docs.decentral.games/" target="_blank">
            <p className={styles.wp_text}>
              Read Whitepaper
              <svg
                style={{ margin: '0px 0px -1px 4px' }}
                width="10"
                height="10"
                viewBox="0 0 13 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z"
                  fill="white"
                />
              </svg>
            </p>
          </a> */}
        </div>

        <div
          className={cn(
            'row flex-md-row flex-column-reverse',
            styles.section_two_one,
            styles.image_span,
            styles.text_group
          )}
        >
          <div
            className={cn(
              mobile
                ? 'col-md-6'
                : 'col-md-6 d-flex flex-column justify-content-center'
            )}
            style={{ position: 'relative', zIndex: '3' }}
          >
            <h1 className={styles.section_h1}>
              {/* {t('Home.PLAYTOEARN')} */}
              Borrow a wearable for free.<br />
              Play free poker. Start earning.
            </h1>
            <p className={styles.section_p}>
              {/* {t('Home.PLAY_GAMES_META')} */}
              You can play ICE Poker and earn without buying an NFT. Find a lender (delegator) in our discord.
            </p>

            <span className={styles.button_span}>
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/ice-wearables"
                target="_blank"
              >
                Learn More
              </Button>
              <Button
                className={styles.blue_button}
                href="https://discord.com/invite/cvbSNzY"
                target="_blank"
              >
                {
                  mobile
                    ? 'Find a Lender (Delegator)' // t('Home.GAMES')
                    : 'Find a Lender' // t('Home.SEEGAMES')
                }
              </Button>
            </span>
          </div>
          <div
            className={
              mobile
                ? 'col-xs d-flex justify-content-center'
                : 'col-md-6 d-flex justify-content-center'
            }
          >
            {!mobile && (
              <video
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1641930581/Wearable_Tout_Floater_gyks3a.webm"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
            )}
            {mobile && (
              <img
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1641908235/iceWearable_mcr5kd.png"
                alt="img"
              />
            )}
          </div>
        </div>
      </div>

      <div className={cn(styles.section_two_second, 'container-fluid')}>
        <div className={cn('row', styles.image_span)}>
          <div
            className={
              mobile
                ? 'col-xs d-flex justify-content-center'
                : 'col-md-5 d-flex'
            }
          >
            {!mobile && (
              <video
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1641930583/Delegation_Stats_ub09zu.webm"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
            )}
            {mobile && (
              <img
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1641906605/Deposit_Modal_edwr9p.png"
                alt="img"
              />
            )}
          </div>

          <div
            className={cn(
              styles.text_group,
              mobile
                ? 'col-md-7'
                : 'col-md-7 d-flex flex-column justify-content-center'
            )}
            style={{ position: 'relative', zIndex: '3' }}
          >
            <h1 className={styles.section_h1}>
              {/* {t('Home.EARNAPY')} */}
              Lend out your NFTs for passive earning.
              {mobile ? null : ' All while your assets stay in your wallet.'}
            </h1>
            <p className={styles.section_p}>
              {/* {t('Home.STAKE_DG_GOVERNANCE')} */}
              As an ICE Wearable owner, you can build your own team of poker players. Measure performance and manage your very own ICE generating guild—all while everything remains in your wallet.
            </p>

            <span className={styles.button_span}>
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/ice-wearables"
                target="_blank"
              >
                Learn More
              </Button>
              <Button
                className={styles.blue_button}
                href="/ice/marketplace"
              >
                Browse Wearables
              </Button>
            </span>
          </div>
        </div>
      </div>

      <div className={cn(styles.section_two, 'container-fluid')}>
        <div
          className={cn(
            'row flex-md-row flex-column-reverse',
            styles.image_span,
            styles.text_group
          )}
        >
          <div
            className={cn(
              mobile
                ? 'col-md-6'
                : 'col-md-6 d-flex flex-column justify-content-center'
            )}
            style={{ position: 'relative', zIndex: '3' }}
          >
            <h1 className={styles.section_h1}>
              Stake DG. Vote in the DAO. {/* {t('Home.VOTE_IN_THE_DAO')}  */}
            </h1>
            <p className={styles.section_p}>
              {/* {t('Home.WITH_THE_DG_DAO')} */}
              Govern the DG Treasury and vote on proposals for new games and features.
            </p>

            <span className={styles.button_span}>
              <Button className={styles.blue_button} href="/dg/">
                Explore Treasury
              </Button>
            </span>
          </div>
          <div
            className={
              mobile
                ? 'col-xs d-flex justify-content-center'
                : 'col-md-6 d-flex justify-content-center'
            }
          >
            {!mobile && (
              <video
                className={cn(mobile ? styles.image_mobile : styles.image)}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/c_scale,q_auto:best/v1626798440/Vote_ydj8br.webm"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
            )}
            {mobile && (
              <img
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,q_auto:best/v1626804590/Screen_Shot_2021-07-17_at_5.45.16_PM_fo1juv.png"
                alt="img"
              />
            )}
          </div>
        </div>
      </div>
    </Aux>
  );
}

export default SectionTwo;
