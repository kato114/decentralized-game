import { useContext, useEffect } from 'react';
import { GlobalContext } from '@/store';
import Fetch from '../common/Fetch';

function AppConfig() {
  // dispatch user's status value to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    fetchData();
  }, []);

  // fetch user status
  async function fetchData() {
    const response = await getAppConfig();

    if (response) {
      dispatch({
        type: 'app_config',
        data: response
      });
    }
  }

  async function getAppConfig() {
    try {
      const appConfig = await Fetch.APP_CONFIG();
      console.log('APP_CONFIG (appConfig): ', appConfig);

      return appConfig;
    } catch (e) {
      console.error(`Couldn't get appConfig`);
      return;
    }
  }

  return null;
}

export default AppConfig;
