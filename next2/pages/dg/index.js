import DAO from '../../components/home/DAO';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const DG = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | $DG'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <DAO DGState={'overview'} />
    </Layout>
  );
};

export default DG;
