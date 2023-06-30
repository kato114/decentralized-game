module.exports = {
  apps: [
    {
      name: "DG Marketplace",
      script: "./dist/server.js",
      watch: "./dist/",
      out_file: "../marketplace-logs/marketplace-log.log",
      error_file: "../marketplace-logs/marketplace-error.log",
    },
  ],
};
