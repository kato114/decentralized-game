import React from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/hourglass.json';

const HourglassAnimation: React.FC = () => {
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Lottie options={loadingOptions} height={120} width={120} />
    </div>
  );
};

export default HourglassAnimation;
