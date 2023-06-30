module.exports = {
  "/authentication/getWebAuthToken": {
    get: {
      tags: ["authentication"],
      summary: "get token for web auth",
      operationId: "authGetWebAuthToken",
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
          name: "signature",
          schema: {
            type: "string",
          },
        },
        {
          in: "query",
          name: "timestamp",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "string",
                description: "an auth token",
                example: "",
              },
            },
          },
          description: "OK",
        },
        401: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "signature verification failed",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/authentication/getAuthToken": {
    get: {
      tags: ["authentication"],
      summary: "gets an auth token",
      operationId: "authGetAuthToken",
      parameters: [
        {
          in: "query",
          name: "addressLowerCase",
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
                description: "an auth token",
                example: "",
              },
            },
          },
          description: "OK",
        },
        401: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "signature verification failed",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/authentication/verifyToken": {
    get: {
      tags: ["authentication"],
      summary: "verifies an auth token",
      operationId: "authVerifyToken",
      parameters: [
        {
          in: "header",
          name: "Authorization",
          schema: {
            type: "string",
            example: "",
            description: "an auth bearer token",
          },
          required: true,
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
                    example: "Success! I see that you are user {address}",
                  },
                },
              },
            },
          },
        },
        403: {
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "",
              },
            },
          },
        },
      },
    },
  },
};
