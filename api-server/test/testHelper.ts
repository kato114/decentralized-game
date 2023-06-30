import jwt from 'jsonwebtoken';
import keys from '../config/keys';

export const testAdminWalletAddress = "0x39f123f76ce10489811bac968dd21c198512f808";
const environments = ['staging', 'development', 'testing', 'production'];

const testServerSpecs = {
  testing: 'https://api.testing.decentral.games',
  development: 'https://api.dev.decentral.games',
  staging: 'https://api.staging.decentral.games',
  production: 'https://api.decentral.games'
};

export const getTestServerSpec = (nodeENV: string):string => {
  let testServerSpec;
  if (environments.includes(nodeENV)){
    testServerSpec = testServerSpecs[nodeENV];
  } else{
    //this is for local testing
    const PORT = process.env.PORT || 5000;
    testServerSpec = `http://localhost:${PORT}`
  }

  return testServerSpec;
}

export async function getJWT(address: string, ttl: number) {
    const jwt_access_token_secret = keys.JWT_ACCESS_TOKEN_SECRET;
  
    return new Promise((resolve, reject) =>
      jwt.sign(
        { address: address, unitTesting: true },
        jwt_access_token_secret,
        {
          algorithm: 'HS256',
          expiresIn: !isNaN(ttl) ? `${ttl}h` : '12h', // allow custom TTL, or default to 12h
        },
        (err, token) => {
          if (err) {
            return reject(err);
          }
          if (!token) {
            return new Error('Empty token');
          }
          return resolve(token);
        }
      )
    );
}