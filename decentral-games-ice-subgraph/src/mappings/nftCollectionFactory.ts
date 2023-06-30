import {
  ProxyCreated
} from "../../generated/ERC721CollectionFactoryV2/ERC721CollectionFactoryV2";
import { ProxyCreatedEvent } from "../../generated/schema";
import { NFTCollection } from "../../generated/templates";
import { getOrCreateToken } from "./common";

export const NFT_CONTRACT_ADDRESSES: string[] = [
  "0xcb06f6aee0655252a3f6f2884680421d55d3c645",
  "0x4cd15dcd96362cf85e19039c3c2d661e5e43145e",
  "0xd79cf5a41d8caec4688e01b4754ea2da6f51e856",
  "0xd07a56f7198ae6e4e3d6738bd8c4b81d21bf0403",
  "0x897243a54b03b46a17b55d5609465e9719a6ffa0",
  "0x09eeac7dff0dc304e25cbb7bdbfae798488fc34f",
  "0x451612c0e742e27f2cfb3888ad2813eec8dd1ba3",
  "0xa96f7f2102c27a61e3a660d964e9aa613b68fe6b",
  "0x49cb83b4c4980029200b6759d5fb7d3b21f10134",
  "0xc60f0a9df4d42f593b3675755a55e1de97f82a05",
  "0x5b2d60db65d80593bd5c5d36fcd99717ef03e850",
  "0xda41c9e3808237b4ab8f6abd6936a828f4225263",
  "0x446c19903c267ae944eab6eca1f8603245be6b80",
  "0x62340bf727c536400a15bd41f62b4c684232c57a"
];

export function handleProxyCreated(
  _event: ProxyCreated
): void {
  if (
    NFT_CONTRACT_ADDRESSES.includes(
      _event.params._address.toHexString()
    )
  ) {
    let token = getOrCreateToken(
      _event.params._address.toHexString(),
      true
    );

    NFTCollection.create(_event.params._address);

    let eventID = _event.transaction.hash.toHexString();
    let newEvent = new ProxyCreatedEvent(eventID);
    newEvent.collection = token.id;
    newEvent.salt = _event.params._salt;
    newEvent.save();
  }
}
