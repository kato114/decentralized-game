import { Popup } from 'semantic-ui-react';
import cn from 'classnames';
import styles from './AccessoryTooltip.module.scss';

const AccessoryTooltip = () => {
  return (
    <div className={styles.fullDiv}>
      <div className={styles.imgDiv}>
        <img className={styles.img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1646762021/accessory-banner1_ouaqux.svg" />
        <Popup
          trigger={<img className={styles.tooltip} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />}
          position="top left"
          hideOnScroll={true}
          className={cn('p2e_enabled_tooltip', styles.popup)}
        >
          <Popup.Content className={styles.tooltipContent}>
            <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
            <p className={styles.popup_content}>
              Accessories are purely cosmetic.
              <br /> They do not give you access to ICE Poker tables.
            </p>
          </Popup.Content>
        </Popup>
      </div>
    </div>
  );
};

export default AccessoryTooltip;
