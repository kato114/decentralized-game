import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  crypto
} from "@graphprotocol/graph-ts";
import {
  Global,
  Account,
  Token,
  Allowance,
  ApprovalEvent,
  Balance,
  TransferEvent,
  NFTAllowance,
  NFTItem,
  Claim,
  Icedrop,
} from "../../generated/schema";
import {
  ERC20
} from "../../generated/templates/ERC20/ERC20";

export let ZERO = BigInt.fromI32(0);
export let ONE = BigInt.fromI32(1);
export let MONE = BigInt.fromI32(-1);
export let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export let BURN_ADDRESS = "0x0111011001100001011011000111010101100101";

function charToI32(
  _ch: string
): i32 {
  if (_ch == '0') {
    return 0;
  } else if (_ch == '1') {
    return 1;
  } else if (_ch == '2') {
    return 2;
  } else if (_ch == '3') {
    return 3;
  } else if (_ch == '4') {
    return 4;
  } else if (_ch == '5') {
    return 5;
  } else if (_ch == '6') {
    return 6;
  } else if (_ch == '7') {
    return 7;
  } else if (_ch == '8') {
    return 8;
  } else if (_ch == '9') {
    return 9;
  } else {
    return 0;
  }
}

function concatByteArrays(
  _a: ByteArray,
  _b: ByteArray
): ByteArray {
  let out = new Uint8Array(_a.length + _b.length);
  for (let i = 0; i < _a.length; i++) out[i] = _a[i];
  for (let j = 0; j < _b.length; j++) out[_a.length + j] = _b[j];
  return out as ByteArray;
}

export function convertStringToBigInt(
  _str: string
): BigInt {
  let decimal = BigInt.fromI32(1);
  let value = BigInt.fromI32(0);
  for (let i = _str.length - 1; i >= 0; i--) {
    value = value.plus(BigInt.fromI32(charToI32(_str[i])).times(decimal));
    decimal = decimal.times(BigInt.fromI32(10));
  }

  return value;
}

export function getBaseTimestamp(
  _timestamp: BigInt,
  _type: string
): i32 {
  let timestamp = _timestamp.toI32();
  if (_type == 'All') {
    timestamp = 0;
  } else if (_type == 'Day') {
    timestamp = timestamp / 86400 * 86400;
  } else if (_type == 'Hour') {
    timestamp = timestamp / 3600 * 3600;
  }

  return timestamp as i32;
}

export function getHash(
  _a: Address,
  _b: string
): string {
  return crypto.keccak256(
    concatByteArrays(_a, ByteArray.fromUTF8(_b))
  ).toHexString();
}

export function getOrCreateGlobal(
  _name: string,
  _timestamp: BigInt,
  _type: string = null,
): Global {
  let globalId = _name;
  let baseTime = _timestamp.toI32();
  if (_type) {
    globalId = globalId + '_' + _type;
    if (_timestamp) {
      baseTime = getBaseTimestamp(_timestamp, _type);
      globalId = globalId + '_' + baseTime.toString();
    }
  }
  let global = Global.load(globalId);

  if (!global) {
    global = new Global(globalId);
    global.numberValue = BigInt.fromI32(0);
    global.type = _type;
    global.timestamp = baseTime;
    global.save();
  }

  return global as Global;
}

export function createOrUpdateGlobal(
  _name: string,
  _timestamp: BigInt,
  _numValue: BigInt,
  _strValue: Bytes|null = null,
): void {
  let global = getOrCreateGlobal(_name, _timestamp, null);
  if (_strValue) {
    global.stringValue = _strValue;
  } else {
    global.numberValue = global.numberValue.plus(_numValue);
  }
  global.save();

  if (!_strValue) {
    let globalDay = getOrCreateGlobal(_name, _timestamp, "Day");
    globalDay.numberValue = global.numberValue;
    globalDay.save();

    let globalHour = getOrCreateGlobal(_name, _timestamp, "Hour");
    globalHour.numberValue = global.numberValue;
    globalHour.save();

    let globalNewDay = getOrCreateGlobal("New" + _name, _timestamp, "Day");
    globalNewDay.numberValue = globalNewDay.numberValue.plus(_numValue);
    globalNewDay.save();

    let globalNewHour = getOrCreateGlobal("New" + _name, _timestamp, "Hour");
    globalNewHour.numberValue = globalNewHour.numberValue.plus(_numValue);
    globalNewHour.save();
  }
}

