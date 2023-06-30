import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class NftType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50 })
  name: string;

  // @OneToOne(() => NftAddress, (nftAddress) => nftAddress.nftType)
  // nftAddress: NftAddress;
}
