import { IssueEvent, NFTApproval } from "../../generated/schema";
import {
  Approval,
  ApprovalForAll,
  Issue,
  Transfer
} from "../../generated/WearableNFT/WearableNFT";
import {
  createApprovalEvent,
  createOrUpdateGlobal,
  createTransferEvent,
  getOrCreateAccount,
  getOrCreateToken,
  ONE,
} from "./common";

export function handleApprovalEvent(
  _event: Approval
): void {
  createApprovalEvent(
    _event.transaction.hash.toHexString(),
    _event.address.toHexString(),
    _event.params.owner.toHexString(),
    _event.params.approved.toHexString(),
    _event.params.tokenId,
    _event.block.timestamp,
    true
  );
}

export function handleApprovalForAllEvent(
  _event: ApprovalForAll
): void {
  let approvalId = _event.address.toHexString()
    + '_' + _event.params.owner.toHexString()
    + '_' + _event.params.operator.toHexString();
  let approval = NFTApproval.load(approvalId);

  if (!approval) {
    approval = new NFTApproval(approvalId);
    let token = getOrCreateToken(_event.address.toHexString());
    let ownerAccount = getOrCreateAccount(_event.params.owner.toHexString());
    let operatorAccount = getOrCreateAccount(_event.params.operator.toHexString());
    approval.token = token.id;
    approval.owner = ownerAccount.id;
    approval.operator = operatorAccount.id;
    approval.approved = false;
  }

  approval.approved = _event.params.approved;
  approval.save();
}

export function handleTransferEvent(
  _event: Transfer
): void {
  createTransferEvent(
    _event.transaction.hash.toHexString(),
    _event.address.toHexString(),
    _event.params.from.toHexString(),
    _event.params.to.toHexString(),
    _event.params.tokenId,
    _event.block.timestamp,
    true
  );
}

export function handleIssueEvent(
  _event: Issue
): void {
  createOrUpdateGlobal(
    "IssueCount_" + _event.address.toHexString(),
    _event.block.timestamp,
    ONE,
    null
  );

  let beneficiary = getOrCreateAccount(
    _event.params._beneficiary.toHexString()
  );
  let caller = getOrCreateAccount(
    _event.params._caller.toHexString()
  );
  let token = getOrCreateToken(
    _event.address.toHexString()
  );

  let eventID = _event.transaction.hash.toHexString();
  let newEvent = new IssueEvent(eventID);
  newEvent.beneficiary = beneficiary.id;
  newEvent.token = token.id;
  newEvent.tokenId = _event.params._tokenId;
  newEvent.itemId = _event.params._itemId;
  newEvent.issuedId = _event.params._issuedId;
  newEvent.caller = caller.id;
  newEvent.timestamp = _event.block.timestamp;
  newEvent.save();
}