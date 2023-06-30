import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '@/store';
import { useRouter } from 'next/router';

const Segment = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const router = useRouter();

  useEffect(() => {
    console.log('User status: ' + state.userStatus);
  }, [state.userStatus]);

  // send current page data to Segment analytics
  useEffect(() => {
    analytics.page(document.title, {});
  }, [router.pathname]);

  return null;
};

export default Segment;
