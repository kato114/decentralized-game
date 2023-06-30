import { useEffect, useContext } from 'react';
import cn from 'classnames';
import { Button, Icon, Grid } from 'semantic-ui-react';
import { useMediaQuery } from 'hooks';
import Link from 'next/link';
import { GlobalContext } from '@/store';
import styles from './Footer.module.scss';
// import { useTranslation, withTranslation, Trans } from 'react-i18next';

const Footer = () => {
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let linkDocs = '';
  const mobile = useMediaQuery('(max-width: 768px)');
  const onlyTablet = useMediaQuery(
    '(min-width: 768px) and (max-width: 1200px)'
  );
  // const { t, i18n } = useTranslation();
  const DGBalances = state.DGBalances?.BALANCE_STAKING_UNISWAP;
  const DGStakingBalances = state.stakingBalances?.BALANCE_STAKED_UNISWAP;

  
  useEffect(() => {
    linkDocs = document.getElementById('docs-footer');
  }, []);

  useEffect(() => {
    if (linkDocs) {
      analytics.trackLink(linkDocs, 'Clicked DOCS link (footer)');
    }
  }, [linkDocs]);

  return (
    <>
      <div className={styles.footer_container}>
        <div className={cn(styles.grid_container, 'd-flex flex-column')}>
          <div className={styles.cryptoWidgetSection} />

          <div
            className={cn(
              'd-flex flex-md-row flex-column w-100',
              mobile ? 'mb-0' : 'mb-6'
            )}
          >
            <span className={styles.grid_column}>
              <p className={styles.footer_header}>
                {/* {t('Footer.TOKEN')}  */}
                Token
              </p>
              <Link href="/dg">
                <p className={styles.footer_link}>
                  {/* {t('Footer.DAOHOME')}  */}
                  DAO Home
                </p>
              </Link>
              <Link href="/dg/treasury">
                <p className={styles.footer_link}>
                  {/* {t('Footer.TREASURY')}  */}
                  Treasury
                </p>
              </Link>
              <Link href="/dg/governance">
                <p className={styles.footer_link}>
                  {/* {t('Footer.GOVERNANCE')}  */}
                  Governance
                </p>
              </Link>
            </span>

            <span className={styles.grid_column}>
              <p className={styles.footer_header}>
                {/* {t('Footer.ICE_POKER')}  */}
                Ice Poker
              </p>
              <Link href="/ice">
                <p className={styles.footer_link}>
                  {/* {t('Footer.PLAY')}  */}
                  Play
                </p>
              </Link>
              <Link href="/ice/start">
                <p className={styles.footer_link}>
                  Get Started
                </p>
              </Link>
              <Link href="/ice/marketplace">
                <p className={styles.footer_link}>
                  {/* {t('Footer.MARKETPLACE')}  */}
                  Marketplace
                </p>
              </Link>
            </span>

            <span className={styles.grid_column}>
              <p className={styles.footer_header}>
                {/* {t('Footer.EVENTS')}  */}
                Events
              </p>
              <Link href="/events">
                <p className={styles.footer_link}>
                  {/* {t('Footer.ALL_EVENTS')}  */}
                  All Events
                </p>
              </Link>
            </span>

            <span className={styles.grid_column}>
              <p className={styles.footer_header}>
                {/* {t('Footer.NEWS')}  */}
                News
              </p>
              <Link href="/blog">
                <p className={styles.footer_link}>
                  {/* {t('Footer.NEWS')}  */}
                  News
                </p>
              </Link>
              <Link href="/blog">
                <p className={styles.footer_link}>
                  {/* {t('Footer.BLOG')}  */}
                  Blog
                </p>
              </Link>
            </span>

            <span className={styles.grid_column}>
              <p className={styles.footer_header}>
                {/* {t('Footer.COMMUNITY')}  */}
                Community
              </p>
              <a href="https://discord.com/invite/cvbSNzY" target="_blank">
                <p className={styles.footer_link}>
                  {/* {t('Footer.DISCORD')}  */}
                  Discord
                </p>
              </a>
              <a href="https://t.me/decentralgames" target="_blank">
                <p className={styles.footer_link}>
                  {/* {t('Footer.TELEGRAM')}  */}
                  Telegram
                </p>
              </a>
            </span>

            <div className={styles.grid_newsletter}>
              <p className={styles.footer_header}>
                {/* {t('Footer.JOIN_OUR_NEWS_LETTER')}  */}
                Join Our Newsletter!
              </p>
              <Link href="/events">
                <p className={styles.footer_text}>
                  {' '}
                  {/* {t('Footer.SUBSCRIBE_TO_OUR_NEWSLETTER')}{' '} */}
                  Subscribe to our newsletter to stay up to date with our weekly updates.{' '}
                </p>
              </Link>

              <div className={styles.input_placeholder}>
                {' '}
                <Button
                  color="blue"
                  className={styles.sign_up_newsletter}
                  href="https://decentralgames.substack.com/embed"
                  target="_blank"
                >
                  {/* {t('Footer.SIGNUP_FOR_SUBSTACK')} */}
                  Sign Up For Substack
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.6152 13.2617V2.50879C17.6152 1.50977 16.9385 0.822266 15.9287 0.822266H5.16504C4.21973 0.822266 3.51074 1.54199 3.51074 2.40137C3.51074 3.26074 4.24121 3.92676 5.1543 3.92676H9.21484L12.5342 3.80859L10.6758 5.46289L1.28711 14.8623C0.932617 15.2168 0.739258 15.6357 0.739258 16.0654C0.739258 16.9033 1.52344 17.6982 2.37207 17.6982C2.80176 17.6982 3.20996 17.5049 3.5752 17.1504L12.9746 7.76172L14.6396 5.90332L14.5 9.10449V13.2725C14.5 14.1963 15.166 14.916 16.0254 14.916C16.8955 14.916 17.6152 14.1855 17.6152 13.2617Z"
                      fill="white"
                    ></path>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          {!onlyTablet && !mobile && (
            <div className={styles.cookie_container}>
              <span className={styles.copyright}>
                Copyright © 2022 Web4 LTD. All rights reserved
              </span>
              <div className="d-flex justify-content-between">
                <p className={styles.description}>
                  <a href="https://twitter.com/decentralgames" target="_blank">
                    <Icon className={styles.icon} name="twitter" />
                  </a>
                  <a href="/discord" target="_blank">
                    <Icon className={styles.icon} name="discord" />
                  </a>
                  <a href="https://t.me/decentralgames" target="_blank">
                    <Icon className={styles.icon} name="telegram" />
                  </a>
                  <a href="https://github.com/decentralgames" target="_blank">
                    <Icon className={styles.icon} name="github" />
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.grid_newsletter_tablet}>
          <p className={styles.footer_header}> Join Our Newsletter! </p>
          <Link href="/events">
            <p className={styles.footer_text}>
              {' '}
              {/* {t('Footer.SUBSCRIBE_TO_OUR_NEWSLETTER')}.{' '} */}
              Subscribe to our newsletter to stay up to date with our weekly updates.{' '}
            </p>
          </Link>

          <div className={styles.input_placeholder}>
            {' '}
            <Button
              color="blue"
              className={styles.sign_up_newsletter}
              href="https://decentralgames.substack.com/embed"
              target="_blank"
            >
              {/* {t('Footer.SIGNUP_FOR_SUBSTACK')} */}
              Sign Up For Substack
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.6152 13.2617V2.50879C17.6152 1.50977 16.9385 0.822266 15.9287 0.822266H5.16504C4.21973 0.822266 3.51074 1.54199 3.51074 2.40137C3.51074 3.26074 4.24121 3.92676 5.1543 3.92676H9.21484L12.5342 3.80859L10.6758 5.46289L1.28711 14.8623C0.932617 15.2168 0.739258 15.6357 0.739258 16.0654C0.739258 16.9033 1.52344 17.6982 2.37207 17.6982C2.80176 17.6982 3.20996 17.5049 3.5752 17.1504L12.9746 7.76172L14.6396 5.90332L14.5 9.10449V13.2725C14.5 14.1963 15.166 14.916 16.0254 14.916C16.8955 14.916 17.6152 14.1855 17.6152 13.2617Z"
                  fill="white"
                ></path>
              </svg>
            </Button>
          </div>
        </div>

        {mobile && (
          <div className={styles.cookie_container_tablet}>
            <span className={styles.copyright}>
              Copyright © 2022 Web4 LTD. All rights reserved
            </span>
          </div>
        )}
        {onlyTablet && (
          <div className={styles.cookie_container}>
            <span className={styles.copyright}>
              Copyright © 2022 Web4 LTD. All rights reserved
            </span>
            <div className="d-flex justify-content-between">
              <p className={styles.description}>
                <a href="https://twitter.com/decentralgames" target="_blank">
                  <Icon className={styles.icon} name="twitter" />
                </a>
                <a href="/discord" target="_blank">
                  <Icon className={styles.icon} name="discord" />
                </a>
                <a href="https://t.me/decentralgames" target="_blank">
                  <Icon className={styles.icon} name="telegram" />
                </a>
                <a href="https://github.com/decentralgames" target="_blank">
                  <Icon className={styles.icon} name="github" />
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Footer;
