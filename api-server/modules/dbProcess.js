// const Analytics = require('analytics-node');
// const analytics = new Analytics('OrHyO2XSTZJ6f0KXcojtAB4kyScvZn8B');
const dbMongo = require('../db/dbMongo');
const multiplier = 1000000000000000000;
dbMongo.initDb();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports.getParcelInfo = async (landID, tokenID) => {
  var info;
  if (landID === '*' || tokenID === '*') {
    let data = {};
    if (landID !== '*') data.landId = landID;
    else if (tokenID !== '*') data.tokenId = tokenID;
    info = await dbMongo.findAllParcelTotalInfo(data);
  } else {
    info = await dbMongo.findParcelTotalInfo({
      landId: landID,
      tokenId: tokenID,
    });
  }
  return info;
};
