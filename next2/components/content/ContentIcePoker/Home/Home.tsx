import React, { ReactElement, useState, useContext, useEffect } from 'react';
import { GlobalContext } from '@/store';
import { useMediaQuery } from 'hooks';
import MobileScreen from './MobileScreen/MobileScreen';
import Newbie from './Newbie/Newbie';
import Delegate from './Delegate/Delegate';
import NonPremiumOwner from './NonPremiumOwner/NonPremiumOwner';
import PremiumOwner from './PremiumOwner/PremiumOwner';
import FoxAnimation from 'components/lottieAnimation/animations/Fox';
import Images from 'common/Images';
import styles from './Home.module.scss';

export interface HomeProps {
  content?: any;
}

const IceHome = (): ReactElement => {
  // get delegation data from the Context API store
  const [state] = useContext(GlobalContext);

  // define local variables
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(0);
  const isMobile = useMediaQuery('(max-width: 576px)');

  useEffect(() => {
    setIsLoading(state.iceWearableItemsLoading || state.iceDelegatedItemsLoading || state.DGBalancesLoading || state.stakingBalancesLoading ? true : false);
  }, [state.iceWearableItemsLoading, state.iceDelegatedItemsLoading, state.DGBalancesLoading, state.stakingBalancesLoading]);

  useEffect(() => {
    // Get Active Wearables, Delegate Wearables
    const activeWearables = state.iceWearableItems.filter(item => item.isActivated && item.bonus > 0);
    const delegatedWearables = state.iceDelegatedItems;

    // Newbie
    if (activeWearables.length === 0 && delegatedWearables.length === 0) {
      setStep(0);

      return;
    }

    // Delegate
    if (delegatedWearables.length > 0) {
      setStep(1);

      return;
    }

    if (activeWearables.length > 0) {
      // Premium, Non-Premium
      setStep(state.userIsPremium ? 3 : 2);
    }
  }, [state.iceWearableItems, state.iceDelegatedItems, state.userIsPremium]);

  return (
    <section className={styles.home}>
      {!state.userLoggedIn ? (
        <section style={{ marginTop: '80px' }}>
          <FoxAnimation />
        </section>
      ) : isLoading ? (
        <div className={styles.spinner_wrapper}>
          <img src={Images.LOADING_SPINNER} />
        </div>
      ) : isMobile ? (
        <MobileScreen />
      ) : step === 0 ? (
        <Newbie />
      ) : step === 1 ? (
        <Delegate />
      ) : step === 2 ? (
        <NonPremiumOwner />
      ) : (
        <PremiumOwner />
      )}
    </section>
  );
};

export default IceHome;
