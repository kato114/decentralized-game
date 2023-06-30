import ReactGA from 'react-ga';
import Global from './Constants';

export const initGA = (userAddress, userStatus, winningsDAI, winningsMANA) => {
  ReactGA.initialize(Global.KEYS.GOOGLE_ANALYTICS, {
    debug: false,
    titleCase: false,
    gaOptions: {
      dimension1: userAddress,
      dimension2: userStatus,
      dimension3: winningsDAI,
      dimension4: winningsMANA
    }
  });
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
