import sleep from "sleep-promise";

const dbMongo = require('../db/dbMongo');
const {api} = require('./common');
const {redis} = require('./redis');
const async = require('async');
import { logger } from './logger';

export async function updateServerList() {
  await redis.set('server_update', true); // lock the function till the process is ended so other server instances don't call this function at the same time
  try {
    const servers = await dbMongo.findAllServers();
    let _approvedDomainsList = servers[0].domains;
    let _serverNameList = servers[0].servers;
    let _islandsList = servers[0].islands;  // List of active DCL server island names from our database - this is updated on Socket Server and synced here to API Server
    global.islands = _islandsList; // island name

    const timeoutLength = 3000;

    // list of DCL server urls
    let dclServerUrls = await api(
      'https://peer-lb.decentraland.org/lambdas/explore/realms',
      {
        timeout: timeoutLength,
      }
    );
    dclServerUrls = dclServerUrls.map((item) => item.url);

    const fetchDataFromPeer = async (serverUrl, callback) => {
      try {
        const fullUrl = serverUrl + '/comms/status';

        // logger.debug('Fetching: ', fullUrl);

        let server = await api(fullUrl, {timeout: timeoutLength});
        if (serverUrl && !_approvedDomainsList.includes(serverUrl)) _approvedDomainsList.push(serverUrl);
        if (server.name && !_serverNameList.includes(server.name))
          _serverNameList.push(server.name); // update list of server realm names

        // Maps Catalyst serverUrl to serverName
        global.catalystDomainToServerNameMap[serverUrl] = server.name;

        // Maps Catalyst serverName to serverUrl
        global.catalystServerNameToDomainMap[server.name] = serverUrl

        // Must call the callback with `null` to trigger the `then` success handler
        callback(null);

      } catch (error) {
        // Must call the callback with `error` to trigger the `catch` error handler
        callback(error);
      }
    };

    /** Fetch data from APIs in parallel to load server faster
     @see: https://caolan.github.io/async/v3/global.html
     An "async function" in the context of Async is an asynchronous function with a variable number of parameters, with the final parameter being a callback. (function (arg1, arg2, ..., callback) {}) The final callback is of the form callback(err, results...), which must be called once the function is completed. The callback should be called with a Error as its first argument to signal that an error occurred. Otherwise, if no error occurred, it should be called with null as the first argument, and any additional result arguments that may apply, to signal successful completion. The callback must be called exactly once, ideally on a later tick of the JavaScript event loop.
     */
    await async.each(dclServerUrls, fetchDataFromPeer)
      .then(() => {
        // logger.debug('Fetched all successfully');
      })
      .catch(error => {
        if ((error.code && error.code === 'ECONNABORTED') || error.message) {
          logger.log('Failed to fetch:', error.config?.url);
          logger.log('Error: ', error.message);
        } else {
          logger.log('Error: ', error);
        }
      });

    global.domainList = _approvedDomainsList; // List of our internal approved server urls
    global.serverNameList = _serverNameList; // List of active DCL server realm names

    // updateDclServersList(); // updates our mongodb with the latest servers online for mapping to our realms

    await dbMongo.updateServers({
      domains: _approvedDomainsList,
      servers: _serverNameList
    });

  } catch (error) {
    logger.log('Error: ', error);
  }
  await redis.del('server_update'); //delete the key so other instances can call again
}

const checkRedisAndUpdateServerList = async () => {
  // If the server_update isn't locked
  if (!(await redis.get('server_update'))) {
    await updateServerList();
  } else {
    // If it is locked, retry in a few seconds
    await sleep(3000);
    await checkRedisAndUpdateServerList();
  }
}
setInterval(async () => {
  checkRedisAndUpdateServerList();
}, 0.5 * 60 * 1000); // refresh every 10 minutes

module.exports = {
  updateServerList,
};
