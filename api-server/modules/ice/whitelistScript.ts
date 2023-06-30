import addresses from './addresses.json';
const lowercaseAddresses = addresses.map((el) => el.toLowerCase());
const dbMongo = require('../../db/dbMongo');

const addUserstoWhitelist = async () => {
  await dbMongo.bulkUpdateVerifyStep(lowercaseAddresses, 15);
  console.log('Done!');
};

addUserstoWhitelist();