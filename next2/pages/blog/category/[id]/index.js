import BlogCategory from './blogCategory';
import Layout from '../../../../components/Layout.js';
import Header from '../../../../components/Header';
import Global from '../../../../components/Constants';
import Images from '../../../../common/Images';

const Index = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Blog'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <BlogCategory />
    </Layout>
  );
};

export default Index;
