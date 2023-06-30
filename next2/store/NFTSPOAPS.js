import { useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Fetch from '../common/Fetch';

function NFTSPOAPS() {
  // dispatch treasury balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // get user nfts statistics
  useEffect(() => {
    if (state.userAddress && state.userStatus >= 4) {
      (async () => {
        const [nft1, nft2] = await Promise.all([Fetch.NFTS_1(state.userAddress), Fetch.NFTS_2(state.userAddress)]);

        if (nft1 && nft2) {
          dispatch({
            type: 'wearables',
            data: [...nft1.assets, nft2.assets]
          });
        }
      })();
    }
  }, [state.userStatus]);

  // get user poaps
  useEffect(() => {
    if (state.userAddress && state.userStatus >= 4) {
      (async () => {
        const poapsRes = await Fetch.POAPS(state.userAddress);

        const poaps = [];

        if (poapsRes) {
          poapsRes.filter(poap => {
            if (poap.event.name.includes('Decentral Games') || poap.event.name.includes('BAYC')) {
              poaps.push(poap.event);
            }
          });
        }

        dispatch({
          type: 'poaps',
          data: poaps
        });
      })();
    }
  }, [state.userStatus]);

  return null;
}

export default NFTSPOAPS;
