export interface GasUsed {
  _hex: string;
  _isBigNumber: boolean;
}

export interface TransactionReceiptLog {
  transactionIndex: number;
  blockNumber: number;
  transactionHash: string;
  address: string;
  topics: string[];
  data: string;
  logIndex: number;
  blockHash: string;
}

export interface CumulativeGasUsed {
  _hex: string;
  _isBigNumber: boolean;
}

export interface EffectiveGasPrice {
  _hex: string;
  _isBigNumber: boolean;
}

export interface ITransactionReceipt {
  to: string;
  from: string;
  contractAddress?: any;
  transactionIndex: number;
  gasUsed: GasUsed;
  logsBloom: string;
  blockHash: string;
  transactionHash: string;
  logs: TransactionReceiptLog[];
  blockNumber: number;
  confirmations: number;
  cumulativeGasUsed: CumulativeGasUsed;
  effectiveGasPrice: EffectiveGasPrice;
  status?: number;
  type: number;
  byzantium: boolean;
}
