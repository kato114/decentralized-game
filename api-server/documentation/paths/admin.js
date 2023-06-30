module.exports = {
  "/admin/getDGPrice": {
    get: {
      tags: ["admin"],
      summary: "get current DG price in usd",
      operationId: "adminDGPrice",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  price: {
                    type: "number",
                    format: "float",
                    example: 111.11,
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getContractAddresses": {
    get: {
      tags: ["admin"],
      summary:
        "get an object with the different contract addresses of the dg ecosystem",
      operationId: "adminContractAddresses",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "ok",
                  },
                  result: {
                    $ref: "#/components/schemas/contracts",
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getTotalNfts": {
    get: {
      tags: ["admin"],
      summary: "get all nfts info",
      operationId: "adminGetTotalNfts",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  items: {
                    type: "array",
                    items: { type: "string" },
                  },
                  timestamps: {
                    type: "object",
                    properties: {
                      createdAt: {
                        type: "string",
                        format: "date",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date",
                      },
                    },
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/serverList": {
    get: {
      tags: ["admin"],
      summary: "get an array of the server list",
      operationId: "adminServerList",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  domainList: {
                    type: "array",
                    items: { type: "string" },
                  },
                  serverNameList: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getAllTimeWinningsForUser": {
    get: {
      tags: ["admin"],
      summary:
        "get an object with all time winning values of play, mana and dai; for specified user in query params",
      operationId: "",
      parameters: [
        {
          in: "query",
          name: "address",
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
                  play: {
                    type: "number",
                    format: "float",
                    example: 111.11,
                  },
                  mana: {
                    type: "number",
                    format: "float",
                    example: 111.11,
                  },
                  dai: {
                    type: "number",
                    format: "float",
                    example: 111.11,
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getUsersForFreePlay": {
    get: {
      tags: ["admin"],
      summary: "get users that use free play and user count",
      operationId: "adminGetUsersForFreePlay",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      address: { type: "string", default: "" },
                      coinName: { type: "string", default: "" },
                      betAmount: { type: "float", default: 0 },
                      globalID: { type: "string", default: "" },
                      number: { type: "integer", default: 0 },
                      amountWin: { type: "float", default: 0 },
                      earning: { type: "float", default: 0 },
                      usd: { type: "float", default: 0 },
                      txid: { type: "string", default: "" },
                      ptxid: { type: "string", default: "" },
                      type: { type: "string", default: "" },
                      gameType: { type: "integer", default: 0 },
                    },
                  },
                  count: {
                    type: "integer",
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getDGCirculatingSupply": {
    get: {
      tags: ["admin"],
      summary: "get the current DG circulating supply minus the required DG",
      operationId: "",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: "integer",
                default: [0],
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getCryptoRecords": {
    get: {
      tags: ["admin"],
      summary: "get crypto records for specified address in query parameters",
      operationId: "adminGetCryptoRecords",
      parameters: [
        {
          in: "query",
          name: "address",
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
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getTotalRecords": {
    get: {
      tags: ["admin"],
      summary: "get total records for specified address in query parameters",
      operationId: "adminGetTotalRecords",
      parameters: [
        {
          in: "query",
          name: "address",
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
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getUser": {
    get: {
      tags: ["admin"],
      summary: "get user information",
      operationId: "adminGetUser",
      parameters: [
        {
          in: "query",
          name: "address",
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
                $ref: "#/components/schemas/userAddressess",
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/preApprovedUsers": {
    get: {
      tags: ["admin"],
      summary: "get a list of pre approved users",
      operationId: "adminPreApprovedUsers",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  preApprovedUsers: {
                    type: "array",
                    items: {
                      type: "string",
                      default: "",
                    },
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/blockUser": {
    get: {
      tags: ["admin"],
      summary: "blocks the user specified in the query parameters",
      operationId: "adminBlockuser",
      parameters: [
        {
          in: "query",
          name: "address",
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
                type: "string",
                example: "done",
                description:
                  "'done' if successful, 'failed' if operation fails",
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/unBlockUser": {
    get: {
      tags: ["admin"],
      summary: "unblocks the user address specified in the query parameters",
      operationId: "adminUnblock",
      parameters: [
        {
          in: "query",
          name: "address",
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
                type: "string",
                example: "done",
                description:
                  "'done' if successful, 'failed' if operation fails",
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getHistory": {
    get: {
      tags: ["admin"],
      summary: "find all gameplay history",
      operationId: "adminGetHistory",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  address: { type: "string", default: "" },
                  coinName: { type: "string", default: "" },
                  betAmount: { type: "float", default: 0 },
                  globalID: { type: "string", default: "" },
                  number: { type: "integer", default: 0 },
                  amountWin: { type: "float", default: 0 },
                  earning: { type: "float", default: 0 },
                  usd: { type: "float", default: 0 },
                  txid: { type: "string", default: "" },
                  ptxid: { type: "string", default: "" },
                  type: { type: "string", default: "" },
                  gameType: { type: "integer", default: 0 },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getTotal": {
    post: {
      tags: ["admin"],
      summary: "find gameplay history with page, period and limit conditions",
      operationId: "",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              page: {
                type: "integer",
                example: "0",
                description: "page number",
              },
              period: {
                type: "integer",
                example: "0",
                description: "date period",
              },
              limit: {
                type: "integer",
                example: 0,
                description: "page limit",
              },
            },
          },
          required: true,
          description: "Request body.",
        },
      ],
      responses: {
        200: {
          content: {
            "app]lication/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    address: { type: "string", default: "" },
                    coinName: { type: "string", default: "" },
                    betAmount: { type: "float", default: 0 },
                    globalID: { type: "string", default: "" },
                    number: { type: "integer", default: 0 },
                    amountWin: { type: "float", default: 0 },
                    earning: { type: "float", default: 0 },
                    usd: { type: "float", default: 0 },
                    txid: { type: "string", default: "" },
                    ptxid: { type: "string", default: "" },
                    type: { type: "string", default: "" },
                    gameType: { type: "integer", default: 0 },
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getDeposit": {
    get: {
      tags: ["admin"],
      summary: "find all transactions",
      operationId: "adminGetDeposit",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    address: { type: "string", default: "" },
                    txid: {
                      type: "string",
                      default: "",
                    },
                    amount: { type: "float", default: 0 },
                    type: { type: "string", default: "" },
                    status: { type: "string", default: "" },
                    step: { type: "integer", default: 0 },
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getNotice": {
    get: {
      tags: ["admin"],
      summary: "get notice for welcome message",
      operationId: "adminGetNotice",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  text: {
                    type: "string",
                    example: "",
                  },
                  status: {
                    type: "string",
                    example: "",
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getRPCProvider": {
    get: {
      tags: ["admin"],
      summary: "get active RPC provider",
      operationId: "adminGetRPCProvider",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  matic: {
                    type: "string",
                    example: "",
                  },
                  bsc: {
                    type: "string",
                    example: "",
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getPokerHandHistory": {
    get: {
      tags: ["admin"],
      summary: "get poker hand history for specified user in query parameters",
      operationId: "adminGetPokerHandHistory",
      parameters: [
        {
          in: "query",
          name: "address",
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
                  sessionID: {
                    type: "string",
                    default: "",
                  },
                  tableData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        communityCards: {
                          type: "array",
                          items: {
                            type: {
                              type: "integer",
                              default: 0,
                            },
                          },
                        },
                        playerHandData: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              playerAddress: {
                                type: "string",
                                default: "",
                              },
                              hand: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    type: {
                                      type: "integer",
                                      default: 0,
                                    },
                                  },
                                },
                              },
                              userPlayInfoID: {
                                type: "string",
                                default: "",
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
          description: "OK",
        },
      },
    },
  },
  "/admin/healthCheck": {
    get: {
      tags: ["admin"],
      summary: "api health check",
      operationId: "adminHealthCheck",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  dbStatus: {
                    type: "string",
                    example: "running",
                  },
                  redisStatus: {
                    type: "string",
                    example: "running",
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getTreasuryBalanceHistory/{interval}": {
    get: {
      tags: ["admin"],
      summary: "get treasury balance history",
      operationId: "adminGetTreasuryBalanceHistory",
      parameters: [
        {
          in: "path",
          name: "interval",
          required: true,
          schema: {
            type: "string",
            enum: ["hour", "day", "week", "month", "year", "all"],
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
          description: "OK",
        },
      },
    },
  },
  "/admin/ping": {
    get: {
      tags: ["admin"],
      summary: "ping",
      operationId: "adminPing",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "pong",
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getAppConfig": {
    get: {
      tags: ["admin"],
      // check this description
      summary: "get the app config",
      operationId: "adminGetAppConfig",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  isPublicWebsiteMintingEnabled: {
                    type: "boolean",
                    default: false,
                  },
                  isPrivateWebsiteMintingEnabled: {
                    type: "boolean",
                    default: false,
                  },
                  isTokenMigrationEnabled: {
                    type: "boolean",
                    default: false,
                  },
                  requireStakedDG: {
                    type: "boolean",
                    default: false,
                  },
                },
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/getGameConstants": {
    get: {
      tags: ["admin"],
      // check this description
      summary: "get the constants used in game",
      operationId: "adminGetGameConstants",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
  "/admin/updateUserBalances": {
    get: {
      tags: ["admin"],
      summary: "update the requested user's balance",
      operationId: "",
      parameters: [
        {
          in: "query",
          name: "address",
          schema: {
            $ref: "#/components/schemas/userAddress",
          },
        },
        {
          in: "query",
          name: "user",
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
          description: "OK",
        },
      },
    },
  },
};
