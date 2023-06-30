import { GlobalContext } from '@/store';
import { useContext } from 'react';
import DAO from '../../components/home/DAO';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Aux from '../../components/_Aux';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Migration = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Aux>
        <Header
          title={Global.CONSTANTS.TITLE + ' | $DG | Token Migration'}
          description={Global.CONSTANTS.DESCRIPTION}
          image={Images.SOCIAL_SHARE}
        />

        <DAO DGState={'tokenMigration'} />
      </Aux>
    </Layout>
  );
};

export default Migration;
