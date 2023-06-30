import React, { createContext } from 'react';

// TODO: Replace all occurances of `any` with actual Type information

// Defines the interface for `state`. Update this any time new state properties are needed
type ItemLimits = [[number, number], [number, number], [number, number], [number, number], [number, number]];

interface AppState {
  categories: ['All', 'Announcements', 'Tutorials', 'Technology'];
  pages: {
    data: Array<any>;
    meta: any;
  };
  userStatus: number;
  userAddress: string;
  userAvatarImg: string;
  userIsPremium: boolean;
  userInfo: {
    name: string;
    id: number;
    balancePLAY: number;
    count: string;
    email: string;
    playersList: Array<any>;
    tokenArray: [boolean, boolean, boolean, boolean, boolean, boolean];
  };
  userBalances: [[number, number], [number, number], [number, number, number, number], [number, number]];
  userLoggedIn: boolean;
  transactions: Array<any>;
  appConfig: any;
  treasuryNumbers: any;
  gameRecords: any;
  networkID: number;
  activeStatus: true;
  ethBalance: number;
  ethereumBal: number;
  adminBalances: {
    treasury: [number, number, number, number, number, number, string];
    slots: [number, number, number, number, number, number, string];
    roulette: [number, number, number, number, number, number, string];
    blackjack: [number, number, number, number, number, number, string];
  };
  usersList: Array<any>;
  DGBalancesLoading: true;
  DGBalances: {
    BALANCE_ROOT_DG: number;
    BALANCE_ROOT_DG_LIGHT: number;
    BALANCE_CHILD_DG: number;
    BALANCE_CHILD_DG_LIGHT: number;
    BALANCE_CHILD_TOKEN_XDG: string;
    BALANCE_STAKING_BALANCER_1: number;
    BALANCE_STAKING_BALANCER_2: number;
    BALANCE_STAKING_GOVERNANCE: number;
    BALANCE_STAKING_UNISWAP: number;
    BALANCE_MINING_DG: number;
    BALANCE_MINING_DG_V2: number;
    BALANCE_KEEPER_DG: number;
  };
  DGPrices: {
    eth: number;
    mana: number;
    dai: number;
    atri: number;
    usdt: number;
    dg: number;
    ice: number;
    xDG: number;
  };
  DGBreakdown: {
    eth: number;
    mana: number;
    dai: number;
    atri: number;
    usdt: number;
  };
  wearables: Array<any>;
  poaps: Array<any>;
  eventsData: any;
  stakingBalancesLoading: true;
  stakingBalances: {
    BALANCE_CONTRACT_BPT_1: number;
    BALANCE_CONTRACT_DG_1: number;
    BALANCE_USER_GOVERNANCE: string;
    BALANCE_STAKED_UNISWAP: number;
  };
  itemLimits1: ItemLimits;
  itemLimits2: ItemLimits;
  itemLimits3: ItemLimits;
  itemLimits4: ItemLimits;
  itemLimits5: ItemLimits;
  itemLimits6: ItemLimits;
  itemLimits7: ItemLimits;
  itemLimits8: ItemLimits;
  itemLimits9: ItemLimits;
  itemLimits10: ItemLimits;
  itemLimits11: ItemLimits;
  itemLimits12: ItemLimits;
  itemLimits13: ItemLimits;
  itemLimits14: ItemLimits;
  itemLimits15: ItemLimits;
  iceWearableInventoryItems: Array<any>;
  iceWearableInventoryItemsLoading: true;
  iceWearableInventoryItemsSuccess: boolean;
  iceWearableItems: Array<any>;
  iceWearableItemsLoading: true;
  iceWearableUpdatedSuccess: boolean;
  iceDelegatedItems: Array<any>;
  iceDelegatedItemsLoading: true;
  nftAuthorizations: Array<any>;
  canPurchase: boolean;
  tokenAmounts: {
    WETH_COST_AMOUNT: number;
    DG_MOVE_AMOUNT: number;
    ICE_MOVE_AMOUNT: number;
    DG_COST_AMOUNT_2: number;
    ICE_COST_AMOUNT_2: number;
    DG_COST_AMOUNT_3: number;
    ICE_COST_AMOUNT_3: number;
    DG_COST_AMOUNT_4: number;
    ICE_COST_AMOUNT_4: number;
    DG_COST_AMOUNT_5: number;
    ICE_COST_AMOUNT_5: number;
  };
  iceAmounts: {
    ICE_AVAILABLE_AMOUNT: number;
    ICE_CLAIM_AMOUNT: number;
  };
  tokenAuths: {
    DG_LIGHT_AUTHORIZATION: boolean;
    ICE_AUTHORIZATION: boolean;
    WETH_AUTHORIZATION: boolean;
  };
  refreshBalances: boolean;
  refreshTokenAmounts: boolean;
  refreshICEAmounts: boolean;
  refreshTokenAuths: boolean;
  refreshNFTAuths: boolean;
  refreshWearable: boolean;
  refreshDelegation: boolean;
  updateInfo: boolean;
  affiliateAddress: string;
  stakeTime: number;
  subgraphData: Array<any>;
  snapshotData: Array<any>;
  dgLoading: number;
  dgShow: boolean;
  openModal: {
    resumeID: number;
    lockID: number;
  };
  openModalInfo: boolean;
  dgWarningMsg: boolean;
  toastMessage: string;
  isAmnesiaPage: boolean;
  delegatorSplits: Array<any>;
  mintToken: string;
  delegationBreakdown: Array<any>;
  iceTotalAmount: {
    totalUnclaimedAmount: string | number;
    totalClaimedAmount: string | number;
  };
}

// Defines the interface for `dispatch`
interface DispatchData {
  type: string;
  data: any;
}

/* Defines the types returned from useContext in a component:
  `const [state, dispatch] = useContext(GlobalContext)`
 */
type GlobalContextType = [AppState, React.Dispatch<DispatchData>];

const GlobalContext = createContext<GlobalContextType>([{} as AppState, () => {}]);

export { GlobalContext };
