"use strict";
// defining necessary constants.
const sanitize = require("mongo-sanitize");
const mongoose_1 = require("mongoose");
const Int32 = require("mongoose-int32").loadType(mongoose_1);
import keys from '../config/keys';
const sleep = require("sleep-promise");
const _ = require('lodash');
import { logger } from "../modules/logger";
import { NFTAccessory } from "types/dbMongo.db";

let connectToMongoDb;
// Catch any errors on connection to mongodb, retry after delay to prevent API server from crashing.
try {
  connectToMongoDb = async (connectionCheck = false) => {
    let conStatus = false;
    const uriString: string = String(keys.DB_CONNECTION_STRING);
    mongoose_1.set("debug", false);
    await mongoose_1.connect(
      uriString,
      { useUnifiedTopology: true, useNewUrlParser: true },
      async (err) => {
        // if we failed to connect, abort and retry
        if (err) {
          conStatus = false;
          logger.log(err);
          if (!connectionCheck) {
            // Wait X seconds and try again if any error occurred
            await sleep(1000 * 10);
            connectToMongoDb();
          }
        } else {
          if (!connectionCheck) {
            logger.log("mongoDB Connected");
          }
          conStatus = true;
        }
      }
    );
    return conStatus;
  };

  connectToMongoDb();
} catch (err) {
  logger.log(err);
}

const connection = mongoose_1.connection;

// Catch errors from mongoose after the connection is established.
connection.on("error", (err) => {
  logger.log("Mongoose error:", err);
});

const Schema = mongoose_1.Schema;
const HIDDEN_FIELDS = { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 };
const HIDDEN_FIELDS_INCLUDE_CREATED_AT = { _id: 0, __v: 0, updatedAt: 0 };

// defining schemas for db collections

// define schema for slackCommandPermissions collection

const slackCommandPermissions = new Schema(
  {
    users: {
      type: Object,
      required: true,
    },
    commands: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true, collection: 'slackCommandPermissions' }
);

// define schema for contracts collection

const contractAddresses = new Schema(
  {
    rootTokenAddress: { type: Object, default: {} },
    childTokenAddress: { type: Object, default: {} },
    treasuryAddress: { type: Object, default: {} },
    multiCallAddress: { type: Object, default: {} },
    tokenAddress: { type: Object, default: {} },
    dgContractAddress: { type: Object, default: {} },
    iceContractAddress: { type: Object, default: {} },
    xdgContractAddress: { type: Object, default: {} },
    bpAddress: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: "contractAddresses",
  }
);

const generateUrlsOptions = function (environment) {
  let socketServerUrlMappingByRealm;
  switch (environment) {
    case "production":
      socketServerUrlMappingByRealm = {
        dg: {
          type: String,
          required: true,
          default: "",
        },
        loki: {
          type: String,
          required: true,
          default: "",
        },
        fenrir: {
          type: String,
          required: true,
          default: "",
        },
        hephaestus: {
          type: String,
          required: true,
          default: "",
        },
        heimdallr: {
          type: String,
          required: true,
          default: "",
        },
        baldr: {
          type: String,
          required: true,
          default: "",
        },
        artemis: {
          type: String,
          required: true,
          default: "",
        },
        odin: {
          type: String,
          required: true,
          default: "",
        },
        unicorn: {
          type: String,
          required: true,
          default: "",
        },
        marvel: {
          type: String,
          required: true,
          default: "",
        },
        thor: {
          type: String,
          required: true,
          default: "",
        },
        localhost: {
          type: String,
          required: true,
          default: "",
        },
        testing: {
          type: String,
          required: true,
          default: "",
        },
      };
      break;

    case "staging":
      socketServerUrlMappingByRealm = {
        testing: {
          type: String,
          required: true,
          default: "",
        },
      };
      break;

    case "development":
      socketServerUrlMappingByRealm = {
        localhost: {
          type: String,
          required: true,
          default: "",
        },
      };
      break;

    case "testing":
      socketServerUrlMappingByRealm = {
        localhost: {
          type: String,
          required: true,
          default: "",
        },
      };
      break;

    case "localhost":
      socketServerUrlMappingByRealm = {
        localhost: {
          type: String,
          required: true,
          default: "",
        },
      };
      break;
  }

  const realmScheme = {
    apis: {
      main: {
        type: String,
        required: true,
        default: "",
      },
      scheduler: {
        type: String,
        required: true,
        default: "",
      },
    },
    webSocket: {
      general: {
        type: String,
        required: true,
        default: "",
      },
      blackjack: {
        type: String,
        required: true,
        default: "",
      },
      roulette: {
        type: String,
        required: true,
        default: "",
      },
      slots: {
        type: String,
        required: true,
        default: "",
      },
      backgammon: {
        type: String,
        required: true,
        default: "",
      },
      // This is a mapping of different URLS per Realm for simplicity. Only production has the full list. Dev and Staging only use the `testing` realm and local development only uses the `localhost` realm
      poker: socketServerUrlMappingByRealm,
    },
  };

  return realmScheme;
};

const generateAssignedSeatingOptions = async (scene) => {
  const tableIdDataSchema = {
    tableId: {
      type: String,
      required: true,
      default: "",
    },
    activePlayers: {
      type: Number,
      required: true,
      default: "",
    },
  };

  const tableIdDataInterface = (realm) => {
    // 15 digits i.e. "410200001009002"
    const generatedTableId =
      "00" + // padding
      realm + // Realm name The next 2 character refer to the index of the user's serverName in this.serverNameList
      "00" + // hard coded since layers are removed
      "000" + // The next 3 characters refer to the landID
      "000" + // The next 3 characters refer to gameType.
      "000"; // The last 3 characters are machineID;

    return {
      tableId: generatedTableId,
      activePlayers: 0,
    };
  };

  const sceneConfigArray = {};
  const icePokerConfig = (await getGameConstants()).icePokerConfig;

  const generateSceneConfig = (sceneName) => {
    global.dclServersList?.forEach((serverUrl, i) => {
      console.log("outer", i, serverUrl, sceneName);
      // Grab from the latest in the global cache

      for (let i = 0; i < icePokerConfig.maxTablesPerScene[sceneName]; i++) {
        console.log("inner", i);

        // On the first time, put each sceneName into the object
        // For each server url, add data to the array based on number of tables in the scene
        if (!sceneConfigArray[sceneName]) {
          // Create new object the first time
          sceneConfigArray[sceneName] = {};
        }

        if (!sceneConfigArray[sceneName][serverUrl]) {
          // Create new array the first time
          sceneConfigArray[sceneName][serverUrl] = [];
        }

        // Add the tableId data to the scene/realm array
        sceneConfigArray[sceneName][serverUrl].push(
          tableIdDataInterface(sceneName)
        );
      }
    });
  };

  for (const sceneNameKey in icePokerConfig.maxTablesPerScene) {
    generateSceneConfig(sceneNameKey);
  }

  const realmSchema = {
    ...sceneConfigArray,
  };

  console.log("realmSchema", realmSchema);

  return realmSchema;
};

const generatedGameConstantsModel = {
  contracts: {
    parent: {
      type: String,
    },
    roulette: {
      type: String,
    },
    slots: {
      type: String,
    },
    dgPointer: {
      type: String,
    },
  },
  casinoNames: {
    type: [String],
  },
  urls: {
    production: generateUrlsOptions("production"),
    staging: generateUrlsOptions("staging"),
    development: generateUrlsOptions("development"),
    testing: generateUrlsOptions("testing"),
    localhost: generateUrlsOptions("localhost"),
  },
  icePokerConfig: {
    maxPlayersPerTable: {
      type: Number,
      default: 6,
    },
    spectatorBuffer: {
      type: Number,
      default: 10,
    },
    maxTablesPerScene: {
      "The Stronghold": {
        type: Number,
        default: 10,
      },
      "Poker DEXT": {
        type: Number,
        default: 8,
      },
      "Chateau Satoshi": {
        type: Number,
        default: 21,
      },
      Osiris: {
        type: Number,
        default: 10,
      },
    },
  },
};

