import { GlobalContext } from '@/store';
//import { useContext } from 'react';
import React, { useContext, useEffect } from 'react';
import AccountData from '../../components/home/AccountData';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import FoxAnimation from '../../components/lottieAnimation/animations/Fox';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Account = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header title={Global.CONSTANTS.TITLE + ' | Account | Balances'} description={Global.CONSTANTS.DESCRIPTION} image={Images.SOCIAL_SHARE} />

      {state.userStatus ? (
        <AccountData dataType="ice" />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>
          <FoxAnimation />
        </div>
      )}
    </Layout>
  );
};

export default Account;
