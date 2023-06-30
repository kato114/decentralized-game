import React from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/sad_emoji.json';

const SadEmojiAnimation = () => {
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="sadEmoji-animation-div">
      <Lottie options={loadingOptions} height={30} width={30} />
    </div>
  );
};

export default SadEmojiAnimation;
