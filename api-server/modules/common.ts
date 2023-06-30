import axios from 'axios';
import moment from 'moment';
import { logger } from './logger';
const dbMongo = require('../db/dbMongo');
import keys from '../config/keys';

// utility function for grabbing json response from api
export const api = async (url, opts = {}) => {
  return axios.get(url, { ...opts }).then((response) => {
    if (response.status !== 200) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    return response.data;
  });
};

// Get JWT access token secret. This is used for Decoding the incoming JWTs. Each environment (testing, dev, staging, prod) shares one JWT_ACCESS_TOKEN_SECRET secret, so they can share JWTs from other envs.
let jwt_access_token_secret = keys.JWT_ACCESS_TOKEN_SECRET;

export const getSecret = async () => {
  if (!jwt_access_token_secret) {
    // Use the shared JWT_ACCESS_TOKEN_SECRET across all 4 environments, otherwise default to generate a random 64 hex encoded string.
    jwt_access_token_secret = require('crypto').randomBytes(64).toString('hex');
    logger.debug(
      'Generating new JWT_ACCESS_TOKEN_SECRET',
      jwt_access_token_secret
    );
  } else {
    // logger.debug('Using JWT_ACCESS_TOKEN_SECRET from Env Var:', jwt_access_token_secret)
  }

  return jwt_access_token_secret;
};

// returns true is competition is going on; false otherwise
export const checkCompetitionActiveStatus = async () => {
  let { competitionStart, competitionEnd } = await getCompetitionPeriod();

  return moment().utc().isBetween(competitionStart, competitionEnd);
};

// get competition start time, end time, and mode
export const getCompetitionPeriod = async () => {
  let competitionData = await dbMongo.findCompetition();
  let competitionStart = moment().utc();
  let competitionEnd = moment().utc();
  let mode = 'PLAY';
  if (
    !competitionData ||
    !competitionData['startTime'] ||
    !competitionData['endTime']
  ) {
    await dbMongo.updateCompetition({
      startTime: competitionStart,
      endTime: competitionEnd,
    });
  } else {
    competitionStart = moment(competitionData['startTime']);
    competitionEnd = moment(competitionData['endTime']);
    mode = competitionData['mode'];
  }
  return { competitionStart, competitionEnd, mode };
};
