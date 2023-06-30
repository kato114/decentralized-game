import React, { ReactElement, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Grid, Image } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import IceWearables from '../Ice/BalancesAndWearables/Wearables/IceWearables';
import styles from './Items.module.scss';
import Images from 'common/Images';

export interface ItemsType {
  className?: string;
}

const Items = (): ReactElement => {
  // get user status from the Context API store
  const [state] = useContext(GlobalContext);

  return (
    <Aux>
      {!state.iceWearableItemsLoading && !state.iceDelegatedItemsLoading ? (
        <>
          <IceWearables />

          <div className={styles.items_container} style={{ marginBottom: '30px' }}>
            <h1 className={styles.title} style={{ marginTop: '50px' }}>
              POAPs
            </h1>
            {state.poaps.length !== 0 ? (
              <Grid className={styles.padding}>
                {state.poaps.map((poap, i) => (
                  <Grid.Column computer={2} tablet={4} mobile={8} key={i}>
                    <Image src={poap.image_url} className="poap-pic" />
                  </Grid.Column>
                ))}
              </Grid>
            ) : (
              <div className={styles.error_container}>
                <p className={styles.error_state}>No POAPs</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.spinner_wrapper}>
          <img src={Images.LOADING_SPINNER} />
        </div>
      )}
    </Aux>
  );
};

export default Items;
