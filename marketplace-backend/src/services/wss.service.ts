import dotenv from "dotenv";
import Web3 from "web3";
import Contract from "web3-eth-contract";
import abi from "../abi/abi";
import { dgApi } from "../dg-api/dg-api";
import {
  IWSSResponse,
  INftSoldReq,
  INftDataReq,
  INftData,
} from "../interfaces/index";

dotenv.config();

const options = {
  timeout: 30000, // ms

  clientConfig: {
    // Useful if requests are large
    maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
    maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

    // Useful to keep a connection alive
    keepalive: true,
    keepaliveInterval: -1, // ms
  },

  // Enable auto reconnection
  reconnect: {
    auto: false,
    delay: 100, // ms
    maxAttempts: 10,
    onTimeout: false,
  },
};
const { WSS, CONTRACT_ADDRESS, API_PROVIDER } = process.env;

// @ts-ignore
const provider = new Web3.providers.WebsocketProvider(WSS, options);

// @ts-ignore
provider.on("error", (err) => {
  console.log("WS Error: ", err);
});

// @ts-ignore
Contract.setProvider(provider);

// @ts-ignore
const contract = new Contract(abi, CONTRACT_ADDRESS);

export const getTokenFromAddress = async (
  address: string
): Promise<IWSSResponse> => {
  try {
    const url =
      API_PROVIDER === "MORALIS"
        ? `/v2/${address}/nft?chain=polygon&format=decimal`
        : `/getNFTs?owner=${address}`;
    const resp = await dgApi.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};

const validateConnection = async () =>
  new Promise((resolve, reject) => {
    const timeout = 15000;
    if (!contract.currentProvider.connected) {
      provider.reconnect();
      const reconnectTimeout = setTimeout(() => {
        reject(new Error("Connection timeout"));
      }, timeout);
      provider.on("connect", () => {
        console.log("connected");
        clearTimeout(reconnectTimeout);
        resolve(true);
      });
    } else {
      resolve(true);
    }
  });

export const getNftPrice = async (
  nftAddress: string,
  tokenId: string
): Promise<string> => {
  try {
    await validateConnection();
    if (contract.currentProvider.connected) {
      const price = await contract.methods.getPrice(nftAddress, tokenId).call();
      return price;
    }
  } catch (error) {
    console.log("not connected to moralis provider: ", error);
    throw new Error("not connected to moralis provider");
  }
};

export const getTokenData = async ({
  nftAddress,
  tokenId,
}: INftDataReq): Promise<INftData> => {
  try {
    const url =
      API_PROVIDER === "MORALIS"
        ? `/v2/nft/${nftAddress}/${tokenId}?chain=polygon&format=decimal`
        : `/getNFTs?owner=${nftAddress}`;
    const resp = await dgApi.get(url);
    return resp.data;
  } catch (error) {
    throw new Error(error);
  }
};
