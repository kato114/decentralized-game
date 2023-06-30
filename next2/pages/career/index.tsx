import { GlobalContext } from '@/store';
import React, { ReactElement, useContext } from 'react';
import CareerComponent from '../../components/home/Career/Career';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import FoxAnimation from '../../components/lottieAnimation/animations/Fox';
import Images from '../../common/Images';

const Career = (): ReactElement => {
  // get user status from the Context API store
  const [state] = useContext(GlobalContext);

  return (
    <Layout>
      <Header title={Global.CONSTANTS.TITLE + ' | Career'} description={Global.CONSTANTS.DESCRIPTION} image={Images.SOCIAL_SHARE} />

      {state.userStatus ? (
        <CareerComponent />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>
          <FoxAnimation />
        </div>
      )}
    </Layout>
  );
};

export default Career;
