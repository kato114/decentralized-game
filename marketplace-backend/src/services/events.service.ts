import dotenv from "dotenv";
import { providers, Contract, ethers } from "ethers";
import abi from "../abi/abi";
import { sortBy, filter } from "lodash";
import { AppDataSource } from "../db/data-source";
import { nftSold, nftBought, nftCancel } from "./marketplace.service";
import { TransactionLog } from "../db/entity/index";
import {
  ITransactionLog,
  ITransactionData,
  ITransactionBlockchainLog,
} from "../interfaces";

dotenv.config();

const { ALCHEMY_API_KEY, CONTRACT_ADDRESS } = process.env;
const transactionLogRepository = AppDataSource.getRepository(TransactionLog);

const provider = new providers.AlchemyProvider("matic", ALCHEMY_API_KEY);
const contract = new Contract(CONTRACT_ADDRESS, abi, provider);
const IContract = new ethers.utils.Interface(abi);

const IBuyFunction = new ethers.utils.Interface([
  "function buy(address,uint256[])",
]);

const ISellFunction = new ethers.utils.Interface([
  "function sell(address _nftAddress, uint256[] _tokenIds, uint256[] _prices)",
]);

const ICancelFunction = new ethers.utils.Interface([
  "function cancel(address,uint256[])",
]);

const buyEventTopic = ethers.utils.id("Buy(address,uint256[])");
const sellEventTopic = ethers.utils.id("Sell(address,uint256[],uint256[])");
const cancelEventTopic = ethers.utils.id("Cancel(address,uint256[])");

export const rebuildLostTransactions = async () => {
  try {
    await rebuildPendingTransactions();
    const lastestTransaction = await getLatestTransaction();
    const fromBlock = lastestTransaction?.blockNumber || 0;
    console.log("rebuildLostTransactions::fromBlock: ", fromBlock);
    const missedLogs = await getAllMissedLogs(fromBlock);
    let filtredMissedLogs = null;
    if (lastestTransaction) {
      filtredMissedLogs = filter(
        missedLogs,
        (l: ITransactionBlockchainLog) =>
          l.transactionHash !== lastestTransaction.transactionHash
      );
    }
    console.log(
      "rebuildLostTransactions::logs: ",
      filtredMissedLogs || missedLogs
    );
    await rebuildTransactions(filtredMissedLogs || missedLogs);
  } catch (error) {
    console.log("rebuildLostTransactions::error: ", error);
  }
};

const getAllMissedLogs = async (
  fromBlock: number
): Promise<Array<ITransactionBlockchainLog>> => {
  const toBlock = "latest";
  const baseLog = {
    fromBlock,
    toBlock,
    address: contract.address,
    topics: [sellEventTopic],
  };
  const sellLogs = await provider.getLogs(baseLog);
  baseLog.topics = [buyEventTopic];
  const buyLogs = await provider.getLogs(baseLog);
  baseLog.topics = [cancelEventTopic];
  const cancelLogs = await provider.getLogs(baseLog);
  return sortBy(
    [
      ...sellLogs.map((l) => ({ ...l, type: "Sell" })),
      ...buyLogs.map((l) => ({ ...l, type: "Buy" })),
      ...cancelLogs.map((l) => ({ ...l, type: "Cancel" })),
    ],
    ["blockNumber"]
  );
};

const rebuildPendingTransactions = async (): Promise<void> => {
  try {
    const pendingTransactions = await getPendingTransactions();
    for (const pTx of pendingTransactions) {
      const { type, transactionHash } = pTx;
      const txData = await getTransactionData(transactionHash);
      const { from, to, data } = txData;
      const decodedData =
        type === "Sell"
          ? ISellFunction.decodeFunctionData("sell", data)
          : IBuyFunction.decodeFunctionData("buy", data);
      const [nftAddress, hTokenId = [], hPrice = []] = decodedData;
      const tokenId = hex2Dec(hTokenId[0]._hex);
      if (type === "Sell") {
        const price = hex2Dec(hPrice[0]._hex);
        const result = await nftSold({ nftAddress, tokenId, from, to, price });
        await transactionCompleted(pTx.transactionHash);
      } else if (type === "Buy") {
        const result = await nftBought({ nftAddress, tokenId, from, to });
        await transactionCompleted(pTx.transactionHash);
      } else if (type === "Cancel") {
        const result = await nftBought({ nftAddress, tokenId, from, to });
        await transactionCompleted(pTx.transactionHash);
      }
    }
  } catch (error) {
    console.log("rebuildPendingTransactions::err ", error);
  }
};

const rebuildTransactions = async (logs: Array<ITransactionBlockchainLog>) => {
  try {
    for (const log of logs) {
      const { type, transactionHash, blockNumber } = log;
      const txData = await getTransactionData(transactionHash);
      const { from, to, data } = txData;
      let decodedData = null;
      switch (type) {
        case "Sell":
          decodedData = ISellFunction.decodeFunctionData("sell", data);
          break;
        case "Buy":
          decodedData = IBuyFunction.decodeFunctionData("buy", data);
          break;
        case "Cancel":
          decodedData = ICancelFunction.decodeFunctionData("cancel", data);
          break;
        default:
          break;
      }
      const [nftAddress, hTokenId = [], hPrice = []] = decodedData;
      const tokenId = hex2Dec(hTokenId[0]._hex);
      if (type === "Sell") {
        await transactionStarted({
          transactionHash,
          blockNumber,
          type: "Sell",
        });
        const price = hex2Dec(hPrice[0]._hex);
        const result = await nftSold({ nftAddress, tokenId, from, to, price });
        await transactionCompleted(log.transactionHash);
      } else if (type === "Buy") {
        await transactionStarted({
          transactionHash,
          blockNumber,
          type: "Buy",
        });
        const result = await nftBought({ nftAddress, tokenId, from, to });
        await transactionCompleted(log.transactionHash);
      } else if (type === "Cancel") {
        await transactionStarted({
          transactionHash,
          blockNumber,
          type: "Cancel",
        });
        const result = await nftCancel({ nftAddress, tokenId, from, to });
        await transactionCompleted(log.transactionHash);
      }
    }
    return logs;
  } catch (err) {
    throw new Error("Something went wrong while retrieving event: " + err);
  }
};
const getTransactionData = async (
  txHash: string
): Promise<ITransactionData> => {
  return await provider.getTransaction(txHash);
};

