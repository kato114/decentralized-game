import React from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/star.json';

const StarAnimation: React.FC = () => {
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="star-animation-div">
      <Lottie options={loadingOptions} height={50} width={50} />
    </div>
  );
};

export default StarAnimation;