// Generate the Schema object.
const gameConstantsSchema = new Schema(generatedGameConstantsModel, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
  collection: "gameConstants",
});

// define schema for preApprovedUsers collection
const assignedSeatingSchema = new Schema(
  {
    assignedSeatingBySceneRealm: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "assignedSeating",
  }
);
// define schema for userAddresses collection

const userAddresses = new Schema(
  {
    address: { type: String, default: "", unique: true, index: true },
    MANALocked: { type: Schema.Types.Decimal128, default: 0 },
    ETHLocked: { type: Schema.Types.Decimal128, default: 0 },
    verifyStep: { type: Int32, default: 4 },
    authorized: { type: Int32, default: 0 },
    email: { type: String, default: "" },
    id: { type: String, default: "", unique: true, index: true },
    playBalance: { type: Int32, default: 1000 },
    competitionBalance: { type: Int32, default: 0 },
    iceChipsBalance: { type: Int32, default: 0 },
    iceAgreedTermsofService: { type: Boolean, default: false },
    iceXpCurrent: { type: Int32, default: 0 },
    iceXpAllTime: { type: Int32, default: 0 },
    mobileIceXpCurrent: { type: Int32, default: 0 },
    mobileIceXpAllTime: { type: Int32, default: 0 },
    callCount: { type: Int32, default: 0 },
    avatarName: { type: String, default: "" },
    avatarImageID: { type: String, default: "" },
    gasFill: { type: Int32, default: 0 },
    playersList: { type: [String], default: [] },
    ipAddress: { type: String, default: "" },
    tokenArray: {
      type: [Boolean],
      default: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    },
    muted: { type: Boolean, default: false },
    currency: { type: String, default: "" },
    guildName: { type: String, default: "" },
    delegateNicknames: { type: Object, default: {} },
    managerOf: { type: String, default: "" },
    guildManager: { type: String, default: "" },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "userAddresses",
  }
);
userAddresses.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.MANALocked) ret.MANALocked = Number(ret.MANALocked.toString());
    if (ret.ETHLocked) ret.ETHLocked = Number(ret.ETHLocked.toString());
    return ret;
  },
});

// define schema for preApprovedUsers collection
const preApprovedUsers = new Schema(
  {
    preApprovedUsers: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "preApprovedUsers",
  }
);
userAddresses.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.MANALocked) ret.MANALocked = Number(ret.MANALocked.toString());
    if (ret.ETHLocked) ret.ETHLocked = Number(ret.ETHLocked.toString());
    return ret;
  },
});

// define schema for dclServer collection

const dclServers = new Schema(
  {
    domains: {
      type: [String],
      default: [],
    },
    islands: {
      type: [String],
      default: [],
    },
    servers: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "dclServers",
  }
);
dclServers.set("toJSON", {
  transform: (doc, ret) => {
    return ret;
  },
});

// define schema for bannedUsers collection

const bannedUsers = new Schema(
  {
    address: {
      type: String,
      unique: true,
    },
    reason: { type: String, default: "" },
    reporterName: { type: String, default: "" },
    type: { type: String, default: "" },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "bannedUsers",
  }
);
bannedUsers.set("toJSON", {
  transform: (doc, ret) => {
    return ret;
  },
});

// define schema for parcelInfo collection

const parcelTotalInfos = new Schema(
  {
    landId: { type: Schema.Types.Decimal128, default: 0 },
    tokenId: { type: String, default: "" },
    machineIDs: [{ type: String, default: "" }],
    parcelLocation: [{ type: Int32, default: 1 }],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "parcelTotalInfos",
  }
);
parcelTotalInfos.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.landId) ret.landId = Number(ret.landId.toString());
    return ret;
  },
});

// define schema for nftInfo collection

const nftInfos = new Schema(
  {
    name: { type: String, default: "" },
    items: [{ type: String, default: "" }],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "nftInfos",
  }
);

// define schema for gameVolumeInfos collection

const gameVolumeInfos = new Schema(
  {
    coinName: { type: String, default: "" },
    balance: { type: Int32, default: 0 },
    volumeCurrent: { type: Int32, default: 0 },
    volumeLast: { type: Int32, default: 0 },
    volumeAll: { type: Int32, default: 0 },
    revenueCurrent: { type: Int32, default: 0 },
    revenueLast: { type: Int32, default: 0 },
    revenueAll: { type: Int32, default: 0 },
    latestSessionDate: { type: Date, default: null },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "gameVolumeInfos",
  }
);
gameVolumeInfos.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.balance) ret.balance = Number(ret.balance.toString());
    if (ret.volumeCurrent)
      ret.volumeCurrent = Number(ret.volumeCurrent.toString());
    if (ret.volumeLast) ret.volumeLast = Number(ret.volumeLast.toString());
    if (ret.volumeAll) ret.volumeAll = Number(ret.volumeAll.toString());
    if (ret.revenueCurrent)
      ret.revenueCurrent = Number(ret.revenueCurrent.toString());
    if (ret.revenueLast) ret.revenueLast = Number(ret.revenueLast.toString());
    if (ret.revenueAll) ret.revenueAll = Number(ret.revenueAll.toString());
    return ret;
  },
});

// define schema for userIndexings collection

const userIndexings = new Schema(
  {
    address: { type: String, default: "", index: true },
    page: { type: Int32, default: 0, index: true },
    historyID: { type: Schema.Types.ObjectId, default: null },
    playID: { type: Schema.Types.ObjectId, default: null },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "userIndexings",
  }
);

// define schema for userTransactions collection

const userTransactions = new Schema(
  {
    address: { type: String, default: "" },
    txid: { type: String, default: "", unique: true, index: true },
    amount: { type: Schema.Types.Decimal128, default: 0 },
    type: { type: String, default: "" },
    status: { type: String, default: "" },
    step: { type: Int32, default: 0 },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "userTransactions",
  }
);
userTransactions.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.amount) ret.amount = Number(ret.amount.toString());
    return ret;
  },
});

// define schema for userTradings collection

const userTradings = new Schema(
  {
    address: { type: String, default: "" },
    MANAamount: { type: Schema.Types.Decimal128, default: 0 },
    ETHamount: { type: Schema.Types.Decimal128, default: 0 },
    paymentType: { type: String, default: "" },
    txHash: { type: String, default: "", unique: true, index: true },
    confirmed: { type: Int32, default: 0 },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "userTradings",
  }
);
userTradings.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.MANAamount) ret.MANAamount = Number(ret.MANAamount.toString());
    if (ret.ETHamount) ret.ETHamount = Number(ret.ETHamount.toString());
    return ret;
  },
});

// define schema for userPlayInfos collection

const userPlayInfos = new Schema(
  {
    address: { type: String, default: "" },
    coinName: { type: String, default: "" },
    betAmount: { type: Schema.Types.Decimal128, default: 0 },
    globalID: { type: String, default: "" },
    number: { type: Int32, default: 0 },
    amountWin: { type: Schema.Types.Decimal128, default: 0 },
    earning: { type: Schema.Types.Decimal128, default: 0 },
    usd: { type: Schema.Types.Decimal128, default: 0 },
    txid: { type: String, default: "" },
    ptxid: { type: String, default: "" },
    type: { type: String, default: "" },
    gameType: { type: Int32, default: 0 },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "userPlayInfos",
  }
);
userPlayInfos.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.betAmount) ret.betAmount = Number(ret.betAmount.toString());
    if (ret.amountWin) ret.amountWin = Number(ret.amountWin.toString());
    if (ret.earning) ret.earning = Number(ret.earning.toString());
    if (ret.usd) ret.usd = Number(ret.usd.toString());
    return ret;
  },
});

// define schema for userPlayerInfos collection

