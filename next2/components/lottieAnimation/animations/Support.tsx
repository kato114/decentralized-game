import React from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/support.json';

const SupportAnimation: React.FC = () => {
  const loadingOptions = {
    loop: false,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="support-animation-div">
      <h2 style={{ textAlign: 'center' }}>Support Tool</h2>
      <Lottie options={loadingOptions} height={300} width={300} />
    </div>
  );
};

export default SupportAnimation;
