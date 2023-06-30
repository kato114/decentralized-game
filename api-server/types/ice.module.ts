export type DelegationData = {
    delegatedTo: string;
    delegatedToNickname?: string;
    isQueuedForUndelegationByOwner: boolean;
    isQueuedForUndelegationByDelegatee: boolean;
    createdAt: string;
}

export type TokenData = {
    tokenId: string;
    contractAddress: any;
    bonus: number;
    tokenOwner: string;
    checkInStatus: boolean; // deprecated, will remove soon
    metaverseCheckInStatus: boolean;
    mobileCheckInStatus: boolean;
    delegationStatus: DelegationData;
    isActivated: boolean;
    dclUrn: string;
    itemId: string;
    name: string;
    description: string;
    rank: number;
    category: string;
    image: string;
    imageUpgrade: string | null;
    isEquipped: boolean;
    shine?: number;
    chips?: number;
}

export type GamePlayReport = {
    day: Date, 
    gameplay: any, 
    delegation: []
}

export type transactionDGRevenueResponse = {
    contractAddress: string,
    paymentTokenAddress: string | null,
    paymentTokenAmount: number
}

export type ethereumLogReceipt = {
    blockHash: string,
    address: string,
    logIndex: number,
    data: string,
    removed: boolean,
    topics: string[],
    blockNumber: number,
    transactionIndex: number,
    transactionHash: string,
    id: string
}

export type IceLeaderBoardScore = {
    GuildScore: number;
    GuildOwner: string;
    Chips: number;
    TotalActivatedWearables: number;
    GuildName: string;
    GuildLeague: IceGuildLeague;
}

export interface RankedIceLeaderBoardScore extends IceLeaderBoardScore {
    Rank: number
}

export enum IceGuildLeague {
    ChadLeague = 'ChadLeague',
    ApeLeague = 'ApeLeague',
    FrenLeague = 'FrenLeague',
    Disqualified = 'Disqualified'
}