import styles from './TreasuryTooltipLP.module.scss';
import { Popup } from 'semantic-ui-react';
import React, { useEffect, useContext, useState } from 'react';
import { formatPrice } from '@/common/utils';

interface TreasuryTooltipLPProps {
  treasuryDetails?: any;
}

const TreasuryTooltipLP: React.FC<TreasuryTooltipLPProps> = ({ treasuryDetails = {} }) => {
  const [iceTreasury, setIceTreasury] = useState<string>('');
  const [dgMaticLp, setDgMaticLp] = useState<string>('');
  const [dgxDgLp, setDgxDgLp] = useState<string>('');
  const [dgETHLp, setDgEthLp] = useState<string>('');

  useEffect(() => {
    if (treasuryDetails !== undefined && Object.keys(treasuryDetails).length !== 0) {
      const ice_lp = treasuryDetails.totalIceUsdcLPBalance;
      setIceTreasury(formatPrice(ice_lp, 0));

      const dg_matic_lp = treasuryDetails.totalDGMaticLPBalance;
      setDgMaticLp(formatPrice(dg_matic_lp, 0));

      const dg_xDg_lp = treasuryDetails.totalDGXDgLPBalance;
      setDgxDgLp(formatPrice(dg_xDg_lp, 0));

      const dg_eth_lp = treasuryDetails.totalDgEthUniswapBalance;
      setDgEthLp(formatPrice(dg_eth_lp, 0));
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
          <div className="tooltip_body" style={{ width: '204px' }}>
            <img className="info" src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631640045/ICE_Info_bbiag6.svg" />
            <div>
              <p style={{ marginBottom: '4px' }}>USDC-ICE LP: ${iceTreasury}</p>
              <p style={{ marginBottom: '4px' }}>DG-MATIC LP: ${dgMaticLp}</p>
              <p style={{ marginBottom: '4px' }}>DG-xDG LP: ${dgxDgLp}</p>
              <p style={{ marginTop: '0px' }}>DG-ETH LP: ${dgETHLp}</p>
            </div>
          </div>
        </Popup.Content>
      </Popup>
    </>
  );
};

export default TreasuryTooltipLP;
