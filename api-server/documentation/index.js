const paths = require("./paths");
const schemas = require("./schemas");

module.exports = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "DG API Server",
    description: "Documentation for Decentral Games api server",
  },
  servers: [
    {
      url: "https://api.decentral.games",
      description: "Production server",
    },
    {
      url: "https://api.dev.decentral.games",
      description: "Development server",
    },
    {
      url: "https://api.staging.decentral.games",
      description: "Staging server",
    },
    {
      url: "https://api.testing.decentral.games",
      description: "Testing server",
    },
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
  ],
  tags: [
    {
      name: "order",
      description: "endpoints of the order router",
    },
    {
      name: "admin",
      description: "endpoints of the admin router",
    },
    {
      name: "authentication",
      description: "endpoints of the authentication router",
    },
    {
      name: "intel",
      description: "endpoints of the intel router",
    },
    {
      name: "ice",
      description: "endpoints of the ice router",
    },
    {
      name: "players",
      description: "endpoints of the players router",
    },
    {
      name: "address",
      description: "endpoints of the address router",
    },
  ],
  paths,
  components: {
    schemas,
  },
};
