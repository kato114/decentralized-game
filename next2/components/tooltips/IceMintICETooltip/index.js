import styles from './IceMintIceTooltip.module.scss';

const IceMintICETooltip = () => {
  return (
    <div className={styles.stackedTooltipDiv}>
      <img className={styles.stackedTooltip} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
      <div className={styles.popup}>
        <div className={styles.tooltipContent}>
          <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
          <p className={styles.popup_content}>
            You must have your ICE on Polygon
            <br /> to mint this wearable. You can
            <br /> bridge your ICE from Mainnet to
            <br /> Polygon{' '}
            <a href="https://wallet.polygon.technology/bridge/" target="_blank">
              here.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default IceMintICETooltip;
