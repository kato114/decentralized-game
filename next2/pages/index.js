import DGHome from '../components/home/DG/index.js';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Index = () => {
  return (
    <>
      <Layout>
        <Header title={Global.CONSTANTS.TITLE + ' | Play and Earn'} description={Global.CONSTANTS.DESCRIPTION} image={Images.SOCIAL_SHARE} />
        <DGHome />
      </Layout>
    </>
  );
};

export default Index;