const userPlayerInfos = new Schema(
  {
    address: { type: String, default: "" },
    type: { type: String, default: "" },
    gameType: { type: Int32, default: 0 },
    playTotalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    playTotalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    playTotalEarning: { type: Schema.Types.Decimal128, default: 0 },
    chipsTotalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    chipsTotalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    chipsTotalEarning: { type: Schema.Types.Decimal128, default: 0 },
    manaTotalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    manaTotalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    manaTotalEarning: { type: Schema.Types.Decimal128, default: 0 },
    daiTotalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    daiTotalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    daiTotalEarning: { type: Schema.Types.Decimal128, default: 0 },
    iceTotalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    iceTotalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    iceTotalEarning: { type: Schema.Types.Decimal128, default: 0 },
    dg2TotalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    dg2TotalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    dg2TotalEarning: { type: Schema.Types.Decimal128, default: 0 },
    ethTotalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    ethTotalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    ethTotalEarning: { type: Schema.Types.Decimal128, default: 0 },
    busdTotalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    busdTotalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    busdTotalEarning: { type: Schema.Types.Decimal128, default: 0 },
    latestSessionDate: { type: Date, default: null },
    numberOfFreePlays: { type: Int32, default: 0 },
    numberOfChipsPlays: { type: Int32, default: 0 },
    numberOfManaPlays: { type: Int32, default: 0 },
    numberOfDaiPlays: { type: Int32, default: 0 },
    numberOfIcePlays: { type: Int32, default: 0 },
    numberOfDg2Plays: { type: Int32, default: 0 },
    numberOfEthPlays: { type: Int32, default: 0 },
    numberOfBusdPlays: { type: Int32, default: 0 },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "userPlayerInfos",
  }
);
userPlayerInfos.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.playTotalBetAmount)
      ret.playTotalBetAmount = Number(ret.playTotalBetAmount.toString());
    if (ret.playTotalAmountWin)
      ret.playTotalAmountWin = Number(ret.playTotalAmountWin.toString());
    if (ret.playTotalEarning)
      ret.playTotalEarning = Number(ret.playTotalEarning.toString());
    if (ret.chipsTotalBetAmount)
      ret.chipsTotalBetAmount = Number(ret.chipsTotalBetAmount.toString());
    if (ret.chipsTotalAmountWin)
      ret.chipsTotalAmountWin = Number(ret.chipsTotalAmountWin.toString());
    if (ret.chipsTotalEarning)
      ret.chipsTotalEarning = Number(ret.chipsTotalEarning.toString());
    if (ret.manaTotalBetAmount)
      ret.manaTotalBetAmount = Number(ret.manaTotalBetAmount.toString());
    if (ret.manaTotalAmountWin)
      ret.manaTotalAmountWin = Number(ret.manaTotalAmountWin.toString());
    if (ret.manaTotalEarning)
      ret.manaTotalEarning = Number(ret.manaTotalEarning.toString());
    if (ret.daiTotalBetAmount)
      ret.daiTotalBetAmount = Number(ret.daiTotalBetAmount.toString());
    if (ret.daiTotalAmountWin)
      ret.daiTotalAmountWin = Number(ret.daiTotalAmountWin.toString());
    if (ret.daiTotalEarning)
      ret.daiTotalEarning = Number(ret.daiTotalEarning.toString());
    if (ret.iceTotalBetAmount)
      ret.iceTotalBetAmount = Number(ret.iceTotalBetAmount.toString());
    if (ret.iceTotalAmountWin)
      ret.iceTotalAmountWin = Number(ret.iceTotalAmountWin.toString());
    if (ret.iceTotalEarning)
      ret.iceTotalEarning = Number(ret.iceTotalEarning.toString());
    if (ret.dg2TotalBetAmount)
      ret.dg2TotalBetAmount = Number(ret.dg2TotalBetAmount.toString());
    if (ret.dg2TotalAmountWin)
      ret.dg2TotalAmountWin = Number(ret.dg2TotalAmountWin.toString());
    if (ret.dg2TotalEarning)
      ret.dg2TotalEarning = Number(ret.dg2TotalEarning.toString());
    if (ret.ethTotalBetAmount)
      ret.ethTotalBetAmount = Number(ret.ethTotalBetAmount.toString());
    if (ret.ethTotalAmountWin)
      ret.ethTotalAmountWin = Number(ret.ethTotalAmountWin.toString());
    if (ret.ethTotalEarning)
      ret.ethTotalEarning = Number(ret.ethTotalEarning.toString());
    if (ret.busdTotalBetAmount)
      ret.busdTotalBetAmount = Number(ret.busdTotalBetAmount.toString());
    if (ret.busdTotalAmountWin)
      ret.busdTotalAmountWin = Number(ret.busdTotalAmountWin.toString());
    if (ret.busdTotalEarning)
      ret.busdTotalEarning = Number(ret.busdTotalEarning.toString());
    return ret;
  },
});

// define schema for audioStreamData collection

const audioStreamData = new Schema(
  {
    link: {
      type: String,
      required: true,
      default: "",
    },
    volume: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    collection: "audioStreamData",
  }
);

// define schema for videoStreamData collection

const videoStreamData = new Schema(
  {
    link: {
      type: String,
      required: true,
      default: "",
    },
    volume: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      updatedAt: "updatedAt",
    },
    collection: "videoStreamData",
  }
);

// define schema for activeNotice collection

const activeNotice = new Schema(
  {
    text: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "off",
    },
  },
  {
    collection: "activeNotice",
  }
);

// define schema for mobileWhitelist collection

const mobileWhitelist = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: "mobileWhitelist",
  }
);

// define schema for treasuryBalanceHistory collection

const treasuryBalanceHistory = new Schema(
  {
    daiBalance: {
      type: Number,
      required: true,
    },
    iceBalance: {
      type: Number,
      required: true,
    },
    manaBalance: {
      type: Number,
      required: true,
    },
    usdtBalance: {
      type: Number,
      required: true,
    },
    atriBalance: {
      type: Number,
      required: true,
    },
    ethBalance: {
      type: Number,
      required: true,
    },
    busdBalance: {
      type: Number,
      required: true,
    },
    dgBalance: {
      type: Number,
      required: true,
    },
    vestedDgBalance: {
      type: Number,
      required: true,
    },
    totalDgWalletUSD: {
      type: Number,
      required: true,
    },
    maticBalance: {
      type: Number,
      required: true,
    },
    totalBalanceUSD: {
      type: Number,
      required: true,
    },
    totalGameplayUSD: {
      type: Number,
      required: true,
    },
    allTimeGameplayUSD: {
      type: Number,
      required: true,
    },
    totalDgEthUniswapBalance: {
      type: Number,
      required: true,
    },
    totalDGEthLPBalance: {
      type: Number,
      required: true,
    },
    totalCurveAaveBalance: {
      type: Number,
      required: true,
    },
    totalDgUSD: {
      type: Number,
      required: true,
    },
    totalVestedDgUSD: {
      type: Number,
      required: true,
    },
    totalLandUSD: {
      type: Number,
      required: true,
    },
    totalWearablesUSD: {
      type: Number,
      required: true,
    },
    totalMaticUSD: {
      type: Number,
      required: true,
    },
    totalIceUsdcLPBalance: {
      type: Number,
      required: true,
    },
    totalMviEthLPBalance: {
      type: Number,
      required: true,
    },
    totalLiquidityProvided: {
      type: Number,
      required: true,
    },
    indexRewards: {
      type: Number,
      required: true,
    },
    iceCeoEthBalance: {
      type: Number,
      required: true,
    },
    totalIceWearablesUSD: {
      type: Number,
      required: true,
    },
    totalDGXDgLPBalance: {
      type: Number,
      required: true,
    },
    totalDGMaticLPBalance: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    collection: "treasuryBalanceHistory",
  }
);

// define schema for competition collection

const competition = new Schema(
  {
    eventID: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "PLAY",
    },
    users: [
      {
        type: String,
        default: "",
      },
    ],
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "competition",
  }
);

// define schema for pokerHandHistory

const playerHandData = new Schema({
  playerAddress: {
    type: String,
    default: "",
  },
  hand: [
    [
      {
        type: Int32,
        default: 0,
      },
    ],
  ],
  userPlayInfoID: { type: Schema.Types.ObjectId, default: null },
  _id: false,
});

const tableData = new Schema({
  communityCards: [
    [
      {
        type: Int32,
        default: 0,
      },
    ],
  ],
  playerHandData: [playerHandData],
  _id: false,
});

