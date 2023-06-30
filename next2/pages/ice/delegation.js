import IcePoker from '../../components/home/IcePoker/index.js';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const ICE = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Games'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <IcePoker iceState={'delegation'} />
    </Layout>
  );
};

export default ICE;