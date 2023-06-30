import React from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/confetti.json';

const Confetti: React.FC = (props: any) => {
  const loadingOptions = {
    loop: false,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="confetti-animation-div" style={{ position: 'absolute' }}>
      <Lottie
        options={loadingOptions}
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

export default Confetti;
