import {
  Claimed,
  NewIcedrop,
  Withdraw
} from "../../generated/IceKeeper/IceKeeper";
import {
  ClaimedEvent,
  NewIcedropEvent,
  WithdrawEvent,
} from "../../generated/schema";
import {
  getOrCreateAccount,
  createOrUpdateClaim,
  createOrUpdateIcedrop
} from "./common";

export function handleClaimedEvent(
  _event: Claimed
): void {
  let account = getOrCreateAccount(_event.params.account.toHexString());

  createOrUpdateClaim(
    account.id,
    'Day',
    _event.block.timestamp,
    _event.params.amount
  );
  createOrUpdateClaim(
    account.id,
    'Hour',
    _event.block.timestamp,
    _event.params.amount
  );
  createOrUpdateClaim(
    account.id,
    'All',
    _event.block.timestamp,
    _event.params.amount
  );

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new ClaimedEvent(eventID);
  newEvent.index = _event.params.index;
  newEvent.account = account.id;
  newEvent.amount = _event.params.amount;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}

export function handleNewIcedropEvent(
  _event: NewIcedrop
): void {
  let account = getOrCreateAccount(_event.params.master.toHexString());

  createOrUpdateIcedrop(
    _event.params.ipfsAddress.toHexString(),
    'Day',
    _event.block.timestamp,
    _event.params.total
  );
  createOrUpdateIcedrop(
    _event.params.ipfsAddress.toHexString(),
    'Hour',
    _event.block.timestamp,
    _event.params.total
  );
  createOrUpdateIcedrop(
    _event.params.ipfsAddress.toHexString(),
    'All',
    _event.block.timestamp,
    _event.params.total
  );

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new NewIcedropEvent(eventID);
  newEvent.hash = _event.params.hash;
  newEvent.master = account.id;
  newEvent.ipfsAddress = _event.params.ipfsAddress;
  newEvent.total = _event.params.total;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}
export function handleWithdrawEvent(
  _event: Withdraw
): void {
  let account = getOrCreateAccount(_event.params.account.toHexString());

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new WithdrawEvent(eventID);
  newEvent.account = account.id;
  newEvent.amount = _event.params.amount;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}
