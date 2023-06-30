import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  expression: `
      SELECT 
      market_listing.*
        FROM
        market_listing
                INNER JOIN
            (SELECT 
                MIN(created_at) created_at,
                market_listing.nftAddress,
                market_listing.price,
                market_listing.resourceId
            FROM
              market_listing
            INNER JOIN (SELECT 
                MIN(price) AS price, nftAddress, resourceId
            FROM
            market_listing
            GROUP BY nftAddress , resourceId) market_listing2 ON market_listing.price = market_listing2.price
                AND market_listing.nftAddress = market_listing2.nftAddress
                AND market_listing.resourceId = market_listing2.resourceId
            GROUP BY nftAddress , price , resourceId) market_listing3 ON market_listing.price = market_listing3.price
                AND market_listing.created_at = market_listing3.created_at
                AND market_listing.resourceId = market_listing3.resourceId
                AND market_listing.nftAddress = market_listing3.nftAddress
            ORDER BY market_listing.price ASC,
		          market_listing.created_at ASC

  `,
})
export class MarketListingGrouped {
  @ViewColumn()
  nftAddress: string;

  @ViewColumn()
  tokenId: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  price: string;

  @ViewColumn()
  description: string;

  @ViewColumn()
  symbol: string;

  @ViewColumn()
  contractType: string;

  @ViewColumn()
  resourceId: string;

  @ViewColumn()
  imageUrl: string;

  @ViewColumn()
  thumbnailUrl: string;

  @ViewColumn()
  sellerAddress: string;

  @ViewColumn()
  sync: Boolean;

  @ViewColumn()
  views: number;

  @ViewColumn()
  active: Boolean;

  @ViewColumn()
  created_at: Date;

  @ViewColumn()
  updated_at: Date;
}
