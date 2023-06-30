import { parseBalanceMap } from './merkleTree/parse-balance-map';
import crypto from 'crypto';
import { logger } from '../logger';
import Common from 'ethereumjs-common';
import { web3Handler } from '../web3';
import { updateContracts } from '../../db/dbContracts';
import { Transaction } from 'ethereumjs-tx';
const dbMongo = require('../../db/dbMongo');
import keys from '../../config/keys';

// helper script to generate xDG reward tree used for distributing airdrops
// this script can be run via "npm run xdgDrop"

const generateMerkleTree = async (balances: { [account: string]: string }) => {
  if (Object.keys(balances).length === 0) {
    logger.log('Error: No balances provided to generate merkle tree from.');
    process.exit(1);
  }

  // update contract addresses
  await updateContracts();

  // initialize web3 contracts
  await web3Handler.init();

  // logger.debug(`xDG Balances: ${JSON.stringify(balances)}`);
  const merkleTree = parseBalanceMap(balances);
  // logger.debug('Generated Merkle Tree:', JSON.stringify(merkleTree));

  // save result to database and create xDG drop in xDGKeeper contract
  const network = 'matic';
  const web3 = web3Handler.web3Types.matic;
  const contractXDGKeeper = web3Handler.contractInstances.contractXDGKeeper;

  const contractId = crypto.randomBytes(16).toString('hex');

  const workerAddress = keys.WALLET_ADDRESS_ICE_KEEPER_CLAIM[network];
  const contractFunction = contractXDGKeeper.methods.createDrop(
    merkleTree.merkleRoot,
    web3.utils.toBN(merkleTree.tokenTotal).toString(),
    contractId
  );

  const gasPrice = 300;

  try {
    const functionABI = contractFunction.encodeABI();

    web3.eth.getTransactionCount(workerAddress).then((_nonce) => {
      const customCommon = Common.forCustomChain(
        'mainnet',
        {
          name: 'Matic Network',
          networkId: 137,
          chainId: 137,
        },
        'petersburg'
      );
      const tx = new Transaction(
        {
          gasPrice: web3.utils.toHex(
            web3.utils.toWei(gasPrice.toString(), 'gwei')
          ),
          gasLimit: web3.utils.toHex(1000000),
          to: contractXDGKeeper.options.address,
          data: functionABI,
          nonce: web3.utils.toHex(_nonce),
        },
        { common: customCommon }
      );

      const privateKey = Buffer.from(
        keys.WALLET_PRIVATE_KEY_ICE_KEEPER_CLAIM[network],
        'hex'
      );
      tx.sign(privateKey);
      const serializedTx = tx.serialize();

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      const sendTransaction = async () => {
        try {
          await web3.eth
            .sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .once('transactionHash', (hash) => {
              logger.log('createDrop transaction hash: ' + hash);
            });

          logger.log('createDrop transaction succeeded');
          // insert xDG reward tree data; divide into groups of 100 addresses / document
          let promises = [];
          const maxAddressesPerDocument = 100;
          for (
            let i = 0;
            i < merkleTree.claims.length;
            i += maxAddressesPerDocument
          ) {
            promises.push(
              new Promise(async (resolve, reject) => {
                await dbMongo.insertXDGRewardTree({
                  merkleRoot: merkleTree.merkleRoot,
                  tokenTotal: merkleTree.tokenTotal,
                  claims: merkleTree.claims.slice(
                    i,
                    i + maxAddressesPerDocument
                  ),
                  contractId,
                  xdgKeeperAddress:
                    contractXDGKeeper.options.address.toLowerCase(),
                });
                resolve(0);
              })
            );
          }
          await Promise.all(promises);
          logger.log('xdgRewardTrees insertions succeeded');
          process.exit(0);
        } catch (e) {
          logger.log('createDrop transaction failed:', e);
          process.exit(1);
        }
      };

      sendTransaction();
    });
  } catch (e) {
    logger.log('createDrop transaction failed:', e);
    process.exit(1);
  }
};

// mapping from Ethereum address to xDG token airdrop amount in wei

// Example:
// const balances = {
//   'ADDRESS_0_HERE': 'AMOUNT_0_HERE',
//   'ADDRESS_1_HERE': 'AMOUNT_1_HERE',
//   ...
// };

// import balances from './addresses.json';
// Object.keys(balances).forEach((key) => {
//   balances[key] = balances[key] + '000000000000000000';
// });
// generateMerkleTree(balances as any);
