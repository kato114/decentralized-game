import { useReducer } from 'react';
import { GlobalContext } from '@/store';

const initialState = {
  categories: ['All', 'Announcements', 'Tutorials', 'Technology'],
  pages: {
    data: [],
    meta: {}
  },
  userStatus: 0,
  userAddress: '',
  userAvatarImg: '',
  userIsPremium: undefined,
  userInfo: {
    name: '',
    id: '',
    balancePLAY: 0,
    count: '',
    email: '',
    playersList: [],
    // totalDAI: 0,
    // totalMANA: 0,
    // totalPLAY: 0,
    // totalUSDT: 0,
    // totalATRI: 0,
    tokenArray: [false, false, false, false, false, false],
    guildManager: '',
    managerOf: ''
  },
  userBalances: [
    [0, 0],
    [0, 0],
    [0, 0, 0, 0],
    [0, 0]
  ],
  userLoggedIn: false,
  transactions: [{}, {}],
  appConfig: {},
  treasuryNumbers: undefined,
  gameRecords: {},
  networkID: 0,
  activeStatus: true,
  ethBalance: 0,
  ethereumBal: 0,
  adminBalances: {
    treasury: [0, 0, 0, 0, 0, 0, ''],
    slots: [0, 0, 0, 0, 0, 0, ''],
    roulette: [0, 0, 0, 0, 0, 0, ''],
    blackjack: [0, 0, 0, 0, 0, 0, '']
  },
  usersList: [],
  DGBalancesLoading: true,
  DGBalances: {
    BALANCE_ROOT_DG: 0,
    BALANCE_ROOT_DG_LIGHT: 0,
    BALANCE_CHILD_DG: 0,
    BALANCE_CHILD_DG_LIGHT: 0,
    BALANCE_CHILD_TOKEN_XDG: 0,
    BALANCE_STAKING_BALANCER_1: 0,
    BALANCE_STAKING_BALANCER_2: 0,
    BALANCE_STAKING_GOVERNANCE: 0,
    BALANCE_STAKING_UNISWAP: 0,
    BALANCE_MINING_DG: 0,
    BALANCE_MINING_DG_V2: 0,
    BALANCE_KEEPER_DG: 0
  },
  DGPrices: {
    eth: 0,
    mana: 0,
    dai: 0,
    atri: 0,
    usdt: 0,
    dg: 0,
    ice: 0,
    xDG: 0
  },
  DGBreakdown: {
    eth: 0,
    mana: 0,
    dai: 0,
    atri: 0,
    usdt: 0
  },
  wearables: [],
  poaps: [],
  eventsData: undefined,
  stakingBalancesLoading: true,
  stakingBalances: {
    BALANCE_CONTRACT_BPT_1: 0,
    BALANCE_CONTRACT_DG_1: 0,
    BALANCE_USER_GOVERNANCE: 0,
    BALANCE_STAKED_UNISWAP: 0
  },
  itemLimits1: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits2: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits3: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits4: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits5: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits6: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits7: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits8: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits9: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits10: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits11: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits12: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits13: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits14: [
    [-1, 0],
    [-1, 5],
    [-1, 10],
    [-1, 15],
    [-1, 20]
  ],
  itemLimits15: [[-1, 0]],
  iceWearableInventoryItems: [],
  iceWearableInventoryItemsLoading: true,
  iceWearableInventoryItemsSuccess: false,
  iceWearableItems: [],
  accessoryItems: [],
  iceWearableItemsLoading: true,
  iceWearableUpdatedSuccess: false,
  iceDelegatedItems: [],
  iceDelegatedItemsLoading: true,
  nftAuthorizations: [],
  canPurchase: true,
  tokenAmounts: {
    WETH_COST_AMOUNT: 0,
    DG_MOVE_AMOUNT: 0,
    ICE_MOVE_AMOUNT: 0,
    DG_COST_AMOUNT_2: 0,
    ICE_COST_AMOUNT_2: 0,
    DG_COST_AMOUNT_3: 0,
    ICE_COST_AMOUNT_3: 0,
    DG_COST_AMOUNT_4: 0,
    ICE_COST_AMOUNT_4: 0,
    DG_COST_AMOUNT_5: 0,
    ICE_COST_AMOUNT_5: 0
  },
  iceAmounts: {
    ICE_AVAILABLE_AMOUNT: 0,
    ICE_CLAIM_AMOUNT: 0
  },
  tokenAuths: {
    DG_LIGHT_AUTHORIZATION: false,
    ICE_AUTHORIZATION: false,
    NON_ICE_AUTHORIZATION_COLLECTION: false,
    NON_ICE_AUTHORIZATION_NFT_PURCHASER: false,
    WETH_AUTHORIZATION: false
  },
  iceTotalAmount: {
    totalUnclaimedAmount: 0,
    totalClaimedAmount: 0
  },
  delegationBreakdown: [],
  // collectionMappings: {},
  refreshBalances: true,
  refreshTokenAmounts: true,
  refreshICEAmounts: true,
  refreshTokenAuths: true,
  refreshNFTAuths: true,
  refreshWearable: true,
  refreshDelegation: true,
  updateWearableWithoutRefresh: false,
  updateInfo: true,
  affiliateAddress: '',
  stakeTime: 0,
  subgraphData: [],
  snapshotData: [],
  dgLoading: 0,
  dgShow: false,
  openModal: {
    resumeID: 0,
    lockID: 0
  },
  openModalInfo: false,
  dgWarningMsg: false,
  toastMessage: '',
  // iceAmount: 0,
  // xpAmount: 0,
  isAmnesiaPage: false,
  delegatorSplits: [],
  web3Provider: null,
  mintToken: 'ETH'
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'update_pages':
      return {
        ...state,
        pages: action.data
      };

    case 'update_status':
      return {
        ...state,
        userStatus: action.data
      };

    case 'user_address':
      if (!action.data) {
        return {
          ...state
        };
      }

      return {
        ...state,
        userAddress: action.data
      };

    case 'user_avatarImg':
      return {
        ...state,
        userAvatarImg: action.data
      };

    case 'user_info':
      return {
        ...state,
        userInfo: action.data
      };

    case 'user_is_premium':
      return {
        ...state,
        userIsPremium: action.data
      };

    case 'update_balances':
      return {
        ...state,
        userBalances: action.data
      };

    case 'update_eth_balance':
      return {
        ...state,
        ethereumBal: action.data
      };

    case 'update_history':
      return {
        ...state,
        transactions: action.data
      };

    case 'app_config':
      return {
        ...state,
        appConfig: action.data
      };

    case 'treasury_numbers':
      return {
        ...state,
        treasuryNumbers: action.data
      };

    case 'update_records':
      return {
        ...state,
        gameRecords: action.data
      };

    case 'network_id':
      return {
        ...state,
        networkID: action.data
      };

    case 'active_status':
      return {
        ...state,
        activeStatus: action.data
      };

    case 'eth_balance':
      return {
        ...state,
        ethBalance: action.data
      };

    case 'admin_balances':
      return {
        ...state,
        adminBalances: action.data
      };

    case 'users_list':
      return {
        ...state,
        usersList: action.data
      };

    case 'dg_balances_loading':
      return {
        ...state,
        DGBalancesLoading: action.data
      };

    case 'dg_balances':
      return {
        ...state,
        DGBalances: action.data
      };

    case 'dg_gameplay_collected':
      return {
        ...state,
        DGGameplayCollected: action.data
      };

    case 'staking_balances_loading':
      return {
        ...state,
        stakingBalancesLoading: action.data
      };

    case 'staking_balances':
      return {
        ...state,
        stakingBalances: action.data
      };

    case 'item_limits_1':
      return {
        ...state,
        itemLimits1: action.data
      };

    case 'item_limits_2':
      return {
        ...state,
        itemLimits2: action.data
      };

    case 'item_limits_3':
      return {
        ...state,
        itemLimits3: action.data
      };

    case 'item_limits_4':
      return {
        ...state,
        itemLimits4: action.data
      };

    case 'item_limits_5':
      return {
        ...state,
        itemLimits5: action.data
      };
    case 'item_limits_6':
      return {
        ...state,
        itemLimits6: action.data
      };
    case 'item_limits_7':
      return {
        ...state,
        itemLimits7: action.data
      };
    case 'item_limits_8':
      return {
        ...state,
        itemLimits8: action.data
      };
    case 'item_limits_9':
      return {
        ...state,
        itemLimits9: action.data
      };
    case 'item_limits_10':
      return {
        ...state,
        itemLimits10: action.data
      };
    case 'item_limits_11':
      return {
        ...state,
        itemLimits11: action.data
      };
    case 'item_limits_12':
      return {
        ...state,
        itemLimits12: action.data
      };
    case 'item_limits_13':
      return {
        ...state,
        itemLimits13: action.data
      };
    case 'item_limits_14':
      return {
        ...state,
        itemLimits14: action.data
      };
    case 'item_limits_15':
      return {
        ...state,
        itemLimits15: action.data
      };
    case 'ice_wearable_items':
      return {
        ...state,
        iceWearableItems: action.data
      };
    case 'accessory_items':
      return {
        ...state,
        accessoryItems: action.data
      };
    case 'ice_wearable_items_loading':
      return {
        ...state,
        iceWearableItemsLoading: action.data
      };

    case 'ice_wearable_update_success':
      return {
        ...state,
        iceWearableUpdatedSuccess: action.data
      };

    case 'ice_delegated_items':
      return {
        ...state,
        iceDelegatedItems: action.data
      };

    case 'ice_delegated_items_loading':
      return {
        ...state,
        iceDelegatedItemsLoading: action.data
      };

    case 'ice_total_amount':
      return {
        ...state,
        iceTotalAmount: action.data
      };

    case 'set_delegation_breakdown':
      return {
        ...state,
        delegationBreakdown: action.data
      };

    case 'nft_authorizations':
      return {
        ...state,
        nftAuthorizations: action.data
      };

    case 'can_purchase':
      return {
        ...state,
        canPurchase: action.data
      };

    case 'current_mint_token':
      return {
        ...state,
        mintToken: action.data
      };

    case 'token_amounts':
      return {
        ...state,
        tokenAmounts: action.data
      };

    case 'ice_amounts':
      return {
        ...state,
        iceAmounts: action.data
      };

    case 'token_auths':
      return {
        ...state,
        tokenAuths: action.data
      };

    // case 'collection_mappings':
    //   return {
    //     ...state,
    //     collectionMappings: action.data,
    //   };

    case 'delegator_splits':
      return {
        ...state,
        delegatorSplits: action.data
      };

    case 'web3_provider':
      return {
        ...state,
        web3Provider: action.data
      };

    case 'dg_prices':
      return {
        ...state,
        DGPrices: action.data
      };

    case 'dg_breakdown':
      return {
        ...state,
        DGBreakdown: action.data
      };

    case 'wearables':
      return {
        ...state,
        wearables: action.data
      };

    case 'poaps':
      return {
        ...state,
        poaps: action.data
      };

    case 'events_data':
      return {
        ...state,
        eventsData: action.data
      };

    case 'refresh_balances':
      return {
        ...state,
        refreshBalances: action.data
      };

    case 'refresh_token_auths':
      return {
        ...state,
        refreshTokenAuths: action.data
      };

    case 'refresh_token_amounts':
      return {
        ...state,
        refreshTokenAmounts: action.data
      };

    case 'refresh_ice_amounts':
      return {
        ...state,
        refreshICEAmounts: action.data
      };

    case 'refresh_nft_auths':
      return {
        ...state,
        refreshNFTAuths: action.data
      };

    case 'refresh_wearable_items':
      return {
        ...state,
        refreshWearable: action.data
      };

    case 'refresh_delegation':
      return {
        ...state,
        refreshDelegation: action.data
      };

    case 'update_wearable_items_without_refresh':
      return {
        ...state,
        updateWearableWithoutRefresh: action.data
      };

    case 'update_info':
      return {
        ...state,
        updateInfo: action.data
      };

    case 'stake_time':
      return {
        ...state,
        stakeTime: action.data
      };

    case 'subgraph_data':
      return {
        ...state,
        subgraphData: action.data
      };

    case 'snapshot_data':
      return {
        ...state,
        snapshotData: action.data
      };

    case 'affiliate_address':
      return {
        ...state,
        affiliateAddress: action.data
      };
    case 'set_dgLoading':
      return {
        ...state,
        dgLoading: action.data
      };
    case 'set_openModal':
      return {
        ...state,
        openModal: action.data
      };
    case 'set_openModalInfo':
      return {
        ...state,
        openModalInfo: action.data
      };
    case 'set_dgShow':
      return {
        ...state,
        dgShow: action.data
      };
    case 'set_dgWarningMsg':
      return {
        ...state,
        dgWarningMsg: action.data
      };
    case 'show_toastMessage':
      return {
        ...state,
        toastMessage: action.data
      };
    case 'set_userLoggedIn':
      return {
        ...state,
        userLoggedIn: action.data
      };
    case 'set_amnesia':
      return {
        ...state,
        isAmnesiaPage: action.data
      };
    case 'set_initialState':
      return {
        ...initialState,
        appConfig: state.appConfig
      };
    default:
      throw new Error('Wrong action type got dispatched');
  }
};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <GlobalContext.Provider value={[state, dispatch]}>{children}</GlobalContext.Provider>;
};

export { Provider };
