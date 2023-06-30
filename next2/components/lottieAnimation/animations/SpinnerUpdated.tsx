import React from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/spinner.json';

const UpdatedSpinnerAnimation = (props: any) => {
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  // console.log(this.props.height);

  return (
    <div className="spinner-animation-div" style={{ marginRight: '0px' }}>
      <Lottie options={loadingOptions} height={props.height} width={props.width} />
    </div>
  );
};

export default UpdatedSpinnerAnimation;