export function getOrCreateAccount(
  _address: string,
  _timestamp: BigInt = null
): Account {
  let accountId = _address;
  let account = Account.load(accountId);

  if (!account) {
    let global = getOrCreateGlobal("Accounts", ZERO, null);

    account = new Account(accountId);
    account.index = global.numberValue;
    account.address = Address.fromString(_address);
    account.isWorker = false;
    account.save();

    global.numberValue = global.numberValue.plus(ONE);
    global.save();
  }

  if (_timestamp) {
    account.updatedAt = _timestamp.toI32();
    account.save();
  }

  return account as Account;
}

export function getOrCreateToken(
  _address: string,
  _isNFT: boolean = false
): Token {
  let token = Token.load(_address);

  if (!token) {
    let tokenContract = ERC20.bind(Address.fromString(_address));

    token = new Token(_address);
    token.address = Address.fromString(_address);
    token.name = tokenContract.name()
    token.symbol = tokenContract.symbol();
    token.isNFT = false;
    token.totalSupply = ZERO;
    token.save();
  }

  if (_isNFT) {
    token.isNFT = true;
    token.save();
  }
  return token as Token;
}

export function createOrUpdateAllowance(
  _address: string,
  _owner: string,
  _spender: string,
  _value: BigInt,
  _isNFT: boolean
): void {
  if (_isNFT) {
    let allowanceId = _address + '_' + _owner + '_' + _spender + '_' + _value.toString();
    let allowance = NFTAllowance.load(allowanceId);

    if (!allowance) {
      allowance = new NFTAllowance(allowanceId);
      let token = getOrCreateToken(_address, true);
      let ownerAccount = getOrCreateAccount(_owner);
      let spenderAccount = getOrCreateAccount(_spender);
      allowance.token = token.id;
      allowance.owner = ownerAccount.id;
      allowance.spender = spenderAccount.id;
      allowance.tokenId = _value;
    }

    allowance.save();
  } else {
    let allowanceId = _address + '_' + _owner + '_' + _spender;
    let allowance = Allowance.load(allowanceId);

    if (!allowance) {
      allowance = new Allowance(allowanceId);
      let token = getOrCreateToken(_address);
      let ownerAccount = getOrCreateAccount(_owner);
      let spenderAccount = getOrCreateAccount(_spender);
      allowance.token = token.id;
      allowance.owner = ownerAccount.id;
      allowance.spender = spenderAccount.id;
    }

    allowance.amount = _value;
    allowance.save();
  }
}

export function getOrCreateClaim(
  _address: string,
  _type: string,
  _timestamp: BigInt
): Claim {
  let timestamp = getBaseTimestamp(_timestamp, _type);
  let account = getOrCreateAccount(_address);
  let claimId = _address + '_' + _type + '_' + timestamp.toString();
  let claim = Claim.load(claimId);

  if (!claim) {
    claim = new Claim(claimId);
    claim.account = account.id;
    claim.type = _type;
    claim.total = ZERO;
    claim.timestamp = timestamp;
    claim.save();
  }

  return claim as Claim;
}

export function createOrUpdateClaim(
  _address: string,
  _type: string,
  _timestamp: BigInt,
  _amount: BigInt
): void {
  let claim = getOrCreateClaim(_address, _type, _timestamp);
  claim.total = claim.total.plus(_amount);
  claim.save();

  let totalClaim = getOrCreateClaim(ZERO_ADDRESS, _type, _timestamp);
  totalClaim.total = totalClaim.total.plus(_amount);
  totalClaim.save();
}

export function getOrCreateIcedrop(
  _address: string,
  _type: string,
  _timestamp: BigInt
): Icedrop {
  let timestamp = getBaseTimestamp(_timestamp, _type);
  let icedropId = _address + '_' + _type + '_' + timestamp.toString();
  let icedrop = Icedrop.load(icedropId);

  if (!icedrop) {
    icedrop = new Icedrop(icedropId);
    icedrop.ipfsAddress = _address;
    icedrop.type = _type;
    icedrop.total = ZERO;
    icedrop.timestamp = timestamp;
    icedrop.save();
  }

  return icedrop as Icedrop;
}

export function createOrUpdateIcedrop(
  _address: string,
  _type: string,
  _timestamp: BigInt,
  _amount: BigInt
): void {
  let icedrop = getOrCreateIcedrop(_address, _type, _timestamp);
  icedrop.total = icedrop.total.plus(_amount);
  icedrop.save();

  let totalIcedrop = getOrCreateIcedrop(ZERO_ADDRESS, _type, _timestamp);
  totalIcedrop.total = totalIcedrop.total.plus(_amount);
  totalIcedrop.save();
}

