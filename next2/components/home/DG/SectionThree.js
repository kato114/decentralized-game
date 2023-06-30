import React from 'react';
import cn from 'classnames';
import { Button } from 'semantic-ui-react';
import { useMediaQuery } from 'hooks';
import images from 'common/Images';
import styles from './DG.module.scss';
// import { useTranslation, withTranslation, Trans } from 'react-i18next';

const FunctionThree = () => {
  const mobile = useMediaQuery('(max-width: 576px)');
  //const { t, i18n } = useTranslation();

  return (
    <>
      {/* <div className={styles.get_started}>
        <p className={styles.sub_title}>
          How to start with $DG"
        </p>
        <h2 className={styles.title}>
          Get Started
        </h2>
        <Button
          className={styles.start_here}
          href="/start"
        >
          Start Here
        </Button>
        {!mobile && (
          <video
            className={styles.dg_video}
            src="https://res.cloudinary.com/dnzambf4m/video/upload/c_scale,q_auto:best,c_crop,h_885,w_1920/v1626533688/macbook_animation_lkh0ut_1_wggkl1.webm"
            type="video/mp4"
            frameBorder="0"
            autoPlay={true}
            loop
            muted
          ></video>
        )}
      </div> */}

      <div className={styles.join}>
        <img 
          className={styles.join_img}
          src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,q_auto:best/v1629728655/party_popper_hzrf1f.png"
        />
        <h2 className={styles.title}>
          {/* {t('Home.JOIN_OUR_COMMUNITY')} */}
          Join our community!
        </h2>
        <span className={styles.button_span}>
          <Button
            className={styles.telegram}
            href="https://t.me/decentralgames"
            target="_blank"
          >
            <span style={{ display: 'flex' }}>
              <img 
                className={styles.telegram_img1}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,q_auto:best/v1629728316/Frame_psxdvb.png"
              />
              <img 
                className={styles.telegram_img2}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,q_auto:best/v1629728386/Telegram_r2qzfw.png" 
              />
            </span>
          </Button>
          <Button
            className={styles.discord}
            href="/discord"
            target="_blank"
          >
            <img 
              className={styles.discord_img}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,q_auto:best/v1629728380/Group_wa8qgf.png" 
            />
          </Button>
        </span>
      </div>
    </>
  );
};

export default FunctionThree;
