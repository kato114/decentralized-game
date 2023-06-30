import styles from './IceMintDGStackedTooltip.module.scss';

const IceMintDGStackedTooltip = () => {
  return (
    <div className={styles.stackedTooltipDiv}>
      <img className={styles.stackedTooltip} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
      <div className={styles.popup}>
        <div className={styles.tooltipContent}>
          <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
          <p className={styles.popup_content}>
            You must stake at least 1,000 xDG or <br />
            one (old) DG staked in governance <br />
            to mint a new ICE wearable. You <br />
            <a href="https://app.uniswap.org/#/swap?outputCurrency=0xee06a81a695750e71a662b51066f2c74cf4478a0" target="_blank">
              Buy DG here
            </a>{' '}
            and{' '}
            <a href="http://localhost:3000/dg/governance" target="_blank">
              stake DG here.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default IceMintDGStackedTooltip;
