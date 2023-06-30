import React from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/404_error_2.json';

const ErrorAnimation: React.FC = () => {
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="error-animation-div">
      <Lottie options={loadingOptions} height={300} width={300} />
      <p>Please ensure you've connected using an admin wallet address</p>
    </div>
  );
};

export default ErrorAnimation;
