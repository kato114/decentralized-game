const common = require("./common");
const admin = require("./admin");
const address = require("./address");

module.exports = {
  ...common,
  ...admin,
  ...address,
};
