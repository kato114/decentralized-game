import { useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Footer from 'components/home/Footer';
import Global from '../../../components/Constants';
import styles from './Amnesia.module.scss';
import { Button } from 'semantic-ui-react';
import cn from 'classnames';
import images from 'common/Images';


// AMNESIA_COMMENT: this whole file should be deleted after we are done with amnesia
const AmnesiaHome = () => {
  const [_, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    dispatch({ type: 'set_amnesia', data: true });

    return () => dispatch({ type: 'set_amnesia', data: false });
  }, []);

  return (
    <div>

      <main className={styles.container}>
        <section className={styles.top_section}>
          <div className={styles.central_container}>
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632955194/AMNESIA_3x_einmb6.png" />

            <div className={styles.buttons_container}>
              <a
                href="https://decentralgames.substack.com/embed"
                target="_blank"
              >
                <Button className={styles.black_button}>Newsletter</Button>
              </a>

              <a
                href="https://events.decentraland.org/event/?id=b4c581ab-aeca-4604-8c2e-519eade0d04e"
                target="_blank"
              >
                <Button className={styles.blue_button}>RSVP</Button>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.bottom_section}>
          <section className={styles.content_container}>
            <div className={styles.artists_container}>
              <p className={styles.artists_text}>
                The world's biggests DJs,
                <br />
                live from the metaverse.
              </p>

              <div className={styles.artists}>
                <div className={styles.artists_background_asset_1} />
                <div className={styles.artists_background_asset_2} />

                <div className={styles.artists_cards}>
                  <img
                    className={styles.anifisia}
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632934438/amnesia/Anfisia_Letyago_uw8q0f.jpg"
                  />
                  <img
                    className={styles.luciano1}
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632934438/amnesia/Luciano1_vwgk8u.jpg"
                  />
                  <img
                    className={styles.benny}
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632934438/amnesia/Benny_Benassi_itii6q.jpg"
                  />
                  <img
                    className={styles.luciano}
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632934439/amnesia/Luciano_fndcro.jpg"
                  />
                  <img
                    className={styles.paul}
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632934438/amnesia/Paul_Van_Dyk_eowhes.jpg"
                  />
                </div>
              </div>
            </div>

            <div className={styles.partners_container}>
              <h2 className={styles.title}>Launch Partners</h2>

              <div className={styles.partner_images}>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632958336/amnesia/DJenerates_hrh2r5.png" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632958336/amnesia/decrypto_ygrabn.png" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                  style={{ maxWidth: '90px' }}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1633030501/chain-smart-bsc-v_2x_1_Traced_crhqky.png" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632958336/amnesia/CoinGecko_fgiu6i.png" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632958336/amnesia/theta_wpc4kb.png" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src={images.POLYGON} alt="POLYGON" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                  style={{ width: '10%', height: '10%', alignSelf: 'center' }}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1633021946/Logo-White-NFT4metaverse_udey6z.png" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src={images.BAYC} alt="BORED APE YACHT CLUB" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1633023892/Landvault_White_pgrnkn.png" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1633024121/Imtoken_tni8m9.png" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                  style={{ maxWidth: '72px' }}
                >
                  <img src={images.DECENTRALAND} alt="DECENTRALAND" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1633456714/image_xkbtnd.png"/>
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1633456560/Rovi-White_qbba63.png" />
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1633456561/Apenft-white_txn7pl.png"/>
                </div>
                <div
                  className={cn(
                    styles.image_section,
                    ' d-flex justify-content-center mb-5'
                  )}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1633456560/Tron-White_xvwbsf.png" />
                </div>
              </div>

              <h2 className={styles.title}>Media Partners</h2>
              <div className={styles.media_partners_container}>
                <img
                  className={styles.eightbtc}
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632959145/amnesia/8btc_atozbz.png"
                />
                <img
                  className={styles.chinanews}
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632959894/amnesia/chainnews_ksvetu.png"
                />
                <img
                  className={styles.edm}
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632959146/amnesia/edm_zklmni.png"
                />
              </div>
            </div>


            <div className={styles.dates_container}>
              <img
                className={styles.phase_1}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632937683/amnesia/phase_1_asset_qxtpge.png"
              />
              <img
                className={styles.dates}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1633031982/image_5_a5ximv.png"
              />

              <div className={styles.buttons_container}>
                <a
                  href="https://decentralgames.substack.com/embed"
                  target="_blank"
                >
                  <Button className={styles.black_button}>Newsletter</Button>
                </a>

                <a
                  href="https://events.decentraland.org/event/?id=b4c581ab-aeca-4604-8c2e-519eade0d04e"
                  target="_blank"
                >
                  <Button className={styles.blue_button}>RSVP</Button>
                </a>
              </div>
            </div>

            <div className={styles.clouds_top}></div>
            <div className={styles.clouds_bottom}></div>
          </section>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default AmnesiaHome;
