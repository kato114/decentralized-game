import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class MarketListing {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ type: "varchar", length: 255 })
  nftAddress: string;

  @PrimaryColumn({ type: "varchar", length: 255 })
  tokenId: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "double" })
  price: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  symbol: string;

  @Column({ type: "varchar", length: 50 })
  contractType: string;

  @Column({ type: "varchar", length: 255 })
  resourceId: string;

  @Column({ type: "varchar", length: 255 })
  imageUrl: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  thumbnailUrl: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  sellerAddress: string;

  @Column({ type: "boolean", default: false })
  sync: Boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastSync: Date;

  @Column({ type: "int", default: 0 })
  views: number;

  @Column({ type: "boolean", default: true })
  active: Boolean;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;
}
