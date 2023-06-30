import styles from './TreasuryTooltipGameplay.module.scss';
import { Popup } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import React, { useEffect, useContext, useState } from 'react';
import { formatPrice } from '@/common/utils';

interface TreasuryTooltipGameplayProps {
  treasuryDetails?: any;
}

const TreasuryTooltipGameplay: React.FC<TreasuryTooltipGameplayProps> = ({ treasuryDetails = {} }) => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  const [manaBalance, setManaBalance] = useState<string>('');
  const [daiBalance, setDaiBalance] = useState<string>('');
  const [ethBalance, setEthBalance] = useState<string>('');
  const [iceBalance, setIceBalance] = useState<string>('');
  const [dgBalance, setDgBalance] = useState<string>('');

  useEffect(() => {
    if (treasuryDetails !== undefined && Object.keys(treasuryDetails).length !== 0) {
      const dg = treasuryDetails.dgBalance;
      setDgBalance(formatPrice(dg, 0));

      const mana = treasuryDetails.manaBalance;
      setManaBalance(formatPrice(mana, 0));

      const dai = treasuryDetails.daiBalance;
      setDaiBalance(formatPrice(dai, 0));

      const eth = treasuryDetails.ethBalance;
      setEthBalance(formatPrice(eth, 2));

      const ice = treasuryDetails.iceBalance;
      setIceBalance(formatPrice(ice, 0));
    }
  }, [treasuryDetails]);

  return (
    <>
      <Popup
        trigger={
          <div className={styles.info_mark}>
            <svg width="8" height="9" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.5026 11.5C8.51864 11.5 11 9.01864 11 6.0026C11 2.98136 8.51864 0.5 5.4974 0.5C2.47617 0.5 0 2.98136 0 6.0026C0 9.01864 2.48136 11.5 5.5026 11.5ZM5.4974 4.33624C5.05097 4.33624 4.67721 3.96248 4.67721 3.51605C4.67721 3.05403 5.05097 2.69066 5.4974 2.69066C5.94384 2.69066 6.31241 3.05403 6.31241 3.51605C6.31241 3.96248 5.94384 4.33624 5.4974 4.33624ZM4.51109 8.9252C4.22039 8.9252 3.99198 8.72275 3.99198 8.41647C3.99198 8.14134 4.22039 7.91812 4.51109 7.91812H5.10807V6.07008H4.61491C4.31902 6.07008 4.0958 5.86244 4.0958 5.56654C4.0958 5.28622 4.31902 5.06819 4.61491 5.06819H5.67909C6.05286 5.06819 6.24493 5.32256 6.24493 5.71708V7.91812H6.71732C7.00802 7.91812 7.23643 8.14134 7.23643 8.41647C7.23643 8.72275 7.00802 8.9252 6.71732 8.9252H4.51109Z"
                fill="white"
              />
            </svg>
          </div>
        }
        position="right center"
        hideOnScroll={true}
        className={styles.popup}
      >
        <Popup.Content className="accountTooltip">
          <div className="tooltip_body" style={{ width: '144px' }}>
            <img className="info" src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
            <div>
              <p style={{ marginBottom: '4px' }}>DG: {dgBalance}</p>
              <p style={{ marginBottom: '4px' }}>DAI: {daiBalance}</p>
              <p style={{ marginBottom: '4px' }}>ETH: {ethBalance}</p>
              <p style={{ marginBottom: '4px' }}>ICE: {iceBalance}</p>
              <p style={{ marginBottom: '4px' }}>MANA: {manaBalance}</p>
            </div>
          </div>
        </Popup.Content>
      </Popup>
    </>
  );
};

export default TreasuryTooltipGameplay;
