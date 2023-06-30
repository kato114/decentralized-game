import React from 'react';

const NoResult: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1644858496/image_40_woadzu.png" height={200} width={200} />
      </div>
      <h3 className="title" style={{ textAlign: 'center' }}>
        No Result
      </h3>
    </div>
  );
};

export default NoResult;
