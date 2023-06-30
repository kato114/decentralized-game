import { GlobalContext } from '@/store';
import { useContext } from 'react';
import Farming from '../../components/home/Farming';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Admin = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | $DG | Admin'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userStatus >= 28 ? (
        <Farming DGState={'admin'} />
      ) : (
        <div className="account-other-inner-p">
          Please ensure you've connected using an admin wallet address
        </div>
      )}
    </Layout>
  );
};

export default Admin;
