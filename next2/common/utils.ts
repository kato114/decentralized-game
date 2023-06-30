import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import web3 from 'web3-utils';
import Global from '../components/Constants';
import Images from './Images';

export const getRank = (bonus: number): { value: number; percentage: string } => {
  if (bonus === 0) {
    return { value: 0, percentage: '0%' };
  } else if (bonus >= 1 && bonus <= 7) {
    return { value: 1, percentage: '+' + bonus + '%' };
  } else if (bonus >= 8 && bonus <= 15) {
    return { value: 2, percentage: '+' + bonus + '%' };
  } else if (bonus >= 16 && bonus <= 24) {
    return { value: 3, percentage: '+' + bonus + '%' };
  } else if (bonus >= 25 && bonus <= 34) {
    return { value: 4, percentage: '+' + bonus + '%' };
  } else if (bonus >= 35 && bonus <= 45) {
    return { value: 5, percentage: '+' + bonus + '%' };
  }
};

export const switchToMainNet = async () => {
  const networkInfo = {
    id: 1,
    name: 'Mainnet'
  };

  try {
    await (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: Web3.utils.toHex(networkInfo.id)
        }
      ]
    });
  } catch (error) {
    console.log(error);
  }
};

export const switchMaticNetwork = async () => {
  try {
    const ethereum = (window as any).ethereum;
    const data = [
      {
        chainId: '0x89',
        chainName: 'Matic Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
        blockExplorerUrls: ['https://explorer.matic.network/']
      }
    ];

    const tx = await ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch();

    if (tx) {
      // console.log(tx);
    }
  } catch (error) {
    console.error(error);
  }
};

export const formatPrice = (balanceDg, units): string => {
  const balanceAdjusted = Number(balanceDg)
    .toFixed(units)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return balanceAdjusted;
};

export const formatNumber = (value, decimals = 0) => {
  if (new BigNumber(value).isNaN() || !new BigNumber(value).isFinite()) {
    return '0';
  }
  const valueStr = Number(new BigNumber(value).toFixed(decimals, BigNumber.ROUND_DOWN)).toString();
  const decimalPoint = valueStr.indexOf('.');
  const decimalLength = decimalPoint < 0 ? 1 : valueStr.length - decimalPoint;
  return new BigNumber(valueStr).toFormat(Math.min(decimals, decimalLength - 1));
};

// stake, withdraw, and get reward from staking contracts
export const getAmounts = amount => {
  const amountAdjusted = amount * Global.CONSTANTS.FACTOR;
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (10 || -1) + '})?');
  const truncated = amount.toString().match(re)[0];
  const amountToString = web3.toWei(truncated);

  return { amountAdjusted, amountToString };
};

export const roundDownDecimals = (value: any) => {
  // console.log("value: ", value);
  const roundedDown = parseInt((value * 1000).toString()) / 1000;
  // console.log(roundedDown)
  return roundedDown;
};

export const addToken = async () => {
  const networkInfo = {
    id: 1,
    name: 'Mainnet',
    etherscan: 'https://etherscan.io',
    dgLightAddress: Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG_LIGHT,
    dgTownHallAddress: Global.ADDRESSES.ROOT_DG_TOWN_HALL_ADDRESS
  };

  try {
    await (window as any).ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: networkInfo.dgTownHallAddress,
          symbol: 'xDG',
          decimals: 18,
          image: Images.XDG_COIN_LOGO
        }
      }
    });
  } catch {}
};

export const formatBigNumber = value => {
  if (value / 1000000 >= 1) {
    return Math.round(value / 100000) / 10 + 'M';
  } else if (value / 1000 >= 1) {
    return Math.round(value / 100) / 10 + 'K';
  } else {
    return Math.round(value * 10) / 10;
  }
};

// get Remaining Time
export const getRemainingTime = (): number => {
  const today = new Date();
  const todayUtc = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds());
  const tomorrowUtc = new Date(todayUtc.getTime());

  tomorrowUtc.setDate(tomorrowUtc.getDate() + 1);
  tomorrowUtc.setHours(0);
  tomorrowUtc.setMinutes(0);
  tomorrowUtc.setSeconds(0);

  return (tomorrowUtc.getTime() - todayUtc.getTime()) / 1000;
};
