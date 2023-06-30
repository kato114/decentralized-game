import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  CEOSet,
  IceLevelTransfer,
  InitialMinting,
  LevelEdit,
  MetaTransactionExecuted,
  SupplyCheck,
  UpgradeItem,
  UpgradeResolved,
  WorkerAdded,
  WorkerRemoved,
  IceRegistrant
} from "../../generated/IceRegistrant/IceRegistrant"
import {
  createOrUpdateGlobal,
  getOrCreateAccount,
  getOrCreateNFTItem,
  getOrCreateToken,
  ONE,
  ZERO,
} from "./common";
import {
  CEOSetEvent,
  Frame,
  IceLevelTransferEvent,
  InitialMintingEvent,
  Level,
  LevelEditEvent,
  MetaTransactionExecutedEvent,
  Request,
  SupplyCheckEvent,
  Upgrade,
  UpgradeItemEvent,
  UpgradeResolvedEvent,
  WorkerAddedEvent,
  WorkerRemovedEvent,
} from "../../generated/schema";

//ice linens and ice bomber have messed up leveling
const BAD_CONTRACT_ADDRESSES: string[] = [
  "0xd79cf5a41d8caec4688e01b4754ea2da6f51e856",
  "0xd07a56f7198ae6e4e3d6738bd8c4b81d21bf0403"
];

const LEVEL_ID_CONTRACT_MAPPING = {
  "0xd07a56f7198ae6e4e3d6738bd8c4b81d21bf0403" : {
    0: 5,
    1: 5,
    2: 1,
    3: 2,
    4: 4,
    5: 3,
    6: 5,
    7: 1,
    8: 2,
    9: 4,
    10: 3,
    11: 5,
    12: 1,
    13: 2,
    14: 4,
    15: 3,
    16: 1,
    17: 2,
    18: 4,
    19: 3,
    20: 1,
    21: 2,
    22: 4,
    23: 3,
    24: 5
  },
  "0xd79cf5a41d8caec4688e01b4754ea2da6f51e856" : {
    0: 1,
    1: 2,
    2: 4,
    3: 3,
    4: 5,
    5: 1,
    6: 2,
    7: 4,
    8: 3,
    9: 5,
    10: 5,
    11: 5,
    12: 5,
    13: 1,
    14: 2,
    15: 4,
    16: 3,
    17: 1,
    18: 2,
    19: 4,
    20: 3,
    21: 1,
    22: 2,
    23: 4,
    24: 3
  }
}

export function handleCEOSetEvent(_event: CEOSet): void {
  let newCEO = getOrCreateAccount(
    _event.params.newCEO.toHexString()
  );

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new CEOSetEvent(eventID);
  newEvent.newCEO = newCEO.id;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();

  createOrUpdateGlobal(
    "CEO",
    _event.block.timestamp,
    ZERO,
    _event.params.newCEO
  );
}

export function handleIceLevelTransferEvent(_event: IceLevelTransfer): void {
  let oldOwner = getOrCreateAccount(
    _event.params.oldOwner.toHexString()
  );
  let newOwner = getOrCreateAccount(
    _event.params.newOwner.toHexString()
  );
  let token = getOrCreateToken(
    _event.params.tokenAddress.toHexString()
  );

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new IceLevelTransferEvent(eventID);
  newEvent.oldOwner = oldOwner.id;
  newEvent.newOwner = newOwner.id;
  newEvent.tokenAddress = token.id;
  newEvent.tokenId = _event.params.tokenId;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}

export function handleInitialMintingEvent(_event: InitialMinting): void {
  createOrUpdateGlobal(
    "SaleCount",
    _event.block.timestamp,
    ONE,
    null
  );

  let minter = getOrCreateAccount(
    _event.params.tokenOwner.toHexString()
  );

  let contract = IceRegistrant.bind(Address.fromString("0xc9a67ed1472a76d064c826b54c144ca00dae4015"));
  let mintPrice = contract.mintingPrice();
  let paymentToken = contract.paymentToken();

  let frame = new Frame(minter.id);
  frame.minter = minter.id;
  frame.frame = _event.block.timestamp;
  frame.save();

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new InitialMintingEvent(eventID);
  newEvent.tokenId = _event.params.tokenId;
  newEvent.mintCount = _event.params.mintCount;
  newEvent.tokenOwner = minter.id;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.mintPrice = mintPrice;
  newEvent.paymentToken = paymentToken;
  newEvent.save();
}