export function createApprovalEvent(
  _hash: string,
  _address: string,
  _owner: string,
  _spender: string,
  _value: BigInt,
  _timestamp: BigInt,
  _isNFT: boolean = false
): ApprovalEvent {
  createOrUpdateAllowance(
    _address,
    _owner,
    _spender,
    _value,
    _isNFT
  );

  let approvalId = _hash;
  let approval = new ApprovalEvent(approvalId);
  let ownerAccount = getOrCreateAccount(_owner, _timestamp);
  let spenderAccount = getOrCreateAccount(_spender, _timestamp);
  let token = getOrCreateToken(_address);

  approval.token = token.id;
  approval.owner = ownerAccount.id;
  approval.spender = spenderAccount.id;
  approval.amount = _value;
  approval.save();

  return approval as ApprovalEvent;
}

export function getOrCreateBalance(
  _account: string,
  _token: string
): Balance {
  let account = getOrCreateAccount(_account);
  let token = getOrCreateToken(_token);

  let balanceId = _account + '_' + _token;
  let balance = Balance.load(balanceId);

  if (!balance) {
    balance = new Balance(balanceId);
    balance.account = account.id;
    balance.token = token.id;
    balance.balance = ZERO;
    balance.save();
  }

  return balance as Balance;
}

export function createOrUpdateBalance(
  _account: string,
  _token: string,
  _balance: BigInt,
  _timestamp: BigInt
): void {
  let balance = getOrCreateBalance(_account, _token);
  if (balance.balance.gt(ZERO) && _balance.isZero()) {
    createOrUpdateGlobal("UniqueWallet_" + _token, _timestamp, MONE);
  } else if (balance.balance.isZero() && _balance.gt(ZERO)) {
    createOrUpdateGlobal("UniqueWallet_" + _token, _timestamp, ONE);
  }
  balance.balance = _balance;
  balance.save();
}

export function getOrCreateNFTItem(
  _token: string,
  _tokenId: BigInt,
  _timestamp: BigInt
): NFTItem {
  let token = getOrCreateToken(_token, true);

  let itemId = _token + '_' + _tokenId.toString();
  let item = NFTItem.load(itemId);

  if (!item) {
    item = new NFTItem(itemId);
    item.owner = ZERO_ADDRESS;
    item.token = token.id;
    item.tokenId = _tokenId;
    item.level = ONE;
    item.createdAt = _timestamp.toI32();
    item.save();
  }

  return item as NFTItem;
}

export function createOrUpdateNFTItem(
  _account: string,
  _token: string,
  _tokenId: BigInt,
  _timestamp: BigInt
): void {
  let account = getOrCreateAccount(_account);

  let item = getOrCreateNFTItem(
    _token,
    _tokenId,
    _timestamp
  );

  item.owner = account.id;
  item.save();

  return;
}

export function createTransferEvent(
  _hash: string,
  _address: string,
  _from: string,
  _to: string,
  _value: BigInt,
  _timestamp: BigInt,
  _isNFT: boolean = false
): void {
  let token = getOrCreateToken(_address, _isNFT);
  let fromAccount = getOrCreateAccount(_from, _timestamp);
  let toAccount = getOrCreateAccount(_to, _timestamp);

  createOrUpdateNFTItem(
    _to,
    _address,
    _value,
    _timestamp
  );

  if (_from != ZERO_ADDRESS) {
    createOrUpdateBalance(
      _from,
      _address,
      getOrCreateBalance(
        _from,
        _address
      ).balance.minus(_isNFT ? ONE : _value),
      _timestamp
    );
    fromAccount.save();
  } else {
    token.totalSupply = token.totalSupply.plus(_isNFT ? ONE : _value);
    token.save();
  }

  if (_to != ZERO_ADDRESS) {
    createOrUpdateBalance(
      _to,
      _address,
      getOrCreateBalance(
        _to,
        _address
      ).balance.plus(_isNFT ? ONE : _value),
      _timestamp
    );
    toAccount.save();
  } else {
    token.totalSupply = token.totalSupply.minus(_isNFT ? ONE : _value);
    token.save();
  }

  let transferEvent = new TransferEvent(_hash);
  transferEvent.token = token.id;
  transferEvent.from = _from;
  transferEvent.to = _to;
  transferEvent.value = _value;
  transferEvent.save();
}
