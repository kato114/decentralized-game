import React, { FC, ReactElement } from 'react';
import Balances from './Balances/Balances';
import IceWearables from './Wearables/IceWearables';
import Aux from '../../../../_Aux';

export interface BalancesAndWearablesType {
  className?: string;
}

const BalancesAndWearables: FC<BalancesAndWearablesType> = ({ className = '' }: BalancesAndWearablesType): ReactElement => (
  <Aux>
    <section className={`balances-and-wearables component ${className}`} style={{ paddingBottom: '20px' }}>
      <Balances />
      <IceWearables />
    </section>
  </Aux>
);

export default BalancesAndWearables;
