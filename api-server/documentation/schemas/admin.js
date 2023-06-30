module.exports = {
  contracts: {
    type: "object",
    properties: {
      ROOT_TOKEN_ADDRESS_DAI: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      ROOT_TOKEN_ADDRESS_DG: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      CHILD_TOKEN_ADDRESS_DAI: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      CHILD_TOKEN_ADDRESS_MANA: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      CHILD_TOKEN_ADDRESS_DG2: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      CHILD_TOKEN_ADDRESS_ETH: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      CHILD_TOKEN_ADDRESS_DG: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      CHILD_TOKEN_ADDRESS_ICE: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      ROOT_TOKEN_ADDRESS_BUSD: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      ROOT_TOKEN_ADDRESS_BDG: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      TREASURY_CONTRACT_ADDRESS: {
        type: "object",
        properties: {
          matic: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
          bsc: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      TREASURY_SLOTS_ADDRESS: {
        type: "object",
        properties: {
          matic: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
          bsc: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      TREASURY_ROULETTE_ADDRESS: {
        type: "object",
        properties: {
          matic: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
          bsc: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      TREASURY_BACKGAMMON_ADDRESS: {
        type: "object",
        properties: {
          matic: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
          bsc: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      TREASURY_BLACKJACK_ADDRESS: {
        type: "object",
        properties: {
          matic: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
          bsc: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      TREASURY_POKER_ADDRESS: {
        type: "object",
        properties: {
          matic: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
          bsc: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      DG_POINTER_CONTRACT_ADDRESS: {
        type: "object",
        properties: {
          matic: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
          bsc: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      DG_KEEPER_CONTRACT_ADDRESS: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      DG_STAKING_CONTRACT_ADDRESS: {
        type: "object",
        properties: {
          ethereum: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      ICE_REGISTRANT_CONTRACT_ADDRESS: {
        type: "object",
        properties: {
          matic: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      ICE_KEEPER_CONTRACT_ADDRESS_1: {
        type: "object",
        properties: {
          matic: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      ICE_KEEPER_CONTRACT_ADDRESS_2: {
        type: "object",
        properties: {
          matic: {
            type: "string",
            example: "0x0000000000000000000000000000000000000000",
          },
        },
      },
      BP_TOKEN_ADDRESS: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
      BP_TOKEN_ADDRESS_2: {
        type: "string",
        example: "0x0000000000000000000000000000000000000000",
      },
    },
  },
  userAddressess: {
    type: "object",
    properties: {
      address: { type: "string", default: "" },
      MANALocked: { type: "string", default: 0 },
      ETHLocked: { type: "string", default: 0 },
      verifyStep: { type: "integer", default: 4 },
      authorized: { type: "integer", default: 0 },
      email: { type: "string", default: "" },
      id: { type: "string", default: "" },
      playBalance: { type: "integer", default: 1000 },
      competitionBalance: { type: "integer", default: 0 },
      iceChipsBalance: { type: "integer", default: 0 },
      iceXpCurrent: { type: "integer", default: 0 },
      iceXpAllTime: { type: "integer", default: 0 },
      callCount: { type: "integer", default: 0 },
      avatarName: { type: "string", default: "" },
      avatarImageID: { type: "string", default: "" },
      gasFill: { type: "integer", default: 0 },
      playersList: { type: "array", items: "string", default: [] },
      ipAddress: { type: "string", default: "" },
      tokenArray: {
        type: "array",
        items: "boolean",
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
      muted: { type: "boolean", default: false },
      currency: { type: "string", default: "" },
      timestamps: {
        type: "object",
        properties: {
          createdAt: {
            type: "date",
          },
          updatedAt: {
            type: "date",
          },
        },
      },
      collection: {
        type: "string",
        default: "userAddresses",
      },
    },
  },
};
