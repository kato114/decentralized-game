import { Popup } from 'semantic-ui-react';
import styles from './IceWearableBonusTooltip.module.scss';

const IceWearInfo = props => {
  return (
    <>
      <Popup
        trigger={
          <div className={styles.card}>
            <p>{props.bonus}</p>
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1630857308/diamond_1_1_r6etkk.png" />
          </div>
        }
        position="top center"
        on="click"
        hideOnScroll={true}
        className={styles.popup}
      >
        <Popup.Content className="iceWearableBonusTooltip">
          <img className="info" src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
          <p>This is your wearable ICE bonus. Ranges vary between rank levels.</p>
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

export default IceWearInfo;
