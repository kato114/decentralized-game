module.exports = {
  "/addresses": {
    get: {
      tags: ["address"],
      summary:
        "Get an object with the following addresses: \n founders, intel, nft holders and investors. \n Each member contains an array with several addresses.",
      operationId: "listAddresses",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/address",
              },
            },
          },
          description: "OK",
        },
      },
    },
  },
};
