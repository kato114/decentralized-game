import React from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/fox.json';

const FoxAnimation: React.FC = () => {
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="foxAnimation-div">
      <Lottie options={loadingOptions} height={200} width={200} />
      <p className="title">You must connect your wallet to view this page</p>
    </div>
  );
};

export default FoxAnimation;
