export interface ITransactionLog {
  transactionHash: string;
  blockNumber: number;
  type: string;
  status?: string;
}
