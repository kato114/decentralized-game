import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '@/store';
import cn from 'classnames';
import { Grid, Image, Button } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import styles from './Start.module.scss';
import Footer from '../../home/Footer/index.js';
import ButtonConnect from "../../button/ButtonConnect";

function Start() {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);

  useEffect(() => {
    if (state.userStatus) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

  return (
    <Aux>
      <div className={styles.start_container}>
        <div className={styles.image_container}>
          <img className={styles.start_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627297928/Group_14_h354db.png" />
        </div>

        <div className={styles.text_container}>
          <h1 className={styles.start_header}>
            Get Started with DG
          </h1>
          <p className={styles.start_p}>
            In just 3 steps, you can play in the first ever Metaverse casino
            (and <i> be the house </i>, if you're into that).
          </p>
        </div>

        <div className={styles.steps_container}>
          <div className={styles.step}>
            <img className={styles.img_step} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298553/Rectangle_iptbe4.png" />
            {metamaskEnabled ? (
              <img className={styles.check} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627301200/Green_Check_iahexg.png" />
            ) : (
              null
            )}
            <h2 className={styles.header_step}>
              Connect <br /> Wallet
            </h2>
            {metamaskEnabled ? (
              <Button 
                disabled
                className={styles.button_step}
              >
                Connect
              </Button>
            ) : (
              <div className={styles.mobile_hide}>
                <ButtonConnect showAlternateButton={true}/>
              </div>
            )}
          </div>

          <img className={styles.img_dot} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298554/Ellipse_1_vhdhe0.png" />
          <img className={styles.img_dot} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298554/Ellipse_1_vhdhe0.png" />
          <img className={styles.img_dot} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298554/Ellipse_1_vhdhe0.png" />
          <img className={styles.img_dot_last} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298554/Ellipse_1_vhdhe0.png" />

          <div className={styles.step}>
            <img className={styles.img_step} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298553/Rectangle_1_mbtx0j.png" />

            <div className={styles.optional_block}>
              <p className={styles.optional_text}> Optional </p>
            </div>

            <h2 className={styles.header_step}>
              Transfer Funds to Polygon Network
            </h2>
            {metamaskEnabled ? (
              <Button 
                href="/account"
                className={styles.button_step}
              >
                Transfer
              </Button>
            ) : (
              <Button 
                disabled
                className={styles.button_step}
              >
                Transfer
              </Button>
            )}
          </div>

          <img className={styles.img_dot} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298554/Ellipse_1_vhdhe0.png" />
          <img className={styles.img_dot} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298554/Ellipse_1_vhdhe0.png" />
          <img className={styles.img_dot} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298554/Ellipse_1_vhdhe0.png" />
          <img className={styles.img_dot_last} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298554/Ellipse_1_vhdhe0.png" />

          <div className={styles.step}>
            <img className={styles.img_step} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627298553/Rectangle_2_vaujek.png" />
            <h2 className={styles.header_step}>
              Play in the Metaverse
            </h2>
            {metamaskEnabled ? (
              <Button 
                href="https://play.decentraland.org/?position=-118%2C135&realm=dg-diamond"
                target="_blank"
                className={styles.button_step}
              >
                Play
              </Button>
            ) : (
              <Button 
                disabled
                className={styles.button_step}
              >
                Play
              </Button>
            )}
          </div>
        </div>

        <a href="https://docs.decentral.games/getting-started" target="_blank">
          <div className={styles.more}>
            <svg style={{ margin: '20px 8px 0px 0px' }} width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.67969 17.1406C13.2188 17.1406 16.9531 13.4062 16.9531 8.86719C16.9531 4.32031 13.2188 0.585938 8.67188 0.585938C4.125 0.585938 0.398438 4.32031 0.398438 8.86719C0.398438 13.4062 4.13281 17.1406 8.67969 17.1406ZM8.67188 6.35938C8 6.35938 7.4375 5.79688 7.4375 5.125C7.4375 4.42969 8 3.88281 8.67188 3.88281C9.34375 3.88281 9.89844 4.42969 9.89844 5.125C9.89844 5.79688 9.34375 6.35938 8.67188 6.35938ZM7.1875 13.2656C6.75 13.2656 6.40625 12.9609 6.40625 12.5C6.40625 12.0859 6.75 11.75 7.1875 11.75H8.08594V8.96875H7.34375C6.89844 8.96875 6.5625 8.65625 6.5625 8.21094C6.5625 7.78906 6.89844 7.46094 7.34375 7.46094H8.94531C9.50781 7.46094 9.79688 7.84375 9.79688 8.4375V11.75H10.5078C10.9453 11.75 11.2891 12.0859 11.2891 12.5C11.2891 12.9609 10.9453 13.2656 10.5078 13.2656H7.1875Z" fill="white"/>
            </svg>
            <p className={styles.more_text}>
              Get More Detailed Steps
            </p>
          </div>
        </a>
      </div>

      <Footer />
    </Aux>
  );
}

export default Start;
