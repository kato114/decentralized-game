import React from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/upgrade_wearable_box.json';

const UpgradeWearableBox: React.FC = (props: any) => {
  const loadingOptions = {
    loop: false,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="upgradeWearableBox-animation-div">
      <Lottie
        options={loadingOptions}
        height={props.height}
        eventListeners={[
          {
            eventName: 'complete',
            callback: props.onCompletion //() => console.log('the animation completed:'),
          }
        ]}
      />
    </div>
  );
};

export default UpgradeWearableBox;
