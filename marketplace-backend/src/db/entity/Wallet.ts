import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { VerifiedCreator, Transaction } from "./index";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  wallet: string;

  // @OneToOne(() => Listing, (listing) => listing.wallet)
  // listing: Listing;

  @OneToOne(() => Transaction, (transaction) => transaction.walletBuyer)
  transactionBuyer: Transaction;

  @OneToOne(() => Transaction, (transaction) => transaction.walletSeller)
  transactionSeller: Transaction;

  @OneToOne(
    () => VerifiedCreator,
    (verifiedCreator) => verifiedCreator.walletVerifiedCreator
  )
  verifiedCreator: VerifiedCreator;
}
