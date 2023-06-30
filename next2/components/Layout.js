import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '@/store';
import { initGA, logPageView } from './Analytics';
import MenuTop from './home/MenuTop';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../public/static/css/theme';
import { GlobalStyles } from '../public/static/css/global';

const Layout = props => {
  // get theme (light or dark mode) from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // change second "lightTheme" to "darkTheme" when theme jump is fixed
  const themeMode = state.theme === 'light' ? lightTheme : lightTheme;

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA(state.userAddress, state.userStatus, 0, 0);
      window.GA_INITIALIZED = true;
    }

    logPageView();
  }, []);

  return (
    <ThemeProvider theme={themeMode}>
      <>
        <GlobalStyles />
        {typeof window === 'undefined' || typeof window.matchMedia === 'undefined' ? <></> : <MenuTop />}
        {props.children}
      </>
    </ThemeProvider>
  );
};

export default Layout;
