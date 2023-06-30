import express from "express";
import * as marketplaceController from "../controllers/marketplace.controller";
const marketplaceRouter = express.Router();

marketplaceRouter.get(
  "/marketplace",
  marketplaceController.getMarketListingsGrouped
);

marketplaceRouter.get(
  "/marketplace/:nftAddress/:resourceId",
  marketplaceController.getMarketListingsByNftAddressResourceId
);

marketplaceRouter.get(
  "/marketplace-update/:address",
  marketplaceController.updateListings
);

marketplaceRouter.get(
  "/user/nfts/:sellerAddress",
  marketplaceController.getSellerNfts
);

export { marketplaceRouter };
