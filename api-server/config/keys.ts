// keys.ts - figure out which set of credentials to return
import { logger } from '../modules/logger';
import productionKeys from './prod';
import { EnvironmentVariables } from '../types/keys.config';

logger.log('NODE_ENV:', process.env.NODE_ENV || 'NODE_ENV not set');

let defaultKeys: EnvironmentVariables = undefined;
if (
  process.env.NODE_ENV &&
  !['localhost', 'test'].includes(process.env.NODE_ENV)
) {
  logger.log('loading `prod` config');
  defaultKeys = productionKeys;
} else {
  logger.log('loading `dev` config');
  defaultKeys = require('./dev').default;
}
export default defaultKeys;
