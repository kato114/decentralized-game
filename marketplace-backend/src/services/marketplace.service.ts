import { DeleteResult } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { MarketListing, MarketListingGrouped } from "../db/entity/index";

import {
  IWSSResponse,
  INftSoldReq,
  IUpdateNftDbPrice,
  INftData,
  INftBoughtReq,
} from "../interfaces";
import { getTokenFromAddress, getNftPrice, getTokenData } from "./wss.service";

export const getMarketListingsGrouped = async (): Promise<
  MarketListingGrouped[]
> => {
  const marketListingGroupedRepository =
    AppDataSource.getRepository(MarketListingGrouped);
  const marketListingGrouped = await marketListingGroupedRepository.find();
  return marketListingGrouped;
};

export const getMarketListingsByNftAddressResourceId = async ({
  nftAddress,
  resourceId,
}: {
  nftAddress: string;
  resourceId: string;
}): Promise<MarketListing[]> => {
  const marketListingRepository = AppDataSource.getRepository(MarketListing);
  const listingsByNftAddressSymbol = await marketListingRepository.find({
    where: {
      nftAddress,
      resourceId,
    },
  });
  return listingsByNftAddressSymbol;
};

const filterResponse = async (
  wssResponse: IWSSResponse
): Promise<{
  tokensToAdd: Array<INftData>;
  tokensToRemove: Array<string>;
}> => {
  const tokensToAdd: Array<INftData> = [];
  const tokensToRemove: Array<string> = [];

  const marketRepository = AppDataSource.getRepository(MarketListing);
  const marketListings = await marketRepository.find();
  wssResponse.result.forEach((result) => {
    if (
      !marketListings.some(
        (marketListing) =>
          marketListing.tokenId === result.token_id &&
          marketListing.nftAddress === result.token_address
      )
    )
      tokensToAdd.push(result);
  });
  marketListings.forEach((marketListing) => {
    const found = wssResponse.result.find(
      (result) =>
        result.token_id === marketListing.tokenId &&
        result.token_address === marketListing.nftAddress
    );
    if (!found) tokensToRemove.push(marketListing.tokenId);
  });
  return { tokensToAdd, tokensToRemove };
};

const insertNftToMarket = async (nftData: INftData) => {
  const marketRepository = AppDataSource.getRepository(MarketListing);
  const marketListing = new MarketListing();
  const {
    metadata,
    token_id,
    name,
    token_address,
    symbol,
    contract_type,
    price,
  } = nftData;
  const parsedMetadata = JSON.parse(metadata);
  const { image, description, thumbnail } = parsedMetadata;
  marketListing.contractType = contract_type;
  marketListing.imageUrl = image;
  marketListing.resourceId = image.split("/").pop();
  marketListing.thumbnailUrl = thumbnail;
  marketListing.nftAddress = token_address;
  marketListing.symbol = symbol;
  marketListing.description = description;
  marketListing.name = name;
  marketListing.tokenId = token_id;
  marketListing.price = price;
  marketListing.sellerAddress = nftData.from;
  marketListing.sync = true;
  marketListing.lastSync = new Date();

  return await marketRepository.save(marketListing);
};

export const updateListings = async (address: string) => {
  const marketRepository = AppDataSource.getRepository(MarketListing);
  const moralisResponse = await getTokenFromAddress(address);

  const updatedMoralisResponse = await updateMoralisResponseNftPrice(
    moralisResponse
  );
  const { tokensToAdd, tokensToRemove } = await filterResponse(
    updatedMoralisResponse as IWSSResponse
  );
  for (const item of tokensToAdd) {
    const {
      metadata,
      token_id,
      name,
      token_address,
      symbol,
      contract_type,
      price,
    } = item;

    const parsedMetadata = JSON.parse(metadata);
    const { image, description, thumbnail } = parsedMetadata;

    const marketListing = new MarketListing();

    marketListing.contractType = contract_type;
    marketListing.imageUrl = image;
    marketListing.resourceId = image.split("/").pop();
    marketListing.thumbnailUrl = thumbnail;
    marketListing.nftAddress = token_address;
    marketListing.symbol = symbol;
    marketListing.description = description;
    marketListing.name = name;
    marketListing.tokenId = token_id;
    marketListing.price = price;
    marketListing.sync = true;
    marketListing.lastSync = new Date();

    await marketRepository.save(marketListing);
  }

  if (tokensToRemove.length) {
    await marketRepository.delete(tokensToRemove);
  }
  await updateAllNftPrice(updatedMoralisResponse);
  const marketListings = await marketRepository.find();
  return {
    marketListings,
    tokensAdded: tokensToAdd.length,
    tokensRemoved: tokensToRemove.length,
  };
};

const updateMoralisResponseNftPrice = async (
  moralisResponse: IWSSResponse
): Promise<IWSSResponse> => {
  for (const token of moralisResponse.result) {
    const { token_address, token_id } = token;
    const price = await getNftPrice(token_address, token_id);
    token.price = price;
  }
  return moralisResponse;
};

const updateNftDBPrice = async ({
  nftAddress,
  tokenId,
  price,
}: IUpdateNftDbPrice) => {
  const marketRepository = AppDataSource.getRepository(MarketListing);
  try {
    marketRepository
      .createQueryBuilder("market_listing")
      .where({
        nftAddress,
        tokenId,
      })
      .update({ price })
      .execute();
  } catch (err) {
    throw new Error(err);
  }
};

const updateAllNftPrice = async (
  moralisResponse: IWSSResponse
): Promise<void> => {
  for (const token of moralisResponse.result) {
    const { token_address, token_id, price } = token;
    try {
      await updateNftDBPrice({
        nftAddress: token_address,
        tokenId: token_id,
        price,
      });
    } catch (error) {
      console.log("Update NFT price error: ", error);
    }
  }
};

export const nftSold = async ({
  nftAddress,
  tokenId,
  price,
  to,
  from,
}: INftSoldReq): Promise<MarketListing> => {
  const nftData = await getTokenData({ nftAddress, tokenId });
  nftData.price = price;
  nftData.to = to;
  nftData.from = from;
  try {
    return await insertNftToMarket(nftData);
  } catch (err) {
    console.log("nftSold::err ", err);
  }
};

export const nftCancel = async ({
  nftAddress,
  tokenId,
}: INftBoughtReq): Promise<DeleteResult> => {
  try {
    const marketListingRepository = AppDataSource.getRepository(MarketListing);
    return await marketListingRepository.delete({ nftAddress, tokenId });
  } catch (err) {
    console.log("nftCancel::err ", err);
  }
};

export const nftBought = async ({
  nftAddress,
  tokenId,
}: INftBoughtReq): Promise<DeleteResult> => {
  try {
    const marketListingRepository = AppDataSource.getRepository(MarketListing);
    return await marketListingRepository.delete({ nftAddress, tokenId });
  } catch (err) {
    console.log("nftBought::err ", err);
  }
};

export const getSellerNfts = async (
  sellerAddress: string
): Promise<MarketListing[]> => {
  try {
    const marketListingRepository = AppDataSource.getRepository(MarketListing);
    return await marketListingRepository.find({
      where: {
        sellerAddress,
      },
    });
  } catch (err) {
    console.log("getSellerNfts::err ", err);
  }
};
