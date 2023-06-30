import { useContext } from 'react';
import { GlobalContext } from '@/store';
import Support from '../../components/home/Support/Support';
import ToolWidget from '../../components/support/ToolWidget';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Admin = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header title={Global.CONSTANTS.TITLE + ' | Support'} description={Global.CONSTANTS.DESCRIPTION} image={Images.SOCIAL_SHARE} />

      <Support />

      {/* <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh' 
      }}>
        {state.userStatus >= 20 ? (
        <ToolWidget />) : (
          <div style={{color: 'white', fontSize: '18px'}}>
            Please ensure you've connected using an admin wallet address
          </div>
        )}
      </div> */}
    </Layout>
  );
};

export default Admin;
