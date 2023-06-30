import GetStarted from '../components/content/ContentStart/index.js';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Start = () => {
  return (
    <Layout>
      <Header title={Global.CONSTANTS.TITLE + ' | Get Started'} description={Global.CONSTANTS.DESCRIPTION} image={Images.SOCIAL_SHARE} />

      <GetStarted />
    </Layout>
  );
};

export default Start;
