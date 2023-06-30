import React, { FC, ReactElement, useEffect, useContext, useState } from 'react';
import Link from 'next/link';
import { GlobalContext } from '@/store';
import { Button } from 'semantic-ui-react';
import FoxAnimation from 'components/lottieAnimation/animations/Fox';
import Images from 'common/Images';
import styles from './Premium.module.scss';

export interface PremiumType {
  className?: string;
}

const Premium: FC<PremiumType> = ({ className = '' }: PremiumType): ReactElement => {
  const [state] = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(true);
  const [premiumStatus, setPremiumStatus] = useState(-1); // 0: not enough xDG, 1: enough xDG, 2: no wearable
  const [xdgTotal, setXdgTotal] = useState(0);
  const [activeWearables, setActiveWearables] = useState([]);

  useEffect(() => {
    setIsLoading(state.iceWearableItemsLoading || state.DGBalancesLoading || state.stakingBalancesLoading ? true : false);
  }, [state.iceWearableItemsLoading, state.DGBalancesLoading, state.stakingBalancesLoading]);

  useEffect(() => {
    // Get Active Wearables
    const wearables = state.iceWearableItems;
    const delegatedWearables = state.iceDelegatedItems;

    setActiveWearables(wearables);

    // Get xDG Balances
    const xdgTotal = parseFloat(state.stakingBalances.BALANCE_USER_GOVERNANCE) + parseFloat(state.DGBalances.BALANCE_CHILD_TOKEN_XDG);

    setXdgTotal(xdgTotal);

    if (wearables && wearables.length > 0 && delegatedWearables.length === 0) {
      setPremiumStatus(xdgTotal < wearables.length * 1000 ? 0 : 1);
    } else {
      setPremiumStatus(2);
    }
  }, [state.iceWearableItems, state.userIsPremium, state.stakingBalances.BALANCE_USER_GOVERNANCE, state.DGBalances.BALANCE_CHILD_TOKEN_XDG]);

  const premiumDescription = [
    {
      title: 'The Delegation Dashboard',
      description: 'See the historical performance of every player on your team.'
    },
    {
      title: 'Guild League Tournaments (Min. 5 Wearables)',
      description: 'Play against other guilds in monthly prize tournaments.'
    },
    {
      title: 'Player Look Up Tool',
      description: 'Look up past gameplay performance of any player.'
    },
    {
      title: 'Custom Guild & Player Naming',
      description: 'Make your team your own by naming everything.'
    },
    {
      title: 'Guild Manager Assignment',
      description: 'Trustlessly assign a manager to run your guild for you.'
    }
  ];

  return (
    <section className={`premium component ${className} ${styles.premium}`}>
      {!state.userLoggedIn ? (
        <FoxAnimation />
      ) : isLoading ? (
        <div className={styles.spinner_wrapper}>
          <img src={Images.LOADING_SPINNER} />
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>{premiumStatus === 0 || premiumStatus === 2 ? 'Unlock Premium Tools' : 'You Have Access to Premium!'}</h1>
            <p className={styles.description}>
              {premiumStatus === 0 || premiumStatus === 2
                ? 'Get access by holding 1,000 xDG (staked DG) per owned wearable.'
                : 'You’re currently holding 1,000 xDG per owned wearable.'}
            </p>

            {premiumStatus === 0 || premiumStatus === 2 ? (
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645450157/image_44_precz5.png" alt="premium" />
            ) : (
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645450157/Group_860_t5pfki.png" alt="premium" />
            )}
          </div>
          <div className={styles.content}>
            {premiumDescription.map((item, i) => (
              <div key={i} className={styles.row}>
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.58008 17.8262C8.26367 17.8262 8.80078 17.5625 9.17188 17.0156L18.2637 3.1582C18.5273 2.75781 18.6348 2.37695 18.6348 2.02539C18.6348 1.07812 17.9121 0.375 16.9355 0.375C16.2715 0.375 15.8516 0.619141 15.4414 1.25391L7.54102 13.7148L3.53711 8.80273C3.16602 8.35352 2.75586 8.1582 2.18945 8.1582C1.20312 8.1582 0.490234 8.86133 0.490234 9.81836C0.490234 10.248 0.617188 10.6191 0.988281 11.0391L6.02734 17.0938C6.44727 17.5918 6.93555 17.8262 7.58008 17.8262Z"
                    fill="white"
                  />
                </svg>
                <div>
                  <h1>{item.title}</h1>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.required_area}>
            {premiumStatus !== 2 ? (
              <div className={styles.card_area}>
                <div className={styles.card_area_body}>
                  <div className={styles.card}>
                    {activeWearables.length} Wearable{activeWearables.length > 1 ? 's' : ''}
                    <img className={styles.img_wearables} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645450156/Group_2_bcwugs.png" alt="wearables" />
                  </div>

                  <div className={styles.description}>
                    You own {activeWearables.length} wearable{activeWearables.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className={styles.icon}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.198 0.845999H7.876L5.83 4.19L3.806 0.845999H0.484L3.894 6.324L0.352 12H3.674L5.83 8.414L8.008 12H11.33L7.788 6.324L11.198 0.845999Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <div className={styles.card_area_body}>
                  <div className={styles.card}>
                    1000 xDG
                    <img className={styles.img_wearables} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1637260602/grayLogo_ojx2hi.png" alt="xDG" />
                  </div>

                  <div className={styles.description}>xDG Required per Wearable</div>
                </div>

                <div className={styles.icon}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.702 0.802H0.638V3.266H9.702V0.802ZM9.702 5.378H0.638V7.842H9.702V5.378Z" fill="white" />
                  </svg>
                </div>

                <div className={styles.card_area_body}>
                  {premiumStatus === 0 ? <span className={styles.not_enough}>Not Enough</span> : null}

                  <div className={styles.card}>
                    {activeWearables.length * 1000} xDG
                    <img className={styles.img_wearables} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1637260602/grayLogo_ojx2hi.png" alt="xDG" />
                  </div>

                  {premiumStatus === 0 ? (
                    <div className={styles.description}>
                      {Math.floor(xdgTotal)} xDG Held <br />
                      <abbr>(On Polygon & ETH)</abbr>
                    </div>
                  ) : (
                    <div className={styles.greenCheck}>
                      <>
                        {Math.floor(xdgTotal)} xDG Held
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M4.26904 10.0044C4.64502 10.0044 4.94043 9.85938 5.14453 9.55859L10.145 1.93701C10.29 1.7168 10.3491 1.50732 10.3491 1.31396C10.3491 0.792969 9.95166 0.40625 9.41455 0.40625C9.04932 0.40625 8.81836 0.540527 8.59277 0.889648L4.24756 7.74316L2.04541 5.0415C1.84131 4.79443 1.61572 4.68701 1.3042 4.68701C0.761719 4.68701 0.369629 5.07373 0.369629 5.6001C0.369629 5.83643 0.439453 6.04053 0.643555 6.27148L3.41504 9.60156C3.646 9.87549 3.91455 10.0044 4.26904 10.0044Z"
                            fill="#67DD6C"
                          />
                        </svg>
                        <br />
                      </>
                      <abbr>(On Polygon & ETH)</abbr>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            {premiumStatus === 0 ? (
              <Link href="/dg/governance">
                <Button className={styles.button}>
                  Stake More DG
                  <abbr>You Need {(activeWearables.length * 1000 - xdgTotal).toLocaleString()} More xDG to Unlock</abbr>
                </Button>
              </Link>
            ) : premiumStatus === 1 ? (
              <Link href="/ice">
                <Button className={styles.button}>See ICE Dashboard</Button>
              </Link>
            ) : (
              <Link href="/ice/marketplace">
                <Button className={styles.button}>
                  Get Wearables
                  <abbr>You Need Wearables to Unlock Premium</abbr>
                </Button>
              </Link>
            )}

            <div className={styles.description_area}>
              <h1>What Happens If My Holdings Drop Below The Required Amount?</h1>
              <li>
                If your holdings drop below the required xDG amount, you will lose access to the tools for the time being. Your customizations will be saved and recovered once your
                xDG holdings meet the requirement again.
              </li>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Premium;
