import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Wallet } from "./index";

@Entity()
export class VerifiedCreator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Wallet, (wallet) => wallet.verifiedCreator)
  @JoinColumn()
  walletVerifiedCreator: Wallet;
}
