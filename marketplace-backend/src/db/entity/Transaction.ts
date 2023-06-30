import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { Wallet } from "./index";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Wallet, (wallet) => wallet.transactionBuyer)
  @JoinColumn()
  walletBuyer: Wallet;

  @OneToOne(() => Wallet, (wallet) => wallet.transactionSeller)
  @JoinColumn()
  walletSeller: Wallet;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;
}
