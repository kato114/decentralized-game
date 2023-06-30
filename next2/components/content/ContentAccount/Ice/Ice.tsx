import React, { ReactElement, useContext } from 'react';
import { GlobalContext } from '@/store';
import Aux from 'components/_Aux';
import NoWearablesSplash from './NoWearablesSplash/NoWearablesSplash';
import BalancesAndWearables from './BalancesAndWearables/BalancesAndWearables';
import Images from 'common/Images';
import styles from './Ice.module.scss';

export interface IceType {
  className?: string;
}

const Ice = (): ReactElement => {
  // get user's transaction history from the Context API store
  const [state] = useContext<any>(GlobalContext);

  return (
    <Aux>
      {!state.iceWearableItemsLoading && !state.iceDelegatedItemsLoading ? (
        <Aux>
          {(state.userStatus && (!!state.iceWearableItems.length || !!state.iceDelegatedItems.length)) || state.iceTotalAmount.totalUnclaimedAmount >= 0 ? (
            <BalancesAndWearables />
          ) : (
            <NoWearablesSplash />
          )}
        </Aux>
      ) : (
        <div className={styles.spinner_wrapper}>
          <img src={Images.LOADING_SPINNER} />
        </div>
      )}
    </Aux>
  );
};

export default Ice;
