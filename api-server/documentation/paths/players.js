module.exports = {
  "/players/getPlayerCount": {
    get: {
      tags: ["players"],
      summary: "gets the current player count",
      operationId: "playersGetPlayerCount",
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
  "/players/authorizeTreasury": {
    get: {
      tags: ["players"],
      // check this summary
      summary: "authorizes treasury",
      operationId: "playersAuthorizeTreasury",
      parameters: [
        {
          in: "query",
          name: "address",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
        {
          in: "query",
          name: "functionSignature",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
        {
          in: "query",
          name: "r",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
        {
          in: "query",
          name: "s",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
        {
          in: "query",
          name: "v",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
        {
          in: "query",
          name: "network",
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
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "transaction id",
              },
            },
          },
        },
      },
    },
  },
  "/sendLocation": {
    get: {
      tags: ["players"],
      // check this summary
      summary: "changes the user's location",
      operationId: "",
      parameters: [
        {
          in: "address",
          name: "address",
          required: true,
          schema: {
            $ref: "#/components/schemas/userAddress",
          },
        },
        {
          in: "query",
          name: "land",
          required: true,
          schema: {
            type: "string",
            example: "",
          },
        },
        {
          in: "query",
          name: "realm",
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
                properties: {
                  status: {
                    type: "boolean",
                    example: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/players/dclLogin": {
    get: {
      tags: ["players"],
      summary: "player login from Decentraland client",
      operationId: "playersDclLogin",
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
                    type: "string",
                  },
                  data: {
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
  "/players/dclRegister": {
    get: {
      tags: ["players"],
      summary: "registers a new user",
      operationId: "playersDclRegister",
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
              },
            },
          },
        },
      },
    },
  },
  // ignored endpoints because of deprecation: audioStreamStatus, videoStreamStatus, getActivePoap, getNftScreen
  "/players/getCompetitionActiveStatus": {
    get: {
      tags: ["players"],
      // check this summary
      summary: "checks the active competition if any",
      operationId: "playersGetCompetitionActiveStatus",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  start: {
                    type: "string",
                  },
                  end: {
                    type: "string",
                  },
                  mode: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/players/getClientConfig": {
    get: {
      tags: ["players"],
      summary: "retrieves the current client config",
      operationId: "playersGetClientConfig",
      parameters: [
        {
          in: "query",
          name: "sceneName",
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
                properties: {
                  clientConfig: {
                    type: "object",
                  },
                  rpcProvider: {
                    type: "object",
                    properties: {
                      matic: {
                        type: "string",
                      },
                      bsc: {
                        type: "string",
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
  "/players/getEvents": {
    get: {
      tags: ["players"],
      summary: "gets current events",
      operationId: "playersGetEvents",
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
};