const getPendingTransactions = async (): Promise<TransactionLog[]> => {
  try {
    return await transactionLogRepository.find({
      where: {
        status: "pending",
      },
      order: {
        created_at: "ASC",
      },
    });
  } catch (err) {
    console.log("getPendingTransactions::err ", err);
  }
};

const getLatestTransaction = async (): Promise<TransactionLog> => {
  try {
    const transactionLog = await transactionLogRepository.find({
      order: {
        blockNumber: "DESC",
      },
      take: 1,
    });
    return transactionLog[0];
  } catch (err) {
    console.log("getLatestBlockNumber::err ", err);
  }
};

const transactionStarted = async ({
  transactionHash,
  blockNumber,
  type,
}: ITransactionLog): Promise<TransactionLog> => {
  try {
    const transactionLogRepository =
      AppDataSource.getRepository(TransactionLog);
    const transactionLog = new TransactionLog();
    transactionLog.transactionHash = transactionHash;
    transactionLog.blockNumber = blockNumber;
    transactionLog.type = type;
    return await transactionLogRepository.save(transactionLog);
  } catch (err) {
    console.log("transactionStarted::err ", err);
  }
};

const transactionCompleted = async (
  transactionHash: string
): Promise<TransactionLog> => {
  try {
    const transactionLogRepository =
      AppDataSource.getRepository(TransactionLog);
    const transactionLog = await transactionLogRepository.findOne({
      where: { transactionHash },
    });
    if (transactionLog) {
      transactionLog.status = "completed";
    }
    return await transactionLogRepository.save(transactionLog);
  } catch (err) {
    console.log("transactionCompleted::err ", err);
  }
};

function hex2Dec(s: string) {
  function add(x, y) {
    let c = 0;
    const r = [];
    x = x.split("").map(Number);
    y = y.split("").map(Number);
    while (x.length || y.length) {
      const s = (x.pop() || 0) + (y.pop() || 0) + c;
      r.unshift(s < 10 ? s : s - 10);
      c = s < 10 ? 0 : 1;
    }
    if (c) r.unshift(c);
    return r.join("");
  }

  var dec = "0";
  s.split("").forEach(function (chr) {
    var n = parseInt(chr, 16);
    for (var t = 8; t; t >>= 1) {
      dec = add(dec, dec);
      if (n & t) dec = add(dec, "1");
    }
  });
  return dec;
}

export const initEventService = () => {
  contract.on("Sell", async (_, __, ____, event) => {
    console.log("NEW SELL: ");
    try {
      const { transactionHash, blockNumber } = event;
      await transactionStarted({
        transactionHash,
        blockNumber,
        type: "Sell",
      });
      const tx = await event.getTransaction();
      const { from, to, data } = tx;
      const decodedData = ISellFunction.decodeFunctionData("sell", data);
      const [nftAddress, hTokenId = [], hPrice = []] = decodedData;
      const tokenId = hex2Dec(hTokenId[0]._hex);
      const price = hex2Dec(hPrice[0]._hex);

      const result = await nftSold({ nftAddress, tokenId, price, from, to });
      await transactionCompleted(transactionHash);
      // Token sold. call metaverse via socket??
      console.log(result);
    } catch (error) {
      console.log("Sell event error: ", error);
      debugger;
      throw new Error(error);
    }
  });

  contract.on("Buy", async (_, __, event) => {
    const { transactionHash, blockNumber } = event;
    // const blockInfo = await event.getBlock();
    await transactionStarted({
      transactionHash,
      blockNumber,
      type: "Buy",
    });
    const tx = await event.getTransaction();
    const { from, to, data } = tx;

    const decodedData = IBuyFunction.decodeFunctionData("buy", data);
    const [nftAddress, hTokenId] = decodedData;

    const tokenId = hex2Dec(hTokenId[0]._hex);
    const result = await nftBought({ nftAddress, tokenId, from, to });
    await transactionCompleted(transactionHash);
    // Token bought. call metaverse via socket??
    console.log(result);
  });

  contract.on("Cancel", async (_, tokenIdHexa, event) => {
    const { transactionHash, blockNumber } = event;
    await transactionStarted({
      transactionHash,
      blockNumber,
      type: "Cancel",
    });
    const tx = await event.getTransaction();
    const { from, to, data } = tx;
    const decodedData = ICancelFunction.decodeFunctionData("cancel", data);
    const [nftAddress, hTokenId] = decodedData;
    const tokenId = hex2Dec(hTokenId[0]._hex);
    const result = await nftCancel({ nftAddress, tokenId, from, to });
    await transactionCompleted(transactionHash);
    // Token cancel. call metaverse via socket??
    console.log(result);
  });
};
