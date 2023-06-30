import SubgraphData from '../../components/home/SubgraphData';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Subgraph = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Subgraph'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <SubgraphData dataType={'points'} />
    </Layout>
  );
};

export default Subgraph;
