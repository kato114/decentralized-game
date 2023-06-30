module.exports = {
  address: {
    type: "object",
    properties: {
      FOUNDERS: {
        type: "array",
        items: {
          type: "string",
          example: "0x0000000000000000000000000000000000000000",
        },
      },
      INTEL: {
        type: "array",
        items: {
          type: "string",
          example: "0x0000000000000000000000000000000000000000",
        },
      },
      NFT_HOLDERS: {
        type: "array",
        items: {
          type: "string",
          example: "0x0000000000000000000000000000000000000000",
        },
      },
      INVESTORS: {
        type: "array",
        items: {
          type: "string",
          example: "0x0000000000000000000000000000000000000000",
        },
      },
    },
  },
};
