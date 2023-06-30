import Web3 from 'web3';
import { Contract } from 'web3/node_modules/web3-eth-contract';
import { contracts } from '../db/dbContracts';
import { AbiItem } from 'web3-utils';
import { logger } from './logger';
import { api } from './common';
const dbMongo = require('../db/dbMongo');

// import ABIs
import ABI_NON_ICE_REGISTRANT from '../contracts/ICE/ABINonICERegistrant.json';
import ABI_ICE_REGISTRANT from '../contracts/ICE/ABIICERegistrant.json';
import ABI_XDG_KEEPER from '../contracts/parent/ABIXDGKeeper.json';
import ABI_ICE_KEEPER from '../contracts/ICE/ABIICEKeeper.json';
import ABI_DG_POINTER from '../contracts/dg/ABIDGPointer.json';
import ABI_DG_STAKING from '../contracts/dg/ABIDGStaking.json';
import ABI_WEARABLE from '../contracts/ICE/ABIWEARABLE.json';
import ABIERC20 from '../contracts/parent/ABIERC20.json';

class ContractInstances {
  contractsIceKeeper: {
    [contractAddress: string]: Contract;
  } = {};
  contractIceToken: Contract = null;
  contractIceRegistrant: Contract = null;
  contractWearables: {
    [contractAddress: string]: Contract;
  } = {};
  contractNFTPurchaser: {
    [contractAddress: string]: Contract;
  } = {};
  contractDgPointer: Contract = null;
  contractDgTokenNew: {
    polygon: Contract;
  } = { polygon: null };
  contractEthToken: {
    polygon: Contract;
  } = { polygon: null };
  contractXDGToken: {
    eth: Contract;
    polygon: Contract;
  } = { eth: null, polygon: null };
  contractDGStaking: Contract = null;
  contractXDGKeeper: Contract = null;
}

type Web3Types = {
  matic: Web3;
  eth: Web3;
};

class Web3Handler {
  web3Types: Web3Types;
  contractInstances: ContractInstances = new ContractInstances();
  gasApiIndex: number = 0;
  failedGasApiRequests: number = 0;
  recommendedGasPrice: number = 50; // recommended gas price (in gwei) used for transactions; updated by updateGasPrice once per minute
  currentPolygonProvider: string =
    'https://polygon-rpc.com/3e12298e-e356-400b-ab8d-0b9e33156a6a';
  contractsInitialized: boolean = false;

  constructor() {
    this.web3Types = {
      matic: new Web3(
        new Web3.providers.HttpProvider(this.currentPolygonProvider)
      ),
      eth: new Web3(
        new Web3.providers.HttpProvider(
          'https://mainnet.infura.io/v3/1a359efdd4d04d89b5c1b63de776d444'
        )
      ),
    };
  }

  async init() {
    this.setTokenContractInstances();
    await this.setIceContractInstances();

    await this.setRpcProviders();
    await this.updateGasPrice();
    setInterval(() => this.setRpcProviders(), 1 * 60 * 1000);
    setInterval(() => this.updateGasPrice(), 1 * 60 * 1000);

    logger.log('Web3 contracts initialized');
    this.contractsInitialized = true;
  }

  async setRpcProviders() {
    // Grab RPC Provider URLs from Database
    const activeRPCs = await dbMongo.findActiveRPC();
    const polygonProvider = activeRPCs.matic.apiServer;

    // Set Polygon RPC Provider
    if (
      !this.web3Types.matic ||
      this.currentPolygonProvider !== polygonProvider
    ) {
      this.currentPolygonProvider = polygonProvider;
      this.web3Types.matic = new Web3(
        new Web3.providers.HttpProvider(this.currentPolygonProvider)
      );

      this.setTokenContractInstances();
      await this.setIceContractInstances();
      logger.log('Polygon RPC Provider set to:', this.currentPolygonProvider);
    }
  }

  setTokenContractInstances = () => {
    const polygonWeb3: Web3 = this.web3Types.matic;

    // ICE Contract
    this.contractInstances.contractIceToken = new polygonWeb3.eth.Contract(
      ABIERC20 as AbiItem[],
      contracts.CHILD_TOKEN_ADDRESS_ICE
    );

    // DG (new) Contract
    this.contractInstances.contractDgTokenNew.polygon =
      new polygonWeb3.eth.Contract(
        ABIERC20 as AbiItem[],
        contracts.CHILD_TOKEN_ADDRESS_DG2
      );

    // ETH Contract
    this.contractInstances.contractEthToken.polygon =
      new polygonWeb3.eth.Contract(
        ABIERC20 as AbiItem[],
        contracts.CHILD_TOKEN_ADDRESS_ETH
      );

    this.contractInstances.contractDgPointer = new polygonWeb3.eth.Contract(
      ABI_DG_POINTER as AbiItem[],
      contracts.DG_POINTER_CONTRACT_ADDRESS
    );
  };

