import { Popup } from 'semantic-ui-react';
import cn from 'classnames';
import styles from './IceP2EEnabledTooltip.module.scss';

const IceP2EEnabledTooltip = () => {
  return (
    <div className={styles.fullDiv}>
      <div className={styles.imgDiv}>
        <img className={styles.img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645146487/iceenabledbanner_jvzh8u.svg" />
        <Popup
          trigger={<img className={styles.tooltip} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />}
          position="top left"
          hideOnScroll={true}
          className={cn('p2e_enabled_tooltip', styles.popup)}
        >
          <Popup.Content className={styles.tooltipContent}>
            <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
            <p className={styles.popup_content}>
              ICE enabled wearables allow
              <br /> you to earn real cash value from
              <br /> free-to-play ICE poker tables.
            </p>
          </Popup.Content>
        </Popup>
      </div>
    </div>
  );
};

export default IceP2EEnabledTooltip;
