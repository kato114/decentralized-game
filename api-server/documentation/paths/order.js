module.exports = {
  "/order/webLogin": {
    post: {
      tags: ["order"],
      summary:
        "Send user's status to client and update user's IP address in database",
      operationId: "webLogin",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "boolean",
                    default: true,
                    description: "true if login was successful",
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
  "/order/webRegister": {
    post: {
      tags: ["order"],
      summary:
        "Register new user and assign user to affiliate (if affiliate parameter present)",
      operationId: "webRegister",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            required: "address",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to use",
              },
              affiliate: {
                type: "boolean",
                example: true,
              },
            },
          },
          required: true,
          description: "Request body.",
        },
      ],
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "boolean",
                  default: true,
                  description: "true if operation was successful",
                },
              },
            },
          },
        },
        description: "OK",
      },
    },
  },
  "/order/updateTokenArray": {
    post: {
      tags: ["order"],
      summary: "Set token type boolean to true",
      operationId: "updateTokenArray",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to use",
              },
              index: {
                type: "integer",
                example: 1,
                description: "the token array index",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "boolean",
                    default: true,
                    description: "true if operation was successful",
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
  "/order/topup": {
    post: {
      tags: ["order"],
      summary: "Top user account up",
      deprecated: true,
      responses: {
        404: {},
      },
    },
  },
  "/order/getUser": {
    post: {
      tags: ["order"],
      summary: "Find user info by its wallet address and send result.",
      operationId: "orderGetUser",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to use.",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "ok",
                    description:
                      "'ok' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
  "/order/addAddress": {
    post: {
      tags: ["order"],
      summary: "Save user's wallet addres, manalock and ethlock info.",
      operationId: "orderAddAddress",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to use.",
              },
              manaLock: {
                type: "integer",
                example: 0,
                description: "manalock value.",
              },
              ethLock: {
                type: "integer",
                example: 0,
                description: "ethlock value.",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "ok",
                    description:
                      "'ok' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
  "/order/updateHistory": {
    post: {
      tags: ["order"],
      summary: "Save user's transaction history (deposit/withdrawal).",
      operationId: "orderUpdateHistory",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to use.",
              },
              txHash: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "transaction hash",
              },
              amount: {
                type: "integer",
                example: 0,
                description: "transaction value",
              },
              type: {
                type: "string",
                example: "",
                description: "transaction type",
              },
              state: {
                type: "string",
                example: "",
                description: "transaction status",
              },
              step: {
                type: "integer",
                example: 0,
                description: "transaction step",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "ok",
                    description:
                      "'ok' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
  "/order/checkHistory": {
    post: {
      tags: ["order"],
      summary: "get transaction info by transaction id",
      operationId: "orderCheckHistory",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              txHash: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "transaction hash",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "ok",
                    description:
                      "'ok' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
  "/order/confirmHistory": {
    post: {
      tags: ["order"],
      summary:
        "Get transaction info by transaction id and check if it is confirmed.",
      operationId: "orderConfirmHistory",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              txHash: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "transaction hash",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "ok",
                    description:
                      "'ok' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
  "order/getHistory": {
    post: {
      tags: ["order"],
      summary: "Get transaction history by address, limit and page number.",
      operationId: "orderGetHistory",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "address to use.",
              },
              page: {
                type: "integer",
                example: 0,
                description: "page number to check",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "ok",
                    description:
                      "'ok' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
  "/order/existWithdraw": {
    post: {
      tags: ["order"],
      summary: "check if user has withdrawal history",
      operationId: "orderExistWithdraw",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to check",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "true",
                    description:
                      "'true' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
  "/order/getPlayInfo": {
    post: {
      tags: ["order"],
      summary: "Get gameplay infos by address, limit and page number",
      operationId: "orderGetPlayInfo",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to check",
              },
              page: {
                type: "integer",
                example: "0",
                description: "page number to check",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "ok",
                    description:
                      "'ok' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
  "/order/getPlayInfoCSV": {
    post: {
      tags: ["order"],
      summary:
        "Get gameplay infos by address, limit and page number. CSV FORMAT",
      operationId: "orderGetPlayInfoCSV",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to check",
              },
              page: {
                type: "integer",
                example: "0",
                description: "page number to check",
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
            "text/csv": {
              schema: {
                type: "string",
              },
            },
          },
          headers: {
            "Content-disposition": {
              schema: {
                type: "string",
                description: "attachment, csv file",
              },
            },
          },
        },
        description: "OK",
      },
    },
  },
  "/order/getTokens": {
    post: {
      tags: ["order"],
      summary: "distribute DG tokens to user",
      operationId: "orderGetTokens",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to use",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "ok",
                    description:
                      "'ok' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
  "/order/updateUserAuthState": {
    post: {
      tags: ["order"],
      summary: "update user's authentication status",
      operationId: "orderUpdateUserAuthState",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to use",
              },
              authorized: {
                type: "boolean",
                example: true,
                description: "user auth status",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "ok",
                    description:
                      "'ok' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
  "/order/addTrade": {
    post: {
      tags: ["order"],
      summary: "save user's trading info",
      operationId: "orderAddTrade",
      parameters: [
        {
          in: "body",
          name: "body",
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "user address to use",
              },
              MANAamount: {
                type: "integer",
                example: 0,
                description: "user's MANA",
              },
              ETHamount: {
                type: "integer",
                example: 0,
                description: "user's ETH",
              },
              paymentType: {
                type: "string",
                example: "",
                description: "payment type",
              },
              txHash: {
                type: "string",
                example: "0x0000000000000000000000000000000000000000",
                description: "transaction hash",
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    default: "ok",
                    description:
                      "'ok' if operation was successful, 'fail' if unsuccessful",
                  },
                  result: {
                    type: "object",
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
};
