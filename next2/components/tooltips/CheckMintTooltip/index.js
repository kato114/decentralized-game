import styles from './CheckMintTooltip.module.scss';
import { Popup } from 'semantic-ui-react';

const CheckMintTooltip = props => {
  return (
    <>
      <Popup
        trigger={
          <div className={styles.question_mark}>
            <svg width="8" height="9" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.5026 11.5C8.51864 11.5 11 9.01864 11 6.0026C11 2.98136 8.51864 0.5 5.4974 0.5C2.47617 0.5 0 2.98136 0 6.0026C0 9.01864 2.48136 11.5 5.5026 11.5ZM5.4974 4.33624C5.05097 4.33624 4.67721 3.96248 4.67721 3.51605C4.67721 3.05403 5.05097 2.69066 5.4974 2.69066C5.94384 2.69066 6.31241 3.05403 6.31241 3.51605C6.31241 3.96248 5.94384 4.33624 5.4974 4.33624ZM4.51109 8.9252C4.22039 8.9252 3.99198 8.72275 3.99198 8.41647C3.99198 8.14134 4.22039 7.91812 4.51109 7.91812H5.10807V6.07008H4.61491C4.31902 6.07008 4.0958 5.86244 4.0958 5.56654C4.0958 5.28622 4.31902 5.06819 4.61491 5.06819H5.67909C6.05286 5.06819 6.24493 5.32256 6.24493 5.71708V7.91812H6.71732C7.00802 7.91812 7.23643 8.14134 7.23643 8.41647C7.23643 8.72275 7.00802 8.9252 6.71732 8.9252H4.51109Z"
                fill="white"
              />
            </svg>
          </div>
        }
        position="top center"
        hideOnScroll={true}
        className={styles.popup}
        hoverable
      >
        <Popup.Content className="checkMintTooltip">
          <div className="tooltip_body">
            <img className="info" src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />

            {!props.staking ? (
              <p>
                You must have your ETH on Polygon to mint this wearable. You can bridge your ETH from Mainnet to Polygon{' '}
                <a href="https://wallet.polygon.technology/bridge/" target="_blank">
                  here
                </a>
                .
              </p>
            ) : (
              <p>
                You must have at least 1000 xDG or one (Old) DG staked in governance to mint a new ICE wearable. You
                <a href="https://app.uniswap.org/#/swap?outputCurrency=0x4b520c812e8430659fc9f12f6d0c39026c83588d" target="_blank">
                  {' '}
                  can buy DG here
                </a>{' '}
                and{' '}
                <a href="/dg/governance" target="_blank">
                  you can stake DG here
                </a>
                .
              </p>
            )}
          </div>
        </Popup.Content>
      </Popup>
    </>
  );
};

export default CheckMintTooltip;
