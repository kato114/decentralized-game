import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Link from 'next/link';
import Spinner from 'components/Spinner';
import Aux from 'components/_Aux';

const Marketplace = props => {
  // get wearable listings from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isLoading, setIsLoading] = useState(true);

  const maketState = props.maketState;

  useEffect(() => {
    // if (...) {
    setIsLoading(false);
    // }
  }, []);

  // helper functions
  function topLinks() {
    return (
      <Aux>
        <div className="account-other-tabs" id="account-mobile-tabs" style={{ marginTop: '0px' }}>
          <div className="d-flex flex-column w-200">
            <p>Decentral Games Marketplace</p>
          </div>

          <div className="ml-0">
            <span className="account-other-p d-flex justify-content-center">
              {maketState === 'newest' ? (
                <span className="account-hover active">Newest Wearables</span>
              ) : (
                <Link href="">
                  <span className="account-hover">Newest Wearables</span>
                </Link>
              )}

              {maketState === 'all' ? (
                <span className="account-hover active">All Wearables</span>
              ) : (
                <Link href="">
                  <span className="account-hover">All Wearables</span>
                </Link>
              )}

              {maketState === 'delegate' ? (
                <span className="account-hover active">Delegate Wearables</span>
              ) : (
                <Link href="">
                  <span className="account-hover">Delegate Wearables</span>
                </Link>
              )}
            </span>
          </div>
        </div>
      </Aux>
    );
  }

  return (
    <div className={`main-container ${state.appConfig.webNotice ? 'web-notice-contained' : null}`}>
      {isLoading ? (
        <Spinner background={1} />
      ) : (
        <div>
          <div className="page-container">
            <div className="account-other-inner-container">
              {topLinks()}

              {/* <div id="tx-box-history-2">
                <ContentMarketplace content={maketState} />
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
