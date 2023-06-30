import { Popup } from 'semantic-ui-react';
import cn from 'classnames';
import styles from './IceNeedToActivateTooltip.module.scss';

const IceNeedToActivateTooltip = () => {
  return (
    <div className={styles.fullDiv}>
      <div className={styles.imgDiv}>
        <img className={styles.img} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640055/need_to_activate_i60khg.svg" />
        <Popup
          trigger={<img className={styles.tooltip} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />}
          position="top right"
          hideOnScroll={true}
          className={cn('p2e_enabled_tooltip', styles.popup)}
        >
          <Popup.Content className={styles.tooltipContent}>
            <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
            <p className={styles.popup_content}>
              In order to earn ICE, you must
              <br /> first activate your wearable. This
              <br /> is a one time activation cost to
              <br /> pair it with the DG ecosystem.
            </p>
          </Popup.Content>
        </Popup>
      </div>
    </div>
  );
};

export default IceNeedToActivateTooltip;
