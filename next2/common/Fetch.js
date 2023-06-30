import call from './API';
import getConfig from 'next/config';
import { ApiUrlsByAppEnv } from './environments';

// This imports NODE_ENV from next.config.js
const { publicRuntimeConfig } = getConfig();
const { APP_ENV } = publicRuntimeConfig;

// APP_ENV must be set in the .env.{environment} files
export const API_BASE_URL = ApiUrlsByAppEnv[APP_ENV] || 'https://api.decentral.games';

const API_BASE_URL_PROD_OR_LOCALHOST_ONLY = APP_ENV === 'localhost' ? ApiUrlsByAppEnv['localhost'] : ApiUrlsByAppEnv['production'];

console.log('APP_ENV (NODE_ENV): ', APP_ENV);
console.log('API_BASE_URL: ', API_BASE_URL);

const Fetch = {
  // GET API calls (no wallet address necessary)
  APP_CONFIG: () => {
    return call(`${API_BASE_URL}/admin/getAppConfig`, 'GET', false);
  },

  TREASURY_STATS_NUMBERS: period => {
    return call(`${API_BASE_URL_PROD_OR_LOCALHOST_ONLY}/admin/getTreasuryBalanceHistory/${period}`, 'GET', false);
  },

  TREASURY_DETAILS: () => {
    return call(`${API_BASE_URL}/admin/treasuryDetails`, 'GET', true);
  },

  EVENTS: () => {
    return call(`${API_BASE_URL}/players/getEvents`, 'GET', false);
  },

  GAME_RECORDS: () => {
    return call(`${API_BASE_URL}/admin/getTotalRecords`, 'GET');
  },

  USERS_LIST: () => {
    return call(`${API_BASE_URL}/admin/getUsersList`, 'GET');
  },

  MINT_TOKEN: (itemId, collectionAddr) => {
    return call(`${API_BASE_URL}/ice/mintToken/${itemId}/${collectionAddr}`, 'GET');
  },

  MINT_TOKEN_ACCESSORY: (itemId, collectionAddr) => {
    return call(`${API_BASE_URL}/ice/mintToken/${itemId}/${collectionAddr}?type=accessory`, 'GET');
  },

  DG_GOVERNANCE_SUPPLY_GECKO: () => {
    return call(`https://api.coingecko.com/api/v3/coins/decentral-games-governance`, 'GET', false);
  },

  UPGRADE_TOKEN: (tokenId, collectionAddr) => {
    return call(`${API_BASE_URL}/ice/upgradeToken/${tokenId}/${collectionAddr}`, 'GET');
  },

  GET_METADATA_FROM_TOKEN_URI: (contractAddr, tokenId) => {
    return call(`${API_BASE_URL}/ice/getMetadata/${contractAddr}/${tokenId}`, 'GET');
  },

  // ICE Claim Reward
  CLAIM_REWARDS_AMOUNT: () => {
    return call(`${API_BASE_URL}/ice/getUnclaimedRewardsAmount`, 'GET');
  },

  CLAIM_REWARDS: () => {
    return call(`${API_BASE_URL}/ice/claimRewards`, 'GET');
  },

  // xDG Claim Reward
  XDG_CLAIM_REWARDS_AMOUNT: address => {
    return call(`${API_BASE_URL}/xdg/getUnclaimedRewardsAmount?address=${address}`, 'GET');
  },

  XDG_CLAIM_REWARDS: address => {
    return call(`${API_BASE_URL}/xdg/claimRewards`, 'GET');
  },

  GET_REWARDS_CONFIG: () => {
    return call(`${API_BASE_URL}/ice/getRewardsConfig`, 'GET');
  },

  // GET_TOKEN_MAPPINGS: () => {
  //   return call(`${API_BASE_URL}/ice/getRewardsConfig`, 'GET');
  // },

  // GET API calls (wallet address necessary)
  PLAYER_INFO: address => {
    return call(`${API_BASE_URL}/admin/getUser?address=${address}`, 'GET');
  },

  POKER_DATA: address => {
    return call(`${API_BASE_URL}/admin/getPokerHandHistory?address=${address}`, 'GET');
  },

  ICE_AMOUNTS: address => {
    return call(`${API_BASE_URL}/ice/getUnclaimedRewardsAmount?address=${address}`, 'GET');
  },

  UPDATE_FREE_PLAYER_BALANCE: (amount, address) => {
    return call(`${API_BASE_URL}/admin/updateUserBalances?freePlayAmountChange=${amount}&user=${address}`, 'GET');
  },

  UPDATE_ICE_CHIP_BALANCE: (amount, address) => {
    return call(`${API_BASE_URL}/admin/updateUserBalances?iceChipsAmountChange=${amount}&user=${address}`, 'GET');
  },

  // GET API calls (wallet address optional)
  DELEGATE_INFO: address => {
    return call(`${API_BASE_URL}/ice/delegateInfo?address=${address}`, 'GET');
  },

  // POST API calls (no wallet address necessary)
  VERIFY_TOKEN: async () => {
    return await call(`${API_BASE_URL}/authentication/verifyToken`, 'POST', true, {}, true);
  },

  WEB_LOGIN: userAddress => {
    return call(`${API_BASE_URL}/order/webLogin`, 'POST', true, {
      userAddress
    });
  },

  REGISTER: affiliate => {
    return call(`${API_BASE_URL}/order/webRegister`, 'POST', true, {
      affiliate
    });
  },

  DELEGATE_NFT: (delegateAddress, tokenId, contractAddress, delegateNickname) => {
    return call(
      `${API_BASE_URL}/ice/delegateToken`,
      'POST',
      true,
      delegateNickname
        ? {
            delegateAddress,
            tokenId,
            contractAddress,
            delegateNickname
          }
        : {
            delegateAddress,
            tokenId,
            contractAddress
          }
    );
  },

  UNDELEGATE_NFT: (tokenOwner, delegateAddress, tokenId, contractAddress) => {
    return call(`${API_BASE_URL}/ice/undelegateToken`, 'POST', true, {
      tokenOwner,
      delegateAddress,
      tokenId,
      contractAddress
    });
  },

  // POST API calls (wallet address necessary)
  UPDATE_TOKEN_ARRAY: (userAddress, index) => {
    return call(`${API_BASE_URL}/order/updateTokenArray`, 'POST', true, {
      userAddress,
      index
    });
  },

  HISTORY_DATA: userAddress => {
    return call(`${API_BASE_URL}/order/getHistory`, 'POST', true, {
      userAddress,
      limit: 99999, // call all of the data
      page: 1
    });
  },

  PLAY_DATA: userAddress => {
    return call(`${API_BASE_URL}/order/getPlayInfo`, 'POST', true, {
      userAddress,
      limit: 99999, // call all of the data
      page: 1
    });
  },

  POST_HISTORY: (userAddress, amount, type, state, txHash, step) => {
    return call(`${API_BASE_URL}/order/updateHistory`, 'POST', true, {
      userAddress,
      amount,
      type,
      state,
      txHash,
      step
    });
  },

  GET_WEARABLE_INVENTORY: address => {
    return call(`${API_BASE_URL}/ice/getWearableInventory?address=${address}`, 'GET', true);
  },
  GET_ACCESSORY_INVENTORY: address => {
    return call(`${API_BASE_URL}/ice/getWearableInventory?address=${address}&type=accessory`, 'GET', true);
  },

  // third-party API calls
  NFTS_1: address => {
    return call(
      `https://api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=0xbf53c33235cbfc22cef5a61a83484b86342679c5&order_direction=desc&offset=0&limit=10`,
      'GET',
      false
    );
  },

  NFTS_2: address => {
    return call(
      `https://api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=0x7038e9d2c6f5f84469a84cf9bc5f4909bb6ac5e0&order_direction=desc&offset=0&limit=10`,
      'GET',
      false
    );
  },

  AVATAR_IMAGE: address => {
    return call(`https://peer.decentraland.org/lambdas/profile/${address}`, 'GET', false);
  },

  PROPOSALS: () => {
    return call(`https://hub.snapshot.page/api/decentralgames.eth/proposals`, 'GET', false);
  },

  MANA_PRICE: () => {
    return call(`https://api.coingecko.com/api/v3/coins/decentraland`, 'GET', false);
  },

  ETH_PRICE: () => {
    return call(`https://api.coingecko.com/api/v3/coins/ethereum`, 'GET', false);
  },

  ICE_PRICE: () => {
    return call(`https://api.coingecko.com/api/v3/coins/decentral-games-ice`, 'GET', false);
  },

  OLD_DG_PRICE: () => {
    return call(`https://api.coingecko.com/api/v3/simple/price?ids=decentral-games-old&vs_currencies=usd`, 'GET', false);
  },

  ATRI_PRICE: () => {
    return call(`https://api.coingecko.com/api/v3/coins/atari`, 'GET', false);
  },

  DG_SUPPLY_GECKO: () => {
    return call(`https://api.coingecko.com/api/v3/coins/decentral-games`, 'GET', false);
  },

  //////////////////////////////////////////////////////////////////////////////////////////
  BULK_BLOCK_USERS: data => {
    return call(`${API_BASE_URL}/admin/bulkBlockUsers`, 'POST', true, data);
  },

  FIND_BLOCK_USER: address => {
    return call(`${API_BASE_URL}/admin/findBlockedUser?bannedAddress=${address}`, 'GET', true);
  },

  // ICE_PRICE: () => {
  //   return call(`https://api.coingecko.com/api/v3/coins/ice`, 'GET', false);
  // },
  LAND_PRICE: () => {
    return call(`https://nonfungible.com/api/v4/market/summary/decentraland?daily=true&filter=[{"id":"nftTicker","value":"LAND"},{"id":"saleType","value":""}]`, 'GET', false);
  },

  POAPS: address => {
    return call(`https://api.poap.xyz/actions/scan/${address}`, 'GET', false);
  },

  /*****************************************************
   * Delegation data is only available in production. Use `API_BASE_URL_PROD_OR_LOCALHOST_ONLY` to allow localhost debugging, while defaulting to production in all other cases.
   ******************************************************/

  DELEGATION_BREAKDOWN: (time, address) => {
    if (address) {
      return call(`${API_BASE_URL_PROD_OR_LOCALHOST_ONLY}/ice/getDelegationBreakdown/${time}?address=${address}`, 'GET');
    } else {
      return call(`${API_BASE_URL_PROD_OR_LOCALHOST_ONLY}/ice/getDelegationBreakdown/${time}`, 'GET');
    }
  },

  EDIT_DELEGATION_NICKNAME: async (nickname, delegateAddress) => {
    return await call(`${API_BASE_URL_PROD_OR_LOCALHOST_ONLY}/ice/editDelegation`, 'PATCH', true, {
      nickname: nickname,
      delegateAddress: delegateAddress
    });
  },

  EDIT_DELEGATION_GUILDNAME: async guildName => {
    return await call(`${API_BASE_URL_PROD_OR_LOCALHOST_ONLY}/ice/editDelegation`, 'PATCH', true, {
      guildName: guildName
    });
  },

  /*****************************************************
   * End delegation APIS using `API_BASE_URL_PROD_OR_LOCALHOST_ONLY`
  /******************************************************/

  GAMEPLAY_REPORTS: (address, interval) => {
    if (address) {
      if (interval) {
        return call(`${API_BASE_URL_PROD_OR_LOCALHOST_ONLY}/ice/getGameplayReports?address=${address}&interval=${interval}`, 'GET');
      } else {
        return call(`${API_BASE_URL_PROD_OR_LOCALHOST_ONLY}/ice/getGameplayReports?address=${address}`, 'GET');
      }
    } else {
      return call(`${API_BASE_URL_PROD_OR_LOCALHOST_ONLY}/ice/getGameplayReports`, 'GET');
    }
  },

  GET_FRONTPAGE_STATS: () => {
    return call(`${API_BASE_URL}/admin/getFrontPageStats`, 'GET', false);
  },

  GET_MARKETPLACE_ACCESSORIES: () => {
    return call(`${API_BASE_URL}/ice/getAccessoryMarketplace`, 'GET', false);
  },

  ASSIGN_MANAGER: async assignedManagerAddress => {
    return call(`${API_BASE_URL}/admin/updateUser`, 'PATCH', true, {
      assignedManager: assignedManagerAddress
    });
  },

  GET_JOB_LISTING: () => {
    return call(`${API_BASE_URL}/admin/getJobListings`, 'GET');
  }
};

export default Fetch;
