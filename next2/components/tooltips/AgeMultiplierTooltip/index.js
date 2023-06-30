import { Popup } from 'semantic-ui-react';
import styles from './AgeMultiplierTooltip.module.scss';

const AgeMultiplierTooltip = () => {
  return (
    <Popup
      trigger={<img className={styles.tooltip} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />}
      position="right center"
      hideOnScroll={true}
      className={styles.popup}
    >
      <Popup.Content className={styles.tooltipContent}>
        <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
        <p className={styles.popup_content}>
          Your account page multiplier
          <br /> increments up with daily check-ins.
          <br /> Check in 10 days to get max rewards.
        </p>
      </Popup.Content>
    </Popup>
  );
};

export default AgeMultiplierTooltip;
