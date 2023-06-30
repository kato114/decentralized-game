import React, { ReactElement } from 'react';
import Premium from '../../components/home/Premium/Premium';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const PremiumPage = (): ReactElement => (
  <Layout>
    <Header title={Global.CONSTANTS.TITLE + ' | Premium'} description={Global.CONSTANTS.DESCRIPTION} image={Images.SOCIAL_SHARE} />

    <Premium />
  </Layout>
);

export default PremiumPage;
