module.exports = {
  "/intel/getProfitAndBetVolume": {
    get: {
      tags: ["intel"],
      // check this description
      summary: "get all profits and bet volume",
      operationId: "intelGetProfitsAndBets",
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
  "/intel/getTotalBetAmountByGame": {
    get: {
      tags: ["intel"],
      summary: "get the total bet amounts by game (all games)",
      operationId: "intelGetBetAmountsByGame",
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
  "/intel/getTotalRevenueByGame": {
    get: {
      tags: ["intel"],
      summary: "get the total revenue by game (all games)",
      operationId: "intelGetRevenueByGame",
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