const pokerHandHistory = new Schema(
  {
    sessionID: {
      type: String,
      default: "",
    },
    tableData: {
      type: [tableData],
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    collection: "pokerHandHistory",
  }
);

// define schema for activePoap

const activePoap = new Schema({
  isEnabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  id: {
    type: String,
    required: true,
    default: "",
  },
});

// define schema for activeBanners

const activeBanners = new Schema({
  isEnabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  urls: {
    type: [String],
    required: true,
    default: [],
  },
});

// define schema for nftScreen

const nftScreen = new Schema({
  isEnabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  mainImgUrl: {
    type: String,
    required: true,
    default: "",
  },
  sideImgUrl: {
    type: String,
    required: true,
    default: "",
  },
  clickUrl: {
    type: String,
    required: true,
    default: "",
  },
});

// define schema for djNPC

const djNPC = new Schema({
  isEnabled: {
    type: Boolean,
    required: true,
    default: false,
  },
});
// define schema for clientConfig collection

const clientConfigs = new Schema(
  {
    sceneName: {
      type: String,
      required: true,
    },
    videoStreamData: {
      type: videoStreamData,
      required: true,
    },
    audioStreamData: {
      type: audioStreamData,
      required: true,
    },
    activeNotice: {
      type: activeNotice,
      required: true,
    },
    activeBanners: {
      type: activeBanners,
      required: true,
    },
    nftScreen: {
      type: nftScreen,
      required: true,
    },
    activePoap: {
      type: activePoap,
      required: true,
    },
    djNPC: {
      type: djNPC,
      required: true,
    },
  },
  { timestamps: true, collection: "clientConfigs" }
);

const appConfigScheme = new Schema(
  {
    isTokenMigrationEnabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    minMintVerifyStep: {
      type: Int32,
      required: true,
      default: 0,
    },
    maxMintCounts: {
      type: Object,
      required: true,
      default: {},
    },
    maxGasPrice: {
      type: Int32,
      required: true,
      default: 0,
    },
    minGasPrice: {
      type: Int32,
      required: true,
      default: 0,
    },
    requireStakedDG: {
      type: Boolean,
      required: true,
      default: false,
    },
    allowXDGClaims: {
      type: Boolean,
      required: true,
      default: false,
    },
    minIceClaimAmount: {
      type: Int32,
      required: true,
      default: 0,
    },
    isMobileWhitelistEnabled: {
      type: Boolean,
      required: true,
      default: true,
    },
    currentGuildLeaderboardSeason: {
      type: String,
      required: true,
      default: 'April_2022',
    },
  },
  { timestamps: true, collection: "appConfig" }
);

// define schema for iceRewardTrees

const iceRewardTrees = new Schema(
  {
    merkleRoot: {
      type: String,
      required: true,
      default: "",
    },
    tokenTotal: {
      type: String,
      required: true,
      default: "",
    },
    claims: {
      type: [Object],
      required: true,
      default: {},
    },
    contractId: {
      type: String,
      required: true,
      default: "",
    },
    iceKeeperAddress: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true, collection: "iceRewardTrees" }
);

// define schema for xdgRewardTrees

const xdgRewardTrees = new Schema(
  {
    merkleRoot: {
      type: String,
      required: true,
      default: "",
    },
    tokenTotal: {
      type: String,
      required: true,
      default: "",
    },
    claims: {
      type: [Object],
      required: true,
      default: {},
    },
    contractId: {
      type: String,
      required: true,
      default: "",
    },
    xdgKeeperAddress: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true, collection: "xdgRewardTrees" }
);

// define schema for iceDelegations

const iceDelegations = new Schema(
  {
    tokenOwner: {
      type: String,
      required: true,
      default: "",
    },
    delegateAddress: {
      type: String,
      required: true,
      default: "",
    },
    tokenId: {
      type: String,
      required: true,
      default: "",
    },
    contractAddress: {
      type: String,
      required: true,
      default: "",
    },
    isQueuedForUndelegationByOwner: {
      type: Boolean,
      required: true,
      default: false,
    },
    isQueuedForUndelegationByDelegatee: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, collection: "iceDelegations" }
);

// define schema for iceNftInfos

const iceNftInfos = new Schema(
  {
    collectionName: {
      type: String,
      required: true,
      default: "",
    },
    contractAddress: {
      type: String,
      required: true,
      default: "",
    },
    upgradeMapping: {
      type: Object,
      required: true,
      default: {},
    },
    itemIdUpgradeMap: {
      type: [Number],
      required: true,
      default: [],
    },
    maxMintCount: {
      type: Number,
      required: true,
      default: 0,
    },
    preview: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true, collection: "iceNftInfos" }
);

const iceGuildLeaderboard = new Schema(
  {
    GuildOwner: { type: String, default: '' },
    League: { type: String, default: '' },
    Season: { type: String, default: '' },
    Chips: { type: Int32, default: 0 },
    TotalActivatedWearables: { type: Int32, default: 0 },
    GuildScore: { type: Int32, default: 0 },
    GuildName: { type: String, default: '' },
    GuildLeague: {
        type: String,
        required: true,
        default: 'Disqualified',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'iceGuildLeaderboard',
  }
);

//schema for non-ice wearables accessory NFTs
const accessoryNFTInfos = new Schema(
  {
    collectionName: {
      type: String,
      required: true,
      default: "",
    },
    contractAddress: {
      type: String,
      required: true,
      default: "",
    },
    collectionMap: {
      type: [Object],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "accessoryNftInfos",
  }
);

// define schema for iceChallengeConstants

const iceChallengeConstants = new Schema(
  {
    challengeCategories: {
      type: Object,
      required: true,
      default: {},
    },
    leaderboardMultiplierMap: {
      type: [Number],
      required: true,
      default: [],
    },
    xpUpgradeCosts: {
      type: [Number],
      required: true,
      default: [],
    },
  },
  { timestamps: true, collection: "iceChallengeConstants" }
);

// define schema for iceGameplayReports collection

const iceGameplayReports = new Schema(
  {
    address: {
      type: String,
      required: true,
      default: "",
      index: true,
    },
    xpEarned: {
      type: Int32,
      required: true,
      default: 0,
    },
    iceEarnedPlayer: {
      type: Int32,
      required: true,
      default: 0,
    },
    chipsWon: {
      type: Int32,
      required: true,
      default: 0,
    },
    iceEarnedDelegator: {
      type: Int32,
      required: true,
      default: 0,
    },
    leaderboardPercentile: {
      type: Int32,
      required: true,
      default: 0,
    },
    wearableSnapshot: {
      type: Object,
      required: true,
      default: {},
    },
    delegatorAddress: {
      type: String,
      default: "",
    },
    numChallengesCompleted: {
      type: Int32,
      required: true,
      default: 0,
    },
    gameplayDay: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: "iceGameplayReports" }
);

// define schema for activeRPC collection

const activeRPC = new Schema(
  {
    matic: {
      type: Object,
      required: true,
    },
    bsc: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true, collection: "activeRPC" }
);

// define schema for frontPageStats collection

const frontPageStats = new Schema(
  {
    monthlyRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    monthlyVisitors: {
      type: Number,
      required: true,
      default: 0,
    },
    dgHolders: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, collection: "frontPageStats" }
);

const jobListings = new Schema(
  {
    position: {
      type: String,
      required: true,
      default: "",
    },
    location: {
      type: String,
      required: true,
      default: "",
    },
    team: {
      type: String,
      required: true,
      default: "",
    },
    listingLink: {
      type: String,
      required: true,
      default: "",
    }
  },
  { timestamps: true, collection: "jobListings" }
);

const slackCommandPermissionsModel = connection.model('slackCommandPermissions', slackCommandPermissions);

// creating collection models using schemas, defining insert/find/update functions for each collection
const iceGuildLeaderboardModel = connection.model("iceGuildLeaderboard", iceGuildLeaderboard);

const contractAddressesModel = connection.model(
  "contractAddresses",
  contractAddresses
);
const gameConstantsModel = connection.model(
  "gameConstants",
  gameConstantsSchema
);

const assignedSeatingModel = connection.model(
  "assignedSeating",
  assignedSeatingSchema
);
const userAddressesModel = connection.model("userAddresses", userAddresses);
const dclServersModel = connection.model("dclServers", dclServers);
const bannedUsersModel = connection.model("bannedUsers", bannedUsers);
const mobileWhitelistModel = connection.model("mobileWhitelist", mobileWhitelist);
const userTransactionsModel = connection.model(
  "userTransactions",
  userTransactions
);
const userTradingsModel = connection.model("userTradings", userTradings);
const userPlayInfosModel = connection.model("userPlayInfos", userPlayInfos);
const userPlayerInfosModel = connection.model(
  "userPlayerInfos",
  userPlayerInfos
);
const gameVolumeInfosModel = connection.model(
  "gameVolumeInfos",
  gameVolumeInfos
);
const parcelTotalInfosModel = connection.model(
  "parcelTotalInfos",
  parcelTotalInfos
);

const nftInfosModel = connection.model("nftInfos", nftInfos);

const userIndexingsModel = connection.model("userIndexings", userIndexings);
const audioStreamDataModel = connection.model(
  "audioStreamData",
  audioStreamData
);
const videoStreamDataModel = connection.model(
  "videoStreamData",
  videoStreamData
);
const activeNoticeModel = connection.model("activeNotice", activeNotice);
const treasuryBalanceHistoryModel = connection.model(
  "treasuryBalanceHistory",
  treasuryBalanceHistory
);
const competitionModel = connection.model("competition", competition);
const pokerHandHistoryModel = connection.model(
  "pokerHandHistoryModel",
  pokerHandHistory
);
const activePoapModel = connection.model("activePoap", activePoap);
const nftScreenModel = connection.model("nftScreen", nftScreen);
const activeRPCModel = connection.model("activeRPC", activeRPC);
const iceDelegationsModel = connection.model("iceDelegations", iceDelegations);
const iceRewardTreesModel = connection.model("iceRewardTrees", iceRewardTrees);
const xdgRewardTreesModel = connection.model("xdgRewardTrees", xdgRewardTrees);
const iceNftInfosModel = connection.model("iceNftInfos", iceNftInfos);
const accessoryNFTInfosModel = connection.model(
  "accessoryNFTInfos",
  accessoryNFTInfos
);
const iceChallengeConstantsModel = connection.model(
  "iceChallengeConstants",
  iceChallengeConstants
);
const clientConfigsModel = connection.model("clientConfigs", clientConfigs);
const appConfigModel = connection.model("appConfig", appConfigScheme);
const preApprovedUsersModel = connection.model(
  "preApprovedUsers",
  preApprovedUsers
);
const iceGameplayReportsModel = connection.model(
  "iceGameplayReports",
  iceGameplayReports
);
const frontPageStatsModel = connection.model("frontPageStats", frontPageStats);
const jobListingsModel = connection.model("jobListings", jobListings);
async function initDb() {}
exports.initDb = initDb;

// ------------- preApproved whitelist -------------------

async function getPreApprovedUsersList() {
  // Grab the first document in the collection
  const preApprovedUsersList = await preApprovedUsersModel
    .findOne({}, { _id: 0 }) // suppress `id` field in response
    .exec();
  if (preApprovedUsersList) {
    return preApprovedUsersList.toJSON().preApprovedUsers;
  } else {
    return [];
  }
}
exports.getPreApprovedUsersList = getPreApprovedUsersList;

// ------------- contractAddresses ----------------
async function getContractAddresses() {
  var ret = await contractAddressesModel.find().exec();
  return ret[0];
}
exports.getContractAddresses = getContractAddresses;

// ------------- userIndexings -------------------

async function insertUserIndexing(data) {
  let UserIndexingsModel = new userIndexingsModel();
  UserIndexingsModel.address = data.address || "";
  UserIndexingsModel.page = data.page || 0;
  UserIndexingsModel.historyID = data.historyID || null;
  UserIndexingsModel.playID = data.playID || null;
  UserIndexingsModel = await UserIndexingsModel.save();
  return UserIndexingsModel;
}
exports.insertUserIndexing = insertUserIndexing;
async function findUserIndexing(address, page) {
  var ret = await userIndexingsModel
    .findOne({ address: sanitize(address), page: sanitize(page) })
    .exec();
  if (ret) return ret.toJSON();
  return ret;
}
exports.findUserIndexing = findUserIndexing;
async function updateUserIndexing(address, page, data) {
  let ret = await userIndexingsModel
    .findOneAndUpdate(
      { address: sanitize(address), page: sanitize(page) },
      data,
      { new: true }
    )
    .exec();
  if (ret) return ret.toJSON();
  return ret;
}
exports.updateUserIndexing = updateUserIndexing;

// fetch the user's address based on passed ID hex string
async function findAddress(_id) {
  logger.log("finding user data for affiliate ID: " + _id);

  let address = "";
  const re = /[0-9A-Fa-f]{6}/g;

  if (re.test(_id) && _id.length === 6) {
    const user = await userAddressesModel
      .findOne({ id: sanitize(_id) }, { address: 1 })
      .exec();

    if (user !== null && user.address !== undefined) {
      address = user.address;
      logger.log("Affiliate wallet address: " + address);
    } else {
      logger.log("Affiliate not found");
    }
  } else {
    logger.log("Affiliate ID out of range");
  }

  return address;
}
exports.findAddress = findAddress;

// ------------- userAddresses -------------------

const HIDDEN_FIELDS_FIND_USER = {
  __v: 0,
  createdAt: 0,
  updatedAt: 0,
  ipAddress: 0,
  email: 0,
};
async function findUser(address) {
  var user = await userAddressesModel
    .findOne({ address: sanitize(address) }, HIDDEN_FIELDS_FIND_USER)
    .exec();
  if (user) return user.toJSON();
  return user;
}
exports.findUser = findUser;

// return all Ethereum addresses attached to IP addresses in array
async function findUsersByIPs(ipAddresses) {
  const addresses = (
    await userAddressesModel
      .find({ ipAddress: { $in: ipAddresses } }, { address: 1 })
      .exec()
  ).map((el) => el.address);
  return addresses;
}
exports.findUsersByIPs = findUsersByIPs;

//ice Guild Leaderboard 
async function findIceGuildLeaderboard(address, season) {
  let ret = await iceGuildLeaderboardModel
    .findOne({GuildOwner: address, Season: season } )
    .exec();
  if (ret) return ret.toJSON();
  return ret;
}
exports.findIceGuildLeaderboard = findIceGuildLeaderboard;

//ice Guild Leaderboards scores sorted by score
async function findAllIceGuildLeaderboardScores(season) {
  let iceGuildLeaderBoards = (await iceGuildLeaderboardModel
    .find({ Season: season } )
    .exec())
    .sort((guild1, guild2) => {
      if(guild1.GuildScore > guild2.GuildScore){
        return -1;
      }else if (guild1.GuildScore == guild2.GuildScore && guild1.Chips > guild2.Chips){
        return -1;
      }else{
        return 1
      }
    });
  return iceGuildLeaderBoards;
}
exports.findAllIceGuildLeaderboardScores = findAllIceGuildLeaderboardScores;

// find all users with verifyStatus GT 4
async function findUserStatus() {
  var users = await userAddressesModel
    .find(
      { verifyStep: { $gt: 4 } },
      { address: 1, avatarName: 1, verifyStep: 1 }
    )
    .exec();

  return users;
}
exports.findUserStatus = findUserStatus;

// update user's information in database
async function updateUser(address, data) {
  await userAddressesModel
    .updateOne({ address: sanitize(address) }, data, { new: true })
    .exec();
  return;
}
exports.updateUser = updateUser;

// helper function for whitelisting users for ICE minting
async function bulkUpdateVerifyStep(addresses, newVerifyStep) {
  const operations = addresses.map((address) => {
    return {
      updateOne: {
        filter: {
          address: sanitize(address),
          verifyStep: { $lt: newVerifyStep },
        },
        update: {
          verifyStep: newVerifyStep,
        },
      },
    };
  });
  const ret = await userAddressesModel.bulkWrite(operations);
  return ret;
}
exports.bulkUpdateVerifyStep = bulkUpdateVerifyStep;

// insert user's information to database
async function insertUser(data) {
  let UserAddressesModel = new userAddressesModel();
  UserAddressesModel.address = data.address || "";
  UserAddressesModel.MANALocked = data.MANALocked || 0;
  UserAddressesModel.ETHLocked = data.ETHLocked || 0;
  UserAddressesModel.email = data.email || "";
  UserAddressesModel.id = UserAddressesModel._id.toString().slice(18, 24);
  UserAddressesModel.avatarName = data.avatarName || "";
  UserAddressesModel.callCount = data.callCount || 0;
  UserAddressesModel.verifyStep = data.verifyStep || 4;
  UserAddressesModel.authorized = data.authorized || 0;
  UserAddressesModel.gasFill = data.gasFill || 0;
  UserAddressesModel.playersList = data.playersList || [];
  UserAddressesModel.ipAddress = data.ipAddress || "";
  UserAddressesModel.tokenArray = data.tokenArray || [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  UserAddressesModel.muted = data.muted || false;
  UserAddressesModel.currency = data.currency || "";
  UserAddressesModel.managerOf = data.managerOf || "";
  UserAddressesModel.guildManager = data.guildManager || "";

  UserAddressesModel = await UserAddressesModel.save();
  return UserAddressesModel.toJSON();
}
exports.insertUser = insertUser;

// delete a user from the database
async function deleteUser(address: string) {
  await userAddressesModel.findOneAndDelete({ address }).exec();
  return;
}
exports.deleteUser = deleteUser;

// ------------- bannedUsers -------------------

// insert banned user's information to database
async function insertBannedUser(data) {
  let res = await bannedUsersModel.findOne(data).exec();
  if (!res) {
    let BannedUsersModel = new bannedUsersModel();
    BannedUsersModel.address = data.address || "";

    BannedUsersModel = await BannedUsersModel.save();
    return BannedUsersModel.toJSON();
  }
  return res.toJSON();
}
exports.insertBannedUser = insertBannedUser;

// bulk insert banned users
async function bulkInsertBannedUsers(addresses:string[], reason: string, reporterName: string, type: string) {
  const operations = addresses.map((address) => {
    let updateObject = {
      address: address.toString().toLowerCase().trim(),
      reason,
      reporterName,
      type
    }
    //get rid of any undefined fields so we don't override them
    updateObject =  _.pickBy(updateObject, (value, key) => !(value === undefined));
    return {
      updateOne: {
        filter: {
          address: address.toString().toLowerCase().trim(),
        },
        update: updateObject,
        upsert: true,
      },
    };
  });
  const ret = await bannedUsersModel.bulkWrite(operations);
  return ret;
}
exports.bulkInsertBannedUsers = bulkInsertBannedUsers;

async function removeBannedUser(data) {
  await bannedUsersModel.findOneAndDelete(data).exec();
}
exports.removeBannedUser = removeBannedUser;

async function findBannedUser(address) {
  const ret = await bannedUsersModel
    .findOne({ address: sanitize(address) })
    .exec();
  return ret;
}
exports.findBannedUser = findBannedUser;

// ------------- mobileWhitelist -------------------

async function findMobileWhitelistUser(address) {
  const ret = await mobileWhitelistModel
    .findOne({ address: sanitize(address) })
    .exec();
  return ret;
}
exports.findMobileWhitelistUser = findMobileWhitelistUser;

// bulk insert banned users
async function bulkInsertMobileWhitelistUsers(addresses:string[]) {
  const operations = addresses.map((address) => {
    return {
      updateOne: {
        filter: {
          address,
        },
        update: {
          address,
        },
        upsert: true,
      },
    };
  });
  const ret = await mobileWhitelistModel.bulkWrite(operations);
  return ret;
}
exports.bulkInsertMobileWhitelistUsers = bulkInsertMobileWhitelistUsers;

// ------------- dclServers -------------------

async function findAllServers() {
  var ret = await dclServersModel.find({}).exec();
  if (ret) {
    if (ret && ret.length) {
      let arr = [];
      for (const item of ret) {
        arr[arr.length] = item.toJSON();
      }
      return arr;
    }
  }
  return ret;
}
exports.findAllServers = findAllServers;

async function updateServers(data) {
  try {
    let ret = await dclServersModel
      .findOneAndUpdate({}, data, { new: true })
      .exec();
    if (ret) return ret.toJSON();
    return ret;
  } catch (error) {
    logger.log(error);
  }
}
exports.updateServers = updateServers;

// -------- userTransactions --------

async function insertTransaction(data) {
  let TransactionModel = new userTransactionsModel();
  TransactionModel.address = data.address || "";
  TransactionModel.amount = data.amount || 0;
  TransactionModel.type = data.type || "";
  TransactionModel.status = data.status || "";
  TransactionModel.step = data.step || 0;
  TransactionModel.txid = data.txid || "";
  TransactionModel = await TransactionModel.save();
  return TransactionModel.toJSON();
}
exports.insertTransaction = insertTransaction;
async function findTransaction(txid) {
  var tx = await userTransactionsModel.findOne({ txid: sanitize(txid) }).exec();
  if (tx) return tx.toJSON();
  return tx;
}
exports.findTransaction = findTransaction;
async function findAllTransaction(data, opts = {}) {
  var limit = opts["limit"] || 20;
  let ret = await userTransactionsModel
    .find(data, null, { limit: limit })
    .sort({ createdAt: -1 })
    .exec();
  if (ret && ret.length) {
    let arr = [];
    for (const item of ret) {
      arr[arr.length] = item.toJSON();
    }
    return arr;
  }
  return ret;
}
exports.findAllTransaction = findAllTransaction;
async function updateTransaction(txid, data) {
  let ret = await userTransactionsModel
    .findOneAndUpdate({ txid: sanitize(txid) }, data, { new: true })
    .exec();
  if (ret) return ret.toJSON();
  return ret;
}
exports.updateTransaction = updateTransaction;

// ------- userTradings --------

async function insertUserTrading(data) {
  let UserTradingsModel = new userTradingsModel();
  UserTradingsModel.address = data.address;
  UserTradingsModel.MANAamount = data.MANAamount;
  UserTradingsModel.ETHamount = data.ETHamount;
  UserTradingsModel.paymentType = data.paymentType;
  UserTradingsModel.txHash = data.txHash;
  UserTradingsModel = await UserTradingsModel.save();
  return UserTradingsModel.toJSON();
}
exports.insertUserTrading = insertUserTrading;

// ------- userPlayInfos --------

async function findAllPlayInfos(data, opts = {}) {
  var limit = opts["limit"] || 100;
  let ret = await userPlayInfosModel
    .find(data, null, { limit: limit })
    .sort({ createdAt: -1 })
    .exec();
  if (ret && ret.length) {
    let arr = [];
    for (const item of ret) {
      arr[arr.length] = item.toJSON();
    }
    return arr;
  }
  return ret;
}
exports.findAllPlayInfos = findAllPlayInfos;

async function findAllPlayInfosFormatted(data) {
  let ret = await userPlayInfosModel
    .find(data, {
      address: 1,
      coinName: 1,
      betAmount: 1,
      number: 1,
      amountWin: 1,
      earning: 1,
      txid: 1,
      ptxid: 1,
      gameType: 1,
      createdAt: 1,
      _id: 0,
    })
    .sort({ createdAt: -1 })
    .exec();
  if (ret && ret.length) {
    let arr = [];
    for (const item of ret) {
      arr[arr.length] = item.toJSON();
    }
    return arr;
  }
  return ret;
}
exports.findAllPlayInfosFormatted = findAllPlayInfosFormatted;

async function findWinningInfosByAddress(data, sortBy = { earning: -1 }) {
  let players = await userPlayInfosModel
    .aggregate([
      {
        $match: data,
      },
      {
        $group: {
          _id: "$address",
          earning: { $sum: "$earning" },
          usd: { $sum: "$usd" },
        },
      },
    ])
    .sort(sortBy)
    .exec();
  for (let player of players) {
    for (let field in player) {
      if (field !== "_id" && player[field] !== 0) {
        let amount = player[field].toJSON()["$numberDecimal"];
        player[field] = amount ? amount : 0;
      }
    }
  }
  return players;
}
exports.findWinningInfosByAddress = findWinningInfosByAddress;

async function findInfosByFreePlay(data) {
  let ret = await userPlayInfosModel
    .aggregate([
      {
        $match: data,
      },
      {
        $group: {
          _id: "$address",
        },
      },
    ])
    .exec();
  return ret;
}
exports.findInfosByFreePlay = findInfosByFreePlay;

async function findLatestPlayInfo(filter = {}) {
  let ret = await userPlayInfosModel
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(1)
    .lean()
    .exec();
  if (ret) return ret[0];
  return ret;
}
exports.findLatestPlayInfo = findLatestPlayInfo;

// ------- userPlayerInfos --------

async function findPlayerInfo(data, all = false) {
  var tx;
  if (!all) {
    tx = await userPlayerInfosModel.findOne(data).exec();
    if (tx) return tx.toJSON();
  } else {
    tx = await userPlayerInfosModel.find(data).exec();
  }
  return tx;
}
exports.findPlayerInfo = findPlayerInfo;
async function findAllPlayerInfo(data, opts = {}) {
  const sortBy = opts["sortBy"] || "createdAt";
  let players = await userPlayerInfosModel
    .aggregate([
      {
        $match: data,
      },
      {
        $group: {
          _id: "$address",
          playTotalEarning: { $sum: "$playTotalEarning" },
          manaTotalEarning: { $sum: "$manaTotalEarning" },
          chipsTotalEarning: { $sum: "$chipsTotalEarning" },
          daiTotalEarning: { $sum: "$daiTotalEarning" },
          iceTotalEarning: { $sum: "$iceTotalEarning" },
          dg2TotalEarning: { $sum: "$dg2TotalEarning" },
          ethTotalEarning: { $sum: "$ethTotalEarning" },
          busdTotalEarning: { $sum: "$busdTotalEarning" },
        },
      },
    ])
    .sort({ [sortBy]: -1 })
    .exec();
  for (let player of players) {
    for (let field in player) {
      if (field !== "_id" && player[field] !== 0) {
        let amount = player[field].toJSON()["$numberDecimal"];
        player[field] = amount ? amount : 0;
      }
    }
  }
  return players;
}
exports.findAllPlayerInfo = findAllPlayerInfo;

// ------- gameVolumeInfos --------

async function findVolumeInfo(data) {
  var tx = await gameVolumeInfosModel.findOne(data).exec();
  if (tx) return tx.toJSON();
  return tx;
}
exports.findVolumeInfo = findVolumeInfo;

// ------- parcelTotalInfos --------

async function findParcelTotalInfo(data) {
  var tx = await parcelTotalInfosModel.findOne(data).exec();
  if (tx) return tx.toJSON();
  return tx;
}
exports.findParcelTotalInfo = findParcelTotalInfo;

async function findAllParcelTotalInfo(data) {
  var tx = await parcelTotalInfosModel.find(data).exec();
  return tx;
}
exports.findAllParcelTotalInfo = findAllParcelTotalInfo;

// ------- nftInfos --------

async function findAllNftInfo() {
  var tx = await nftInfosModel.find().exec();
  return tx;
}
exports.findAllNftInfo = findAllNftInfo;

// ------- audioStreamData --------

async function findAudioStreamStatus() {
  let ret = await audioStreamDataModel.findOne({}, HIDDEN_FIELDS).lean().exec();
  return ret;
}
exports.findAudioStreamStatus = findAudioStreamStatus;

// ------- videoStreamData --------

async function findVideoStreamStatus() {
  let ret = await videoStreamDataModel.findOne({}, HIDDEN_FIELDS).lean().exec();
  return ret;
}
exports.findVideoStreamStatus = findVideoStreamStatus;

// ------- activeNotice --------

async function findActiveNotice() {
  let ret = await activeNoticeModel.findOne({}).exec();
  if (ret) return ret.toJSON();
  return ret;
}
exports.findActiveNotice = findActiveNotice;

// ------- competition --------

async function findCompetition() {
  try {
    let ret = await competitionModel.findOne({}).exec();
    if (ret) return ret.toJSON();
    return ret;
  } catch (error) {
    logger.log(error);
  }
}
exports.findCompetition = findCompetition;

async function updateCompetition(data) {
  try {
    let ret = await competitionModel
      .findOneAndUpdate({}, data, { new: true })
      .exec();
    if (ret) return ret.toJSON();
    return ret;
  } catch (error) {
    logger.log(error);
  }
}
exports.updateCompetition = updateCompetition;

// ------- pokerHandHistory --------

async function findPokerHandHistory(address) {
  let ret = await pokerHandHistoryModel
    .find(
      {
        "tableData.playerHandData.playerAddress": sanitize(address),
      },
      { _id: 0, __v: 0 }
    )
    .lean()
    .exec();
  return ret;
}
exports.findPokerHandHistory = findPokerHandHistory;

// ------- treasuryBalanceHistory --------

async function findTreasuryBalanceHistory(data) {
  let ret = await treasuryBalanceHistoryModel.find({
    timestamp: { $in: data },
  });
  return ret;
}

exports.findTreasuryBalanceHistory = findTreasuryBalanceHistory;

async function findEarliestTreasuryBalance(filter = {}) {
  let ret = await treasuryBalanceHistoryModel
    .find(filter)
    .sort({ timestamp: 1 })
    .limit(1);
  if (ret) return ret[0];
  return ret;
}

exports.findEarliestTreasuryBalance = findEarliestTreasuryBalance;

async function findLatestTreasuryBalance(filter = {}) {
  let ret = await treasuryBalanceHistoryModel
    .find(filter)
    .sort({ timestamp: -1 })
    .limit(1);
  if (ret) return ret[0];
  return ret;
}

exports.findLatestTreasuryBalance = findLatestTreasuryBalance;

// ------- activePoap --------

async function findActivePoap() {
  let ret = await activePoapModel.findOne({}, HIDDEN_FIELDS).lean().exec();
  return ret;
}
exports.findActivePoap = findActivePoap;

// ------- nftScreen --------

async function findNftScreen() {
  let ret = await nftScreenModel.findOne({}, HIDDEN_FIELDS).lean().exec();
  return ret;
}
exports.findNftScreen = findNftScreen;

// ------- activeRPC --------

async function findActiveRPC(filter) {
  let ret = await activeRPCModel.findOne(filter, HIDDEN_FIELDS).lean().exec();
  return ret;
}
exports.findActiveRPC = findActiveRPC;

async function updateActiveRPC(data) {
  let ret = await activeRPCModel
    .findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    })
    .exec();
  if (ret) return ret.toJSON();
  return ret;
}
exports.updateActiveRPC = updateActiveRPC;

// ------- slackCommandPermissions --------

export async function findSlackCommandPermissions() {
  let ret = await slackCommandPermissionsModel
    .findOne({}, HIDDEN_FIELDS)
    .lean()
    .exec();
  return ret;
}

// ------- iceRewardTrees --------

async function findIceRewardTrees(filter, address, includeProofs) {
  let ret = await iceRewardTreesModel
    .aggregate([
      { $match: filter },
      {
        $project: {
          claims: {
            $filter: {
              input: "$claims",
              as: "claim",
              cond: {
                $eq: ["$$claim.address", address],
              },
            },
          },
          iceKeeperAddress: 1,
          contractId: 1,
          createdAt: 1,
        },
      },
      {
        $project: {
          _id: 0,
          "claims.amount": 1,
          "claims.claimed": 1,
          ...(includeProofs && { "claims.proof": 1, "claims.index": 1 }),
          iceKeeperAddress: 1,
          contractId: 1,
          createdAt: 1,
        },
      },
    ])
    .exec();
  return ret;
}
exports.findIceRewardTrees = findIceRewardTrees;

async function setRewardsAsClaimed(address, contractId, iceKeeperAddress) {
  const ret = await iceRewardTreesModel
    .updateOne(
      {
        "claims.address": address,
        contractId: contractId,
        iceKeeperAddress: iceKeeperAddress,
      },
      { $set: { [`claims.$.claimed`]: true } },
      {
        new: true,
      }
    )
    .exec();
  return ret;
}
exports.setRewardsAsClaimed = setRewardsAsClaimed;

// ------- xdgRewardTrees --------

async function findXDGRewardTrees(filter, address, includeProofs) {
  let ret = await xdgRewardTreesModel
    .aggregate([
      { $match: filter },
      {
        $project: {
          claims: {
            $filter: {
              input: "$claims",
              as: "claim",
              cond: {
                $eq: ["$$claim.address", address],
              },
            },
          },
          xdgKeeperAddress: 1,
          contractId: 1,
        },
      },
      {
        $project: {
          _id: 0,
          "claims.amount": 1,
          "claims.claimed": 1,
          ...(includeProofs && { "claims.proof": 1, "claims.index": 1 }),
          xdgKeeperAddress: 1,
          contractId: 1,
        },
      },
    ])
    .exec();
  return ret;
}
exports.findXDGRewardTrees = findXDGRewardTrees;

async function setXDGRewardsAsClaimed(address, contractId, xdgKeeperAddress) {
  const ret = await xdgRewardTreesModel
    .updateOne(
      {
        "claims.address": address,
        contractId: contractId,
        xdgKeeperAddress: xdgKeeperAddress,
      },
      { $set: { [`claims.$.claimed`]: true } },
      {
        new: true,
      }
    )
    .exec();
  return ret;
}
exports.setXDGRewardsAsClaimed = setXDGRewardsAsClaimed;

async function insertXDGRewardTree(data) {
  let XDGRewardTreesModel = new xdgRewardTreesModel();
  XDGRewardTreesModel.merkleRoot = data.merkleRoot;
  XDGRewardTreesModel.tokenTotal = data.tokenTotal;
  XDGRewardTreesModel.claims = data.claims;
  XDGRewardTreesModel.contractId = data.contractId;
  XDGRewardTreesModel.xdgKeeperAddress = data.xdgKeeperAddress;
  XDGRewardTreesModel = await XDGRewardTreesModel.save();
  return XDGRewardTreesModel;
}
exports.insertXDGRewardTree = insertXDGRewardTree;

// ------- iceDelegations --------

async function findIceDelegations(filter) {
  let ret = await iceDelegationsModel
    .find(filter, HIDDEN_FIELDS_INCLUDE_CREATED_AT)
    .lean()
    .exec();
  return ret;
}
exports.findIceDelegations = findIceDelegations;

async function findIceDelegation(filter) {
  let ret = await iceDelegationsModel
    .findOne(filter, HIDDEN_FIELDS)
    .lean()
    .exec();
  return ret;
}
exports.findIceDelegation = findIceDelegation;

async function insertIceDelegation(data) {
  let IceDelegationsModel = new iceDelegationsModel();
  IceDelegationsModel.tokenOwner = data.tokenOwner;
  IceDelegationsModel.delegateAddress = data.delegateAddress;
  IceDelegationsModel.tokenId = data.tokenId;
  IceDelegationsModel.contractAddress = data.contractAddress;
  IceDelegationsModel.isQueuedForUndelegationByOwner = false;
  IceDelegationsModel.isQueuedForUndelegationByDelegatee = false;
  IceDelegationsModel = await IceDelegationsModel.save();
  return IceDelegationsModel;
}
exports.insertIceDelegation = insertIceDelegation;

async function removeIceDelegation(data) {
  await iceDelegationsModel.findOneAndDelete(data).exec();
}
exports.removeIceDelegation = removeIceDelegation;

async function queueOwnerIceUndelegation(data, isQueued) {
  await iceDelegationsModel
    .findOneAndUpdate(data, {
      $set: { isQueuedForUndelegationByOwner: isQueued },
    })
    .exec();
}
exports.queueOwnerIceUndelegation = queueOwnerIceUndelegation;

async function queueDelegateeIceUndelegation(data, isQueued) {
  await iceDelegationsModel
    .findOneAndUpdate(data, {
      $set: { isQueuedForUndelegationByDelegatee: isQueued },
    })
    .exec();
}
exports.queueDelegateeIceUndelegation = queueDelegateeIceUndelegation;

export async function bulkUndelegateUsers(userAddresses) {
  await iceDelegationsModel
    .updateMany(
      { delegateAddress: { $in: userAddresses } },
      {
        $set: { isQueuedForUndelegationByOwner: true },
      }
    )
    .exec();
}

// ------- iceNftInfos --------

async function findIceNftInfos(filter) {
  let ret = await iceNftInfosModel.find(filter, HIDDEN_FIELDS).lean().exec();
  return ret;
}
exports.findIceNftInfos = findIceNftInfos;

// ------- accessoryNftInfos --------

const findAccessoryNftInfos = async (): Promise<NFTAccessory> => {
  const accessoryNFTInfosResult = await accessoryNFTInfosModel
    .find({}, HIDDEN_FIELDS)
    .lean()
    .exec();
  return accessoryNFTInfosResult;
};
exports.findAccessoryNftInfos = findAccessoryNftInfos;

// ------- iceChallengeConstants --------

async function findIceChallengeConstants(filter) {
  let ret = await iceChallengeConstantsModel
    .findOne(filter, HIDDEN_FIELDS)
    .lean()
    .exec();
  return ret;
}
exports.findIceChallengeConstants = findIceChallengeConstants;

// ------- iceGameplayReports --------

async function findIceGameplayReports(filter) {
  let ret = await iceGameplayReportsModel
    .find(filter, HIDDEN_FIELDS)
    .lean()
    .exec();
  return ret;
}
exports.findIceGameplayReports = findIceGameplayReports;

// ------- clientConfigs --------

const clientConfigsOptions = {
  new: true,
  upsert: true,
  setDefaultsOnInsert: true,
};

async function findClientConfig(sceneName) {
  let ret = await clientConfigsModel
    .findOne({ sceneName: sceneName }, HIDDEN_FIELDS)
    .lean()
    .exec();
  return ret;
}
exports.findClientConfig = findClientConfig;

// videoStreamData

async function updateSceneVideoVolume(sceneName, volume) {
  let ret = await clientConfigsModel
    .findOneAndUpdate(
      { sceneName: sceneName },
      { $set: { "videoStreamData.volume": volume } },
      clientConfigsOptions
    )
    .lean()
    .exec();
  return ret;
}
exports.updateSceneVideoVolume = updateSceneVideoVolume;

// ------------- React Website appConfig. Place any arbitrary properties or flags that the website needs here. -------------------

async function getAppConfig() {
  // Grab the first document in the collection
  const appConfig = await appConfigModel
    .findOne({}, HIDDEN_FIELDS) // suppress `id` field in response
    .lean()
    .exec();

  if (appConfig) {
    return appConfig;
  } else {
    return undefined;
  }
}

exports.getAppConfig = getAppConfig;

// ------------- Metaverse gameConstants. Place any arbitrary properties or flags that the metaverse needs here. -------------------

async function getGameConstants() {
  // Grab the first document in the collection
  const gameConstants = await gameConstantsModel
    .findOne({}, HIDDEN_FIELDS) // suppress `id` field in response
    .exec();

  if (gameConstants) {
    return gameConstants.toJSON();
  } else {
    return "No document found";
  }
}
exports.getGameConstants = getGameConstants;

// ------------- Statistics for front page on the site -------------------

async function getFrontPageStats() {
  // Grab the first document in the collection
  const frontPageStats = await frontPageStatsModel
    .findOne({}, HIDDEN_FIELDS)
    .exec();

  if (frontPageStats) {
    return frontPageStats.toJSON();
  } else {
    return undefined;
  }
}
exports.getFrontPageStats = getFrontPageStats;

// ------------- Data for career page on the site -------------------

const getJobListings = async (): Promise<any> => {
  const jobListingsResult = await jobListingsModel
    .find({}, HIDDEN_FIELDS)
    .lean()
    .exec();
  return jobListingsResult;
};
exports.getJobListings = getJobListings;

exports.connectToMongoDb = connectToMongoDb;
