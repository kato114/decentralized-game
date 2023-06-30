import AmnesiaPage from '../components/home/AmnesiaHome/index.js';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Amnesia = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Amnesia'}
        description="The world's biggests DJs, live from the metaverse Decentral Games"
        image="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1633028289/AMNESIA_virtual_DG_-_artworks_assets-03_y43zw2.png"
      />

      <AmnesiaPage />
    </Layout>
  );
};

export default Amnesia;
