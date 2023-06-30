import { Request, Response } from "express";
import * as marketplaceService from "../services/marketplace.service";

export const getMarketListingsGrouped = async (_: Request, res: Response) => {
  try {
    const marketListingsGrouped =
      await marketplaceService.getMarketListingsGrouped();
    return res.status(200).json({
      status: 200,
      data: marketListingsGrouped,
      message: "Succesfully Listings Retrieved",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export const getMarketListingsByNftAddressResourceId = async (
  req: Request,
  res: Response
) => {
  try {
    const { nftAddress, resourceId } = req.params;
    const marketListingsByNftAddressSymbol =
      await marketplaceService.getMarketListingsByNftAddressResourceId({
        nftAddress,
        resourceId,
      });
    return res.status(200).json({
      status: 200,
      data: marketListingsByNftAddressSymbol,
      message: "Succesfully Listings Retrieved",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export const updateListings = async (req: Request, res: Response) => {
  const { address } = req.params;
  try {
    const { marketListings, tokensAdded, tokensRemoved } =
      await marketplaceService.updateListings(address);
    return res.status(200).json({
      status: 200,
      data: { marketListings, tokensAdded, tokensRemoved },
      message: "Succesfully Listing Saved",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export const getSellerNfts = async (req: Request, res: Response) => {
  const { sellerAddress } = req.params;
  try {
    const sellerNfts = await marketplaceService.getSellerNfts(sellerAddress);
    return res.status(200).json({
      status: 200,
      data: sellerNfts,
      message: "Succesfully Listing Seller Nfts",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
