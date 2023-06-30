import { Provider } from '../store';
// import App from 'next/app';
// import './i18n';

import 'semantic-ui-css/semantic.min.css';
import 'public/static/css/fonts.css';
import 'public/static/css/agate.css';
import 'public/static/css/blog.css';
import 'public/static/css/spinner.css';
import '../styles/bootstrap-overrides.scss';
import Segment from '../components/Segment';
import Banner from '../components/banner/banner';
import UserBalances from '../store/UserBalances';
import Transactions from '../store/Transactions';
import GameRecords from '../store/GameRecords';
import ActiveStatus from '../store/ActiveStatus';
import CryptoWidget from '../store/CryptoWidget';
import UserInfo from '../store/UserInfo';
import AdminBalances from '../store/AdminBalances';
import UsersList from '../store/UsersList';
import DGBalances from '../store/DGBalances';
import PricesBreakdown from '../store/PricesBreakdown';
import NFTSPOAPS from '../store/NFTSPOAPS';
import SubgraphQuery from '../store/SubgraphQuery';
import ICEAttributes from '../store/ICEAttributes';
import UserStatus from '../store/UserStatus';
import AppConfig from '../store/AppConfig';
import { useRouter } from 'next/router';
import Socket from 'common/Socket';

function Application({ Component, pageProps, store }) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <style jsx global>{`
        body {
          background: black;
        }
      `}</style>
      <Banner />
      <Segment />
      <Component {...pageProps} />
      {/* </>
      )} */}

      <Socket />
      <AppConfig />
      <CryptoWidget pathName={router.pathname} />
      <UserBalances />
      <Transactions />
      <GameRecords />
      <ActiveStatus />
      <UserInfo />
      <AdminBalances />
      <UsersList />
      <DGBalances />
      <PricesBreakdown />
      <NFTSPOAPS />
      <SubgraphQuery />
      <ICEAttributes />
      <UserStatus />
    </Provider>
  );
  // }
}

export default Application;
