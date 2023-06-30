export type EnvironmentVariables = {
  WALLET_ADDRESS: {
    matic: string;
    bsc: string;
  };
  WALLET_PRIVATE_KEY: {
    matic: string;
    bsc: string;
  };
  WALLET_ADDRESS_ICE_REGISTRANT: {
    matic: string[];
  };
  WALLET_PRIVATE_KEY_ICE_REGISTRANT: {
    matic: string[];
  };
  WALLET_ADDRESS_ICE_KEEPER_CLAIM: {
    matic: string;
  };
  WALLET_PRIVATE_KEY_ICE_KEEPER_CLAIM: {
    matic: string;
  };
  DB_CONNECTION_STRING: string;
  REDIS_CONNECTION_STRING: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  SLACK_VERIFY_TOKEN: string;
  NODE_ENV: string;
  SERVICE_BUS_CONNECTION_STRING?: string;
  SERVICE_BUS_QUEUE_NAME?: string;
};
