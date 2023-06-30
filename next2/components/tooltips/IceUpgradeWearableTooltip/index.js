import { Popup } from 'semantic-ui-react';
import cn from 'classnames';
import styles from './IceUpgradeWearableTooltip.module.scss';

const IceUpgradeWearableTooltip = () => {
  return (
    <>
      <Popup
        trigger={
          <div className={styles.wear_box_questionmark}>
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.5026 11.5C8.51864 11.5 11 9.01864 11 6.0026C11 2.98136 8.51864 0.5 5.4974 0.5C2.47617 0.5 0 2.98136 0 6.0026C0 9.01864 2.48136 11.5 5.5026 11.5ZM5.4974 4.33624C5.05097 4.33624 4.67721 3.96248 4.67721 3.51605C4.67721 3.05403 5.05097 2.69066 5.4974 2.69066C5.94384 2.69066 6.31241 3.05403 6.31241 3.51605C6.31241 3.96248 5.94384 4.33624 5.4974 4.33624ZM4.51109 8.9252C4.22039 8.9252 3.99198 8.72275 3.99198 8.41647C3.99198 8.14134 4.22039 7.91812 4.51109 7.91812H5.10807V6.07008H4.61491C4.31902 6.07008 4.0958 5.86244 4.0958 5.56654C4.0958 5.28622 4.31902 5.06819 4.61491 5.06819H5.67909C6.05286 5.06819 6.24493 5.32256 6.24493 5.71708V7.91812H6.71732C7.00802 7.91812 7.23643 8.14134 7.23643 8.41647C7.23643 8.72275 7.00802 8.9252 6.71732 8.9252H4.51109Z"
                fill="white"
              />
            </svg>
          </div>
        }
        position="bottom center"
        hideOnScroll={true}
        className={styles.popup}
      >
        <Popup.Content className={cn('iceWearableBonusTooltip', styles.content)}>
          <img className="info" src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
          <p>
            Your new ICE bonus will be
            <br /> randomly selected within the new
            <br /> rank range.
          </p>
          <div className="row">
            <div className="col-6 itemDiv">
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631126880/Group_199_kx1det.png" />
              <h3>Rank 1</h3>
              <p>+1 - 7% ICE</p>
            </div>
            <div className="col-6 itemDiv">
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631126880/Group_200_qix8og.png" />
              <h3>Rank 2</h3>
              <p>+8 - 15% ICE</p>
            </div>
            <div className="col-6 itemDiv">
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631126880/Group_201_hwr6d4.png" />
              <h3>Rank 3</h3>
              <p>+16 - 24% ICE</p>
            </div>
            <div className="col-6 itemDiv">
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631126880/Group_202_w3gv3x.png" />
              <h3>Rank 4</h3>
              <p>+25 - 34% ICE</p>
            </div>
            <div className="col-12 itemDiv">
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631126877/Group_203_egtt2n.png" />
              <h3>Rank 5</h3>
              <p>+35 - 45% ICE</p>
            </div>
          </div>
        </Popup.Content>
      </Popup>
    </>
  );
};

export default IceUpgradeWearableTooltip;
