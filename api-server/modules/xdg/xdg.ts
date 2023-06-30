import { Transaction } from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import { web3Handler } from '../web3';
import { contracts } from '../../db/dbContracts';
const dbMongo = require('../../db/dbMongo');
const { redis } = require('../redis');

import { logger } from '../logger';
import { getICEWorker, getRedisNonce } from '../ice/ice';

const customCommon = Common.forCustomChain(
  'mainnet',
  {
    name: 'Matic Network',
    networkId: 137,
    chainId: 137,
  },
  'petersburg'
);

export const claimRewards = async (address) => {
  const network = 'matic';
  const userData = await dbMongo.findUser(address);
  if (!userData) {
    throw new Error(`User ${address} does not exist`);
  }

  const appConfig = await dbMongo.getAppConfig();
  if (!appConfig.allowXDGClaims) {
    throw new Error('xDG claims are disabled');
  }

  // check if user is banned
  const isBanned = await dbMongo.findBannedUser(address) || await redis.get(`bannedUsers:${address}`);
  if (isBanned) {
    throw new Error(`User ${address} is banned`);
  }

  let dropHashes = [];
  let treeIndices = [];
  let amounts = [];
  let merkleProofs = [];

  const xdgKeeperAddress = contracts.XDG_KEEPER_CONTRACT_ADDRESS;

  // find trees for user's unclaimed xDG drops
  let unclaimedDrops = await dbMongo.findXDGRewardTrees(
    {
      $and: [
        {
          claims: {
            $elemMatch: {
              address: address,
              claimed: false,
            },
          },
        },
        { xdgKeeperAddress },
      ],
    },
    address,
    true
  );

  const polygonWeb3 = web3Handler.web3Types.matic;
  const contractXDGKeeper = web3Handler.contractInstances.contractXDGKeeper;

  for (let merkleTree of unclaimedDrops) {
    let claimData = merkleTree.claims[0];
    const hash = await contractXDGKeeper.methods
      .getHash(merkleTree.contractId)
      .call();
    const isClaimed = await contractXDGKeeper.methods
      .isClaimed(hash, address)
      .call();

    if (isClaimed) {
      // player has already claimed rewards for this drop
      // shouldn't happen, but just in case, this one is skipped
      continue;
    }
    const amount = polygonWeb3.utils.toBN(claimData.amount).toString();

    dropHashes.push(hash);
    treeIndices.push(claimData.index);
    amounts.push(amount);
    merkleProofs.push(claimData.proof);
  }

  if (dropHashes.length === 0) {
    return;
  }

  logger.log(
    'giveClaimBulk parameters for',
    address,
    ':\n_hash:',
    dropHashes,
    '\n_index:',
    treeIndices,
    '\n_amount:',
    amounts,
    '\n_merkleProof:',
    merkleProofs
  );

  const worker = await getICEWorker(network);

  const contractFunction = contractXDGKeeper.methods.giveClaimBulk(
    dropHashes,
    treeIndices,
    amounts,
    Array(dropHashes.length).fill(address),
    merkleProofs
  );
  let txHash = undefined;

  const gasEstimation = await contractFunction.estimateGas({
    from: worker.walletAddress,
  });

  const gasPrice = web3Handler.recommendedGasPrice;

  try {
    const functionABI = contractFunction.encodeABI();

    await polygonWeb3.eth
      .getTransactionCount(worker.walletAddress)
      .then(async (_nonce) => {
        const redisNonce = await getRedisNonce(worker.walletAddress, _nonce);
        const tx = new Transaction(
          {
            gasPrice: polygonWeb3.utils.toHex(
              polygonWeb3.utils.toWei(gasPrice.toString(), 'gwei')
            ),
            gasLimit: polygonWeb3.utils.toHex(gasEstimation),
            to: contractXDGKeeper.options.address,
            data: functionABI,
            nonce: polygonWeb3.utils.toHex(redisNonce),
          },
          { common: customCommon }
        );

        const privateKey = Buffer.from(worker.privateKey, 'hex');
        tx.sign(privateKey);
        const serializedTx = tx.serialize();

        /////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////
        const sendTransaction = async () => {
          try {
            await polygonWeb3.eth
              .sendSignedTransaction('0x' + serializedTx.toString('hex'))
              .once('transactionHash', (hash) => {
                txHash = hash;
                logger.log('giveClaimBulk transaction hash: ' + hash);
              });

            logger.log('giveClaimBulk transaction succeeded');
            for (let merkleTree of unclaimedDrops) {
              dbMongo.setXDGRewardsAsClaimed(
                address,
                merkleTree.contractId,
                xdgKeeperAddress
              );
            }
          } catch (e) {
            logger.log('sendTransaction function failed:', e);
          }
        };

        await sendTransaction();
      });
  } catch (e) {
    logger.log('giveClaimBulk transaction failed:', e);
  }

  return txHash;
};

export const getUnclaimedAmount = async (address) => {
  const polygonWeb3 = web3Handler.web3Types.matic;
  let totalUnclaimedAmount = polygonWeb3.utils.toBN('0');
  let totalClaimedAmount = polygonWeb3.utils.toBN('0');

  // check if user is banned
  const isBanned = await dbMongo.findBannedUser(address) || await redis.get(`bannedUsers:${address}`);
  const appConfig = await dbMongo.getAppConfig();
  if (isBanned) {
    return { totalUnclaimedAmount, totalClaimedAmount };
  }

  // find trees for user's unclaimed xDG drops
  const xdgDrops = await dbMongo.findXDGRewardTrees(
    {
      'claims.address': address,
    },
    address,
    false
  );

  const contractXDGKeeper = web3Handler.contractInstances.contractXDGKeeper;

  let claimPromises = [];
  for (let merkleTree of xdgDrops) {
    let claimData = merkleTree.claims[0];
    if (claimData.claimed) {
      totalClaimedAmount = totalClaimedAmount.add(
        polygonWeb3.utils.toBN(claimData.amount)
      );
    } else {
      const claimPromise = (async () => {
        const xdgKeeperAddress = merkleTree.xdgKeeperAddress;
        const hash = await contractXDGKeeper.methods
          .getHash(merkleTree.contractId)
          .call();
        const isClaimed = await contractXDGKeeper.methods
          .isClaimed(hash, address)
          .call();

        if (isClaimed) {
          // player has already claimed rewards for this drop
          // shouldn't happen, but just in case, this one is skipped
          totalClaimedAmount = totalClaimedAmount.add(
            polygonWeb3.utils.toBN(claimData.amount)
          );
          dbMongo.setXDGRewardsAsClaimed(
            address,
            merkleTree.contractId,
            xdgKeeperAddress
          );
          return;
        }
        totalUnclaimedAmount = totalUnclaimedAmount.add(
          polygonWeb3.utils.toBN(claimData.amount)
        );
      })();
      claimPromises.push(claimPromise);
    }
  }
  await Promise.all(claimPromises);

  return {
    totalUnclaimedAmount: appConfig.allowXDGClaims
      ? polygonWeb3.utils.fromWei(totalUnclaimedAmount.toString(), 'ether')
      : '0',
    totalClaimedAmount: polygonWeb3.utils.fromWei(
      totalClaimedAmount.toString(),
      'ether'
    ),
  };
};
