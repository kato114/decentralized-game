import { Popup } from 'semantic-ui-react';
import cn from 'classnames';
import styles from './IceCheckedInTooltip.module.scss';

const IceCheckedInTooltip = () => {
  return (
    <div className={styles.fullDiv}>
      <div className={styles.imgDiv}>
        <img className={styles.img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1641401363/ICE_ENABLED_spugin.svg" />
        <Popup
          trigger={<span className={styles.tooltip} style={{ height: '12px', width: '12px' }}></span>}
          position="top left"
          hideOnScroll={true}
          className={cn('p2e_enabled_tooltip', styles.popup)}
        >
          <Popup.Content className={styles.tooltipContent}>
            <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
            <p className={styles.popup_content}>
              This wearable has been
              <br /> checked in today. If you would
              <br /> like to withdraw delegation, the
              <br /> withdrawal will be scheduled
              <br /> for after 12AM UTC.
            </p>
          </Popup.Content>
        </Popup>
      </div>
    </div>
  );
};

export default IceCheckedInTooltip;
