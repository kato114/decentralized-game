const order = require("./order");
const admin = require("./admin");
const authentication = require("./authentication");
const intel = require("./intel");
const ice = require("./ice");
const players = require("./players");
const address = require("./address");

module.exports = {
  ...order,
  ...admin,
  ...authentication,
  ...intel,
  ...ice,
  ...players,
  ...address,
};
