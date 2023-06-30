import { useContext } from 'react';
import { GlobalContext } from '@/store';
import Administration from '../../components/home/Administration';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Users = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Admin'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userStatus >= 28 ? (
        <Administration dataType={'users'} />
      ) : (
        <div className="account-other-inner-p">
          Please ensure you've connected using an admin wallet address
        </div>
      )}
    </Layout>
  );
};

export default Users;