  async setIceContractInstances() {
    const polygonWeb3: Web3 = this.web3Types.matic;
    const ethWeb3: Web3 = this.web3Types.eth;

    const oldIceKeeperAddress =
      contracts.ICE_KEEPER_CONTRACT_ADDRESS_1['matic'].toLowerCase();
    const newIceKeeperAddress =
      contracts.ICE_KEEPER_CONTRACT_ADDRESS_2['matic'].toLowerCase();
    this.contractInstances.contractsIceKeeper[oldIceKeeperAddress] =
      new polygonWeb3.eth.Contract(
        ABI_ICE_KEEPER as AbiItem[],
        contracts.ICE_KEEPER_CONTRACT_ADDRESS_2['matic']
      );
    this.contractInstances.contractsIceKeeper[newIceKeeperAddress] =
      new polygonWeb3.eth.Contract(
        ABI_ICE_KEEPER as AbiItem[],
        contracts.ICE_KEEPER_CONTRACT_ADDRESS_2['matic']
      );
    this.contractInstances.contractIceRegistrant = new polygonWeb3.eth.Contract(
      ABI_ICE_REGISTRANT as AbiItem[],
      contracts.ICE_REGISTRANT_CONTRACT_ADDRESS['matic']
    );

    // DG contracts for staking check
    this.contractInstances.contractDGStaking = new ethWeb3.eth.Contract(
      ABI_DG_STAKING as AbiItem[],
      contracts.DG_STAKING_CONTRACT_ADDRESS['ethereum']
    );

    this.contractInstances.contractXDGToken.eth = new ethWeb3.eth.Contract(
      ABIERC20 as AbiItem[],
      contracts.ROOT_TOKEN_ADDRESS_XDG
    );
    this.contractInstances.contractXDGToken.polygon =
      new polygonWeb3.eth.Contract(
        ABIERC20 as AbiItem[],
        contracts.CHILD_TOKEN_ADDRESS_XDG
      );

    // xDG Keeper
    this.contractInstances.contractXDGKeeper = new polygonWeb3.eth.Contract(
      ABI_XDG_KEEPER as AbiItem[],
      contracts.XDG_KEEPER_CONTRACT_ADDRESS
    );

    const iceWearableCollectionsData = await dbMongo.findIceNftInfos({});

    for (let collection of iceWearableCollectionsData) {
      const contractAddress: string = collection.contractAddress;
      this.contractInstances.contractWearables[contractAddress] =
        new polygonWeb3.eth.Contract(
          ABI_WEARABLE as AbiItem[],
          contractAddress
        );
    }
    //Non Ice Wearable code logic
    const nonIceWearableCollectionsData = await dbMongo.findAccessoryNftInfos(
      {}
    );
    for (let collection of nonIceWearableCollectionsData) {
      const contractAddress: string = collection.contractAddress;
      this.contractInstances.contractWearables[contractAddress] =
        new polygonWeb3.eth.Contract(
          ABI_WEARABLE as AbiItem[],
          contractAddress
        );
      //logic for NFT Purchaser
      for (let item of collection.collectionMap) {
        const itemContractAddress = item.nftPurchaserContract;
        const currentNFTPurchaseContracts = Object.keys(
          this.contractInstances.contractNFTPurchaser
        );
        if (!currentNFTPurchaseContracts.includes(itemContractAddress)) {
          this.contractInstances.contractNFTPurchaser[itemContractAddress] =
            new polygonWeb3.eth.Contract(
              ABI_NON_ICE_REGISTRANT as AbiItem[],
              itemContractAddress
            );
        }
      }
    }
  }

  async makeBatchRequest(calls, params = {}) {
    let batch = new this.web3Types.matic.BatchRequest();

    let promises = calls.map((call) => {
      return new Promise((res, rej) => {
        let req = call.request(params, (err, data) => {
          if (err) rej(err);
          else res(data);
        });
        batch.add(req);
      });
    });
    batch.execute();

    return Promise.all(promises);
  }

  //fetch gas prices from the api
  updateGasPrice = async () => {
    const gasApis = [
      'https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=pendingpooltxgweidata',
      'https://gasstation-mainnet.matic.network/',
    ];

    try {
      const data = await api(gasApis[this.gasApiIndex]);
      const appConfig = await dbMongo.getAppConfig();
      const minGasPrice = appConfig.minGasPrice;
      const maxGasPrice = appConfig.maxGasPrice;

      const apiGasPrice =
        this.gasApiIndex === 0 ? data.result.rapidgaspricegwei : data.fastest;
      const gasPrice = Math.floor(
        Math.max(Math.min(apiGasPrice, maxGasPrice), minGasPrice)
      );
      if (typeof gasPrice === 'number') {
        this.recommendedGasPrice = gasPrice;
      }
      this.failedGasApiRequests = 0;
    } catch (error) {
      logger.error(
        `Failed to fetch gas price: ${error} (Failed Requests: ${this.failedGasApiRequests}, API Index: ${this.gasApiIndex})`
      );
      this.failedGasApiRequests++;
      if (this.failedGasApiRequests === 20) {
        this.failedGasApiRequests = 0;
        this.gasApiIndex = ++this.gasApiIndex % 2;
      }
    }
  };
}

export const web3Handler = new Web3Handler();