export function handleLevelEditEvent(_event: LevelEdit): void {
  let level = Level.load(_event.params.level.toString());
  if (!level) {
    level = new Level(_event.params.level.toString());
  }
  level.isActive = _event.params.isActive;
  level.costAmountDG = _event.params.dgCostAmount;
  level.moveAmountDG = _event.params.dgMoveAmount;
  level.costAmountICE = _event.params.iceCostAmount;
  level.moveAmountICE = _event.params.iceMoveAmount;
  level.save();

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new LevelEditEvent(eventID);
  newEvent.level = _event.params.level;
  newEvent.dgCostAmount = _event.params.dgCostAmount;
  newEvent.dgMoveAmount = _event.params.dgMoveAmount;
  newEvent.iceCostAmount = _event.params.iceCostAmount;
  newEvent.iceMoveAmount = _event.params.iceMoveAmount;
  newEvent.isActive = _event.params.isActive;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}

export function handleMetaTransactionExecutedEvent(_event: MetaTransactionExecuted): void {
  let user = getOrCreateAccount(
    _event.params.userAddress.toHexString()
  );
  let relayer = getOrCreateAccount(
    _event.params.relayerAddress.toHexString()
  );

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new MetaTransactionExecutedEvent(eventID);
  newEvent.userAddress = user.id;
  newEvent.relayerAddress = relayer.id;
  newEvent.functionSignature = _event.params.functionSignature;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}

export function handleSupplyCheckEvent(_event: SupplyCheck): void {
  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new SupplyCheckEvent(eventID);
  newEvent.rarity = _event.params.rarity;
  newEvent.maxSupply = _event.params.maxSupply;
  newEvent.price = _event.params.price;
  newEvent.beneficiary = _event.params.beneficiary;
  newEvent.metadata = _event.params.metadata;
  newEvent.contentHash = _event.params.contentHash;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}

export function handleUpgradeItemEvent(_event: UpgradeItem): void {
  let owner = getOrCreateAccount(
    _event.params.tokenOwner.toHexString()
  );
  let token = getOrCreateToken(
    _event.params.tokenAddress.toHexString()
  );

  let requestIndex = _event.params.requestIndex.toString();
  let request = new Request(requestIndex);
  request.itemId = _event.params.itemId;
  request.issuedId = _event.params.issuedId;
  request.tokenOwner = owner.id;
  request.tokenId = _event.params.tokenId;
  request.tokenAddress = token.id;
  request.save();

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new UpgradeItemEvent(eventID);
  newEvent.itemId = _event.params.itemId;
  newEvent.issuedId = _event.params.issuedId;
  newEvent.tokenOwner = owner.id;
  newEvent.tokenId = _event.params.tokenId;
  newEvent.tokenAddress = token.id;
  newEvent.requestIndex = _event.params.requestIndex;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}

export function handleUpgradeResolvedEvent(_event: UpgradeResolved): void {
  let owner = getOrCreateAccount(
    _event.params.tokenOwner.toHexString()
  );
  const tokenAddress = _event.params.tokenAddress.toHexString();
  let token = getOrCreateToken(
    tokenAddress
  );
  const newItemId = _event.params.newItemId;
  let levelId: number;
  //This is true for every collection except Ice bomber and Ice linen
  if(BAD_CONTRACT_ADDRESSES.includes(tokenAddress)){
    levelId = LEVEL_ID_CONTRACT_MAPPING[tokenAddress][newItemId]
  }else{
    //normal way to calc the levels
    levelId = newItemId.mod(BigInt.fromI32(5)).plus(ONE);
  }
  let level = Level.load(levelId.toString());

  let nftItem = getOrCreateNFTItem(
    token.id,
    _event.params.newTokenId,
    _event.block.timestamp
  );
  if (nftItem) {
    nftItem.level = levelId;
    nftItem.save();
  }
  
  let tokenId = _event.params.newTokenId.toString();
  let upgrade = new Upgrade(token.id + "_" + tokenId + "_" + levelId.toString());
  upgrade.itemId = _event.params.newItemId;
  upgrade.tokenOwner = owner.id;
  upgrade.tokenId = _event.params.newTokenId;
  upgrade.tokenAddress = token.id;
  upgrade.costAmountDG = level.costAmountDG;
  upgrade.costAmountICE = level.costAmountICE;
  upgrade.level = levelId;
  upgrade.timestamp = _event.block.timestamp;
  upgrade.save();

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new UpgradeResolvedEvent(eventID);
  newEvent.newItemId = _event.params.newItemId;
  newEvent.tokenOwner = owner.id;
  newEvent.newTokenId = _event.params.newTokenId;
  newEvent.tokenAddress = token.id;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}

export function handleWorkerAddedEvent(_event: WorkerAdded): void {
  let newWorker = getOrCreateAccount(
    _event.params.newWorker.toHexString()
  );
  newWorker.isWorker = true;
  newWorker.save();

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new WorkerAddedEvent(eventID);
  newEvent.newWorker = newWorker.id;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}

export function handleWorkerRemovedEvent(_event: WorkerRemoved): void {
  let existingWorker = getOrCreateAccount(
    _event.params.existingWorker.toHexString()
  );
  existingWorker.isWorker = false;
  existingWorker.save();

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new WorkerRemovedEvent(eventID);
  newEvent.existingWorker = existingWorker.id;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}
