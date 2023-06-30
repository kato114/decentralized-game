import { useContext } from 'react';
import { GlobalContext } from '@/store';
// import Newest from './Newest';
// import Latest from './Latest';
// import Delegate from './Delegate';

const ContentMarketplace = props => {
  // get global state from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  if (props.content === 'market') {
    return 'foo...';
  } else if (props.content === 'items') {
    return 'foo...';
  } else if (props.content === 'history') {
    return 'foo...';
  } else if (props.content === 'referrals') {
    return 'foo...';
  }
};

export default ContentMarketplace;
