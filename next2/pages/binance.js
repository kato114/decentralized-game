import BinanceHome from '../components/home/Binance/index.js';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Binance = () => {
  return (
    <Layout>
      <Header title={Global.CONSTANTS.TITLE + ' | Be The House'} description={Global.CONSTANTS.DESCRIPTION} image={Images.SOCIAL_SHARE} />

      <BinanceHome />
    </Layout>
  );
};

export default Binance;
