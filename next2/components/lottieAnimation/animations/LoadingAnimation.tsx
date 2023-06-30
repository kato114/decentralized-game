import React from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/spinner.json';

const LoadingAnimation = () => {
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div>
      <Lottie options={loadingOptions} height={30} width={30} />
    </div>
  );
};

export default LoadingAnimation;
