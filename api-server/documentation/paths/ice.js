module.exports = {
  // check this response
  "/ice/mintToken/{itemID}/{tokenAddress}": {
    get: {
      tags: ["ice"],
      summary: "mints a new token",
      operationId: "iceMintToken",
      parameters: [
        {
          in: "path",
          name: "itemID",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
        {
          in: "path",
          name: "tokenAddress",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
        },
      },
    },
  },
  "/ice/upgradeToken/{tokenID}/{tokenAddress}": {
    get: {
      tags: ["ice"],
      summary: "upgrades a token",
      operationId: "iceUpgradeToken",
      parameters: [
        {
          in: "path",
          name: "tokenID",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
        {
          in: "path",
          name: "tokenAddress",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
        },
      },
    },
  },
  "/ice/getMetaData/{contractAddress}/{tokenID}": {
    get: {
      tags: ["ice"],
      summary: "gets a token's metadata",
      operationId: "iceGetMetaData",
      parameters: [
        {
          in: "path",
          name: "contractAddress",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
        {
          in: "path",
          name: "tokenID",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
        },
      },
    },
  },
  "/ice/delegateToken": {
    get: {
      tags: ["ice"],
      summary: "delegates a token to a target address",
      operationId: "iceDelegateToken",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "request body",
          required: true,
          schema: {
            type: "object",
            properties: {
              address: {
                schema: {
                  $ref: "#/components/schemas/userAddress",
                },
                description: "the token owner address",
              },
              delegateAddress: {
                schema: {
                  $ref: "#/components/schemas/userAddress",
                },
                description: "the delegatee address",
              },
              tokenID: {
                type: "string",
                example: "",
              },
              contractAddress: {
                type: "string",
                example: "",
              },
            },
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "boolean",
                    example: true,
                  },
                  result: {
                    type: "string",
                    example: "Success",
                  },
                  code: {
                    type: "integer",
                    example: 0,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/ice/undelegateToken": {
    get: {
      tags: ["ice"],
      summary: "",
      operationId: "",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "request body",
          required: true,
          schema: {
            type: "object",
            properties: {
              address: {
                schema: {
                  $ref: "#/components/schemas/userAddress",
                },
                description: "the request sender",
              },
              tokenOwner: {
                schema: {
                  $ref: "#/components/schemas/userAddress",
                },
                description: "the token owner",
              },
              delegateAddress: {
                schema: {
                  $ref: "#/components/schemas/userAddress",
                },
                description: "the delegatee address",
              },
              tokenID: {
                type: "string",
                example: "",
              },
              contractAddress: {
                type: "string",
                example: "",
              },
            },
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "boolean",
                    example: true,
                  },
                  result: {
                    type: "string",
                    example: "Success",
                  },
                  code: {
                    type: "integer",
                    example: 0,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/ice/delegateInfo": {
    get: {
      tags: ["ice"],
      summary:
        "get the delegate info of the specified user address in the query parameters",
      operationId: "iceDelegateInfo",
      parameters: [
        {
          in: "query",
          name: "address",
          required: true,
          schema: {
            $ref: "#/components/schemas/userAddress",
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  outgoingDelegations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tokenOwner: {
                          type: "string",
                          default: "",
                        },
                        delegateAddress: {
                          type: "string",
                          default: "",
                        },
                        tokenId: {
                          type: "string",
                          default: "",
                        },
                        contractAddress: {
                          type: "string",
                          default: "",
                        },
                        delegatePercent: {
                          type: "integer",
                          default: 70,
                        },
                      },
                    },
                  },
                  incomingDelegations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tokenOwner: {
                          type: "string",
                          default: "",
                        },
                        delegateAddress: {
                          type: "string",
                          default: "",
                        },
                        tokenId: {
                          type: "string",
                          default: "",
                        },
                        contractAddress: {
                          type: "string",
                          default: "",
                        },
                        delegatePercent: {
                          type: "integer",
                          default: 70,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/ice/claimRewards": {
    get: {
      tags: ["ice"],
      summary:
        "claims the rewards of the specified user address in the query parameters",
      operationId: "iceClaimRewards",
      parameters: [
        {
          in: "query",
          name: "address",
          required: true,
          schema: {
            $ref: "#/components/schemas/userAddress",
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "boolean",
                    example: true,
                  },
                  result: {
                    type: "string",
                    example: "giveClaimBulk transaction success",
                  },
                  txHash: {
                    type: "string",
                    example: "",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/ice/getUnclaimedRewardsAmount": {
    get: {
      tags: ["ice"],
      summary:
        "retrieves an object with the unclaimed rewards for the address specified in query parameters",
      operationId: "iceGetUnclaimedRewards",
      parameters: [
        {
          in: "query",
          name: "address",
          required: true,
          schema: {
            $ref: "#/components/schemas/userAddress",
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                parameters: {
                  totalUnclaimedAmount: {
                    type: "object",
                    properties: {
                      merkleRoot: {
                        type: "string",
                        default: "",
                      },
                      tokenTotal: {
                        type: "string",
                        default: "",
                      },
                      claims: {
                        type: "array",
                        default: [],
                        items: {
                          type: "object",
                          properties: {
                            status: {
                              type: "boolean",
                              example: true,
                            },
                            result: {
                              type: "string",
                              example: "giveClaimBulk transaction success",
                            },
                            txHash: {
                              type: "string",
                              example: "",
                            },
                          },
                        },
                      },
                      contractId: {
                        type: "string",
                        default: "",
                      },
                      iceKeeperAddress: {
                        type: "string",
                        default: "",
                      },
                    },
                  },
                  totalClaimedAmount: {
                    type: "object",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/ice/getRewardsConfig": {
    get: {
      tags: ["ice"],
      summary: "get the current rewards config",
      operationId: "iceGetRewardsConfig",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  challengeCategories: {
                    type: "object",
                    default: {},
                  },
                  leaderboardMultiplierMap: {
                    type: "array",
                    default: [],
                    items: {
                      type: "float",
                      default: 0,
                    },
                  },
                  xpUpgradeCosts: {
                    type: "array",
                    default: [],
                    items: {
                      type: "float",
                      default: 0,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/ice/fetchWearableCheckinStatus": {
    get: {
      tags: ["ice"],
      summary:
        "returns wether the specified wearable has been checked in for the day or not",
      operationId: "iceFetchCheckInStatus",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "request body",
          required: true,
          schema: {
            type: "object",
            properties: {
              address: {
                schema: {
                  $ref: "#/components/schemas/userAddress",
                },
              },
              tokenID: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
              },
            },
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "boolean",
                example: true,
              },
            },
          },
        },
      },
    },
  },
  "/ice/getWearableUpgradeMaps": {
    get: {
      tags: ["ice"],
      // check this description
      summary: "retrieves werable's upgrade maps",
      operationId: "iceGetWearablesUpgradeMaps",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
        },
      },
    },
  },
  "/ice/play": {
    get: {
      tags: ["ice"],
      summary: "load balancer (check description)",
      description:
        "This is a load balancer which automatically routes players joining the Poker DEXT lounge to the most populated server with a count of players online less than the value of `playIceLoadBalancerMaxPlayers`.",
      operationId: "icePlay",
      parameters: [
        {
          in: "query",
          name: "position",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        302: {
          description: "redirection",
          content: {
            "application/json": {
              schema: {
                type: "string",
                description: "redirect url",
              },
            },
          },
        },
      },
    },
  },
};
