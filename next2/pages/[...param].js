import { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '@/store';
import { useRouter } from 'next/router';
import Content404 from '../components/content/Content404/Content404';
import GetStarted from '../components/content/ContentStart/index.js';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Aux from '../components/_Aux';
import Global from '../components/Constants';
import Images from '../common/Images';
import Spinner from '../components/Spinner';

const Wildcard = () => {
  // dispatch affiliate referral address to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [affiliateAddress, setAffiliateAddress] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (router.query.param) {
      // test if URL parameter is valid hex string of 6 characters in length
      const parameter = router.query.param[0];
      const re = /[0-9A-Fa-f]{6}/g;

      if (router.query.param[0] === 'games' && router.query.param[1] === 'ice') {
        router.push('/ice/marketplace');
      } else if (re.test(parameter) && parameter.length === 6) {
        dispatch({
          type: 'affiliate_address',
          data: parameter
        });

        console.log('Affiliate address received: ' + parameter);
      } else {
        setAffiliateAddress(false);
      }
    }
    setIsLoading(false);
  }, [router]);

  return (
    <Layout>
      {affiliateAddress == true ? (
        <Aux>
          <Header title="Join Decentral Games with my referral link" description={Global.CONSTANTS.DESCRIPTION} image={Images.SOCIAL_SHARE_2} />

          {isLoading === true ? <Spinner background={1} /> : <GetStarted />}
        </Aux>
      ) : (
        <Aux>
          <Header title={Global.CONSTANTS.TITLE + ' | Page Not Found'} description={Global.CONSTANTS.DESCRIPTION} image={Images.SOCIAL_SHARE} />

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              textAlign: 'center'
            }}
          >
            <Content404 />
          </div>
        </Aux>
      )}
    </Layout>
  );
};

export default Wildcard;
