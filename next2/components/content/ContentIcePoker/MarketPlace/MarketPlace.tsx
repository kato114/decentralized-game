import React, { ReactElement, useContext, useEffect, useState } from 'react';
import Carousel from './Carousel';
import { GlobalContext } from '@/store';

import cn from 'classnames';
import Fetch from '@/common/Fetch';
import Global from '@/components/Constants';

import styles from './MarketPlace.module.scss';
import 'slick-carousel/slick/slick.css';
import 'react-multi-carousel/lib/styles.css';
import 'slick-carousel/slick/slick-theme.css';

export interface ButtonProps {
  className?: string;
  onClick(): void;
}

export interface MarketPlaceType {
  className?: string;
}

const MarketPlace = (): ReactElement => {
  // dispatch new user status to Context API store
  const [state] = useContext(GlobalContext);
  const [accessories, setAccessories] = useState([]);

  let displayCollectionCounts = 4;
  const [displayCounts, setDisplayCounts] = useState(displayCollectionCounts);

  // define local variables
  const [previewLevel, setPreviewLevel] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [isIce, setIsIce] = useState(true);

  function handleScroll(): void {
    if (isIce) {
      const obj = document.getElementsByTagName('body')[0];

      if (obj.scrollHeight <= window.pageYOffset + obj.offsetHeight && displayCounts < Global.WEARABLES.length) {
        displayCollectionCounts += 4;
        setDisplayCounts(Math.min(displayCollectionCounts, Global.WEARABLES.length));

        if (displayCollectionCounts === Global.WEARABLES.length) {
          window.removeEventListener('scroll', handleScroll);
        }
      }
    }
  }

  useEffect(() => {
    (async function () {
      const accessArr = await Fetch.GET_MARKETPLACE_ACCESSORIES();

      setAccessories(accessArr);
    })();

    window.addEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.main_wrapper}>
      <span className={styles.iceWearablesMarketplace}>
        <div className={styles.header}>
          <div className={styles.header_top}>
            <div className={styles.title}>Marketplace</div>

            {state.userStatus > 14 && (
              <span className={styles.white_listed_address}>
                Whitelisted Address &nbsp;
                <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.06563 5.68435C3.28438 5.68435 3.45625 5.59998 3.575 5.42498L6.48438 0.990601C6.56875 0.862476 6.60313 0.740601 6.60313 0.628101C6.60313 0.324976 6.37188 0.0999755 6.05938 0.0999755C5.84688 0.0999755 5.7125 0.178101 5.58125 0.381226L3.05313 4.36873L1.77188 2.79685C1.65313 2.6531 1.52188 2.5906 1.34063 2.5906C1.025 2.5906 0.796875 2.8156 0.796875 3.12185C0.796875 3.25935 0.8375 3.3781 0.95625 3.51248L2.56875 5.44998C2.70313 5.60935 2.85938 5.68435 3.06563 5.68435Z"
                    fill="#1F1F1F"
                  />
                </svg>
              </span>
            )}
          </div>

          <div className={styles.desc}>
            {isIce ? (
              <>
                ICE Wearables give you access to ICE Poker tables. Learn more{' '}
                <a href="https://docs.decentral.games/" target="_blank" rel="noreferrer">
                  here.
                </a>
              </>
            ) : (
              <>Accessories add flair to your outfits. They don’t give you access to play ICE Poker.</>
            )}
          </div>

          {/* Filter by type */}
          <div className={cn(styles.filter_pills, styles.timeline)}>
            <div
              className={isIce ? styles.active : null}
              onClick={() => {
                setIsIce(true);
              }}
            >
              ICE Wearables
            </div>
            <div
              className={isIce ? null : styles.active}
              onClick={() => {
                setIsIce(false);
              }}
            >
              Accessories
            </div>
          </div>
        </div>

        <div className={styles.outter_games_container}>
          <Carousel
            isIce={isIce}
            displayCounts={displayCounts}
            setDisplayCounts={setDisplayCounts}
            previewLevel={previewLevel}
            setPreviewLevel={setPreviewLevel}
            accessories={accessories}
          />
        </div>
        {/* {openCheckEligibility && <CheckMintableModal />} */}
      </span>
    </div>
  );
};

export default MarketPlace;
