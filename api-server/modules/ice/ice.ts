import { web3Handler } from '../web3';
import { Transaction } from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import BigNumber from 'bignumber.js';
import { logger } from '../logger';
import { TokenData } from 'types/ice.module';
import moment from 'moment';
import { contracts } from '../../db/dbContracts';
import { api } from '../common';
import axios from 'axios';
import { EntryNotFoundError } from '../errors/errors';
import {
  transactionDGRevenueResponse,
  ethereumLogReceipt,
  IceLeaderBoardScore,
  RankedIceLeaderBoardScore,
} from 'types/ice.module';
import {getIceChipsRecords} from '../leaderboard';
import sleep from 'sleep-promise';
import keys from '../../config/keys';
import { redis } from '../redis';
import Web3 from 'web3';
const dbMongo = require('../../db/dbMongo');
//value taken from the socket server
const multiplier = 1000000000000000000;

const customCommon = Common.forCustomChain(
  'mainnet',
  {
    name: 'Matic Network',
    networkId: 137,
    chainId: 137,
  },
  'petersburg'
);

// load multiple workers for iceRegistrant / iceKeeper
let iceWorkers = { matic: [] };

const network = 'matic';
for (let i = 0; i < keys.WALLET_ADDRESS_ICE_REGISTRANT[network].length; i++) {
  iceWorkers[network].push({
    walletAddress: keys.WALLET_ADDRESS_ICE_REGISTRANT[network][i],
    privateKey: keys.WALLET_PRIVATE_KEY_ICE_REGISTRANT[network][i],
  });
}

export const getICEWorker = async (network = 'matic') => {
  // get index of next ICE worker from Redis
  // this is to support scalable API instances and avoid interfering transactions
  await redis.setnx('iceWorkerRotationIndex', 0); // set to 0 if not set yet
  const workerCount = keys.WALLET_ADDRESS_ICE_REGISTRANT[network].length;
  const rotationIndex = await redis.eval(
    `local rotationIndex = redis.call('get','iceWorkerRotationIndex');
    redis.call('set', 'iceWorkerRotationIndex', (rotationIndex + 1) % ${workerCount});
    return rotationIndex`,
    0
  );
  const worker = iceWorkers[network][rotationIndex];
  return worker;
};

export const getRedisNonce = async (workerAddress: string, _nonce: number) => {
  // when transactions are happening quickly, _nonce is sometimes out of date
  // if _nonce and nonce in Redis are identical, it means _nonce has already been used for a submitted tx
  // if this happens, increment nonce in Redis and use it for this tx

  const redisNonce = await redis.eval(
    `local nonce = redis.call('get', 'workerNonce:${workerAddress}');
    if nonce == false or tonumber(nonce) < ${_nonce} then nonce = ${_nonce}
    else nonce = nonce + 1
    end;
    redis.call('set', 'workerNonce:${workerAddress}', nonce, 'EX', 60);
    return tonumber(nonce)`,
    0
  );
  return redisNonce;
};

//////////////////////////////////////////////////////////////////////////////////
export const DGStakingCheck = async (playerAddress): Promise<boolean> => {
  // get affiliate wallet address base on the affiliate's ID
  try {
    const xDGBalanceMainnet =
      await web3Handler.contractInstances.contractXDGToken.eth.methods
        .balanceOf(playerAddress)
        .call();
    const xDGBalancePolygon =
      await web3Handler.contractInstances.contractXDGToken.polygon.methods
        .balanceOf(playerAddress)
        .call();

    let total =
      new BigNumber(xDGBalanceMainnet).div(1e18).toNumber() +
      new BigNumber(xDGBalancePolygon).div(1e18).toNumber();

    logger.log(playerAddress, `xDG Balance: ${total}`);
    if (total >= 1000) {
      return true;
    }

    // use old DG staking contract as fallback in case total xDG balance is less than the cutoff
    const oldDgBalance =
      await web3Handler.contractInstances.contractDGStaking.methods
        .balanceOf(playerAddress)
        .call();
    total = new BigNumber(oldDgBalance).div(1e18).toNumber();
    logger.log(playerAddress, `Staked DG Balance: ${total}`);
    if (total >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    logger.log("Getting User's staked DG balance error:", e);
    return false;
  }
};

/**
 * Mint a Wearable Token
 **/
export const mintToken = async (
  itemID,
  playerAddress,
  tokenAddress,
  maxMintCount,
  itemNFTPurchaserAddress,
  isIceNFT = true
) => {
  // mint item ItemID of tokenAddress for playerAddress
  const network = 'matic';
  const action = `mintToken: Attempt to Mint item ${itemID} of ${tokenAddress} for ${playerAddress}`;

  const mintLoggingData = {
    itemID,
    playerAddress,
    tokenAddress,
  };

  logger.log(action + ' - Mint Data:', mintLoggingData);
  let contractWearable;
  let contractRegistrant;
  if (isIceNFT) {
    contractWearable =
      web3Handler.contractInstances.contractWearables[tokenAddress];
    contractRegistrant = web3Handler.contractInstances.contractIceRegistrant;
  } else {
    contractWearable =
      web3Handler.contractInstances.contractWearables[tokenAddress];
    contractRegistrant =
      web3Handler.contractInstances.contractNFTPurchaser[
        itemNFTPurchaserAddress
      ];
  }

  const itemData = await contractWearable.methods.items(itemID).call();
  if (
    itemData.totalSupply === itemData.maxSupply ||
    itemData.totalSupply >= maxMintCount
  ) {
    throw new Error(
      `${tokenAddress} has no remaining items with itemID ${itemID}`
    );
  }

  const paymentToken = await contractRegistrant.methods.paymentToken().call();

  let price = isIceNFT
    ? await contractRegistrant.methods.mintingPrice().call()
    : await contractRegistrant.methods.buyingPrice().call();

  const mintingPriceFormatted = new BigNumber(price).div(1e18).toNumber();

  let contractPaymentToken;
  if (
    paymentToken.toLowerCase() === '0xc6c855ad634dcdad23e64da71ba85b8c51e5ad7c'
  ) {
    contractPaymentToken = web3Handler.contractInstances.contractIceToken;
  } else if (
    paymentToken.toLowerCase() === '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
  ) {
    contractPaymentToken =
      web3Handler.contractInstances.contractEthToken.polygon;
  }

  const allowance = await contractPaymentToken.methods
    .allowance(playerAddress, contractRegistrant.options.address)
    .call();
  const allowanceFormatted = new BigNumber(allowance).div(1e18).toNumber();

  if (allowanceFormatted < mintingPriceFormatted) {
    throw new Error(
      `${playerAddress} has insufficient allowance set (${allowanceFormatted}); ${mintingPriceFormatted} required`
    );
  }

  const tokenBalance = await contractPaymentToken.methods
    .balanceOf(playerAddress)
    .call();
  const tokenBalanceFormatted = new BigNumber(tokenBalance)
    .div(1e18)
    .toNumber();

  if (tokenBalanceFormatted < mintingPriceFormatted) {
    throw new Error(
      `${playerAddress} has insufficient balance (${tokenBalanceFormatted}); ${mintingPriceFormatted} required`
    );
  }

  const canPurchaseAgain = await contractRegistrant.methods
    .canPurchaseAgain(playerAddress)
    .call();
  if (!canPurchaseAgain) {
    throw new Error(`${playerAddress} is in cool-down period and cannot mint`);
  }

  // Get the next available Mint Worker
  const worker = await getICEWorker(network);

  // Reference to the mintToken function on the contract
  let contractFunction = isIceNFT
    ? contractRegistrant.methods.mintToken(itemID, playerAddress, tokenAddress)
    : contractRegistrant.methods.purchaseToken(
        itemID,
        playerAddress,
        tokenAddress
      );

  const gasPrice = web3Handler.recommendedGasPrice;
  const txResult: any = {};
  txResult.workerAddress = worker.walletAddress;

  try {
    const functionABI = contractFunction.encodeABI();

    const polygonWeb3 = web3Handler.web3Types.matic;
    await polygonWeb3.eth
      .getTransactionCount(worker.walletAddress)
      .then(async (_nonce) => {
        const redisNonce = await getRedisNonce(worker.walletAddress, _nonce);
        const tx = new Transaction(
          {
            gasPrice: polygonWeb3.utils.toHex(
              polygonWeb3.utils.toWei(gasPrice.toString(), 'gwei')
            ),
            gasLimit: polygonWeb3.utils.toHex(500000),
            to: contractRegistrant.options.address,
            data: functionABI,
            nonce: polygonWeb3.utils.toHex(redisNonce),
          },
          { common: customCommon }
        );

        const privateKey = Buffer.from(worker.privateKey, 'hex');
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        debugger;
        const sendTransaction = async () => {
          await polygonWeb3.eth
            .sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .once('transactionHash', (hash) => {
              txResult.txHash = hash;
              logger.log(
                `mintToken: Transaction hash: ${hash} - Mint Data:`,
                mintLoggingData
              );
            });

          logger.log(
            `mintToken: Transaction complete - Mint Data:`,
            mintLoggingData
          );
        };

        await sendTransaction();
      });
  } catch (err) {
    txResult.error = err.message.split('\n')[0];
    logger.log(
      `mintToken: Transaction failed: ${err} - Mint Data:`,
      mintLoggingData,
      'Worker address:',
      worker.walletAddress
    );
  }

  return txResult;
};

export const upgradeToken = async (
  tokenOwner,
  tokenAddress,
  tokenId,
  itemID,
  oldRank
) => {
  // upgrade Token with tokenId to itemID
  const network = 'matic';
  const action = `Upgrading ${tokenOwner}'s token ${tokenId} to itemID ${itemID} on ${tokenAddress}`;
  logger.log(action);

  const txResult: any = {};

  try {
    const contractICERegistrant =
      web3Handler.contractInstances.contractIceRegistrant;
    const levels = await contractICERegistrant.methods
      .levels(oldRank + 1)
      .call();
    const DGUpgradePriceFormatted = new BigNumber(levels.costAmountDG)
      .div(1e18)
      .toNumber();
    const ICEUpgradePriceFormatted = new BigNumber(levels.costAmountICE)
      .div(1e18)
      .toNumber();

    // check that user has enough DG approved / in wallet to upgrade
    let contractDGToken =
      web3Handler.contractInstances.contractDgTokenNew.polygon;

    const DGAllowance = await contractDGToken.methods
      .allowance(tokenOwner, contracts.ICE_REGISTRANT_CONTRACT_ADDRESS['matic'])
      .call();
    const DGAllowanceFormatted = new BigNumber(DGAllowance)
      .div(1e18)
      .toNumber();

    if (DGAllowanceFormatted < DGUpgradePriceFormatted) {
      throw new Error(
        `${tokenOwner} has insufficient DG allowance set (${DGAllowanceFormatted}); ${DGUpgradePriceFormatted} required`
      );
    }

    const DGTokenBalance = await contractDGToken.methods
      .balanceOf(tokenOwner)
      .call();
    const DGTokenBalanceFormatted = new BigNumber(DGTokenBalance)
      .div(1e18)
      .toNumber();

    if (DGTokenBalanceFormatted < DGUpgradePriceFormatted) {
      throw new Error(
        `${tokenOwner} has insufficient DG balance (${DGTokenBalanceFormatted}); ${DGUpgradePriceFormatted} required`
      );
    }

    // check that user has enough ICE approved / in wallet to upgrade
    let contractICEToken = web3Handler.contractInstances.contractIceToken;

    const ICEAllowance = await contractICEToken.methods
      .allowance(tokenOwner, contracts.ICE_REGISTRANT_CONTRACT_ADDRESS['matic'])
      .call();
    const ICEAllowanceFormatted = new BigNumber(ICEAllowance)
      .div(1e18)
      .toNumber();

    if (ICEAllowanceFormatted < ICEUpgradePriceFormatted) {
      throw new Error(
        `${tokenOwner} has insufficient ICE allowance set (${ICEAllowanceFormatted}); ${ICEUpgradePriceFormatted} required`
      );
    }

    const ICETokenBalance = await contractICEToken.methods
      .balanceOf(tokenOwner)
      .call();
    const ICETokenBalanceFormatted = new BigNumber(ICETokenBalance)
      .div(1e18)
      .toNumber();

    if (ICETokenBalanceFormatted < ICEUpgradePriceFormatted) {
      throw new Error(
        `${tokenOwner} has insufficient ICE balance (${ICETokenBalanceFormatted}); ${ICEUpgradePriceFormatted} required`
      );
    }

    // check that NFT is approved for transfer
    let contractWearable =
      web3Handler.contractInstances.contractWearables[tokenAddress];

    const approvedAddress = await contractWearable.methods
      .getApproved(tokenId)
      .call();

    if (
      approvedAddress.toLowerCase() !==
      contracts.ICE_REGISTRANT_CONTRACT_ADDRESS['matic'].toLowerCase()
    ) {
      throw new Error(`${tokenId} is not approved for transfer`);
    }

    const worker = await getICEWorker(network);
    const contractFunction = contractICERegistrant.methods.upgradeToken(
      tokenOwner,
      tokenAddress,
      tokenId,
      itemID
    );

    const gasEstimation = await contractFunction.estimateGas({
      from: worker.walletAddress,
    });

    const gasPrice = web3Handler.recommendedGasPrice;

    const functionABI = contractFunction.encodeABI();

    const polygonWeb3 = web3Handler.web3Types.matic;
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
            to: contractICERegistrant.options.address,
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
                txResult.txHash = hash;
                logger.log('upgradeToken transaction hash: ' + hash);
              });

            logger.log(`${action} complete`);
          } catch (e) {
            throw e;
          }
        };

        await sendTransaction();
      });
  } catch (e) {
    txResult.error = e.message.split('\n')[0];
    logger.log('upgradeToken transaction failed: ' + e);
  }

  return txResult;
};

export const getBonusFromTxHash = async (tokenOwner, wearableContractAddress, txHash) => {
      const contractICERegistrant = web3Handler.contractInstances.contractIceRegistrant;
      const polygonWeb3 = web3Handler.web3Types.matic;
      const receipt = await polygonWeb3.eth.getTransactionReceipt(txHash);
      const tokenId = polygonWeb3.utils.hexToNumberString(receipt.logs[13].topics[3]);

      const bonus = Number(
        await contractICERegistrant.methods
          .getIceBonus(tokenOwner, wearableContractAddress, tokenId)
          .call()
      );
}

export const getItemId = async (address, tokenId) => {
  let contractWearable =
    web3Handler.contractInstances.contractWearables[address.toLowerCase()];

  const decodedData = await contractWearable.methods
    .decodeTokenId(tokenId)
    .call();
  return decodedData;
};

export const getWearableMetadata = async (
  wearableContractAddress,
  tokenId,
  customMetadata,
  isIceNft = true
) => {
  let contractWearable =
    web3Handler.contractInstances.contractWearables[wearableContractAddress];

  const itemId = (await contractWearable.methods.decodeTokenId(tokenId).call())
    .itemId;
  let tokenURI = await contractWearable.methods.tokenURI(tokenId).call();
  tokenURI = tokenURI.split('/');
  tokenURI[2] = 'peer-lb.decentraland.org';
  tokenURI = tokenURI.join('/');
  const metadata = await api(tokenURI);
  const maxMintCount = isIceNft
    ? customMetadata.maxMintCount
    : customMetadata.collectionMap[itemId].maxMintCount;
  metadata.description =
    metadata.description.split('/')[0] + '/' + maxMintCount; // use custom maxMintCount
  metadata.image = isIceNft
    ? customMetadata.urnMap[metadata.id].imageUrlSquare
    : customMetadata.collectionMap[itemId].imageUrl;

  if (isIceNft) {
    const contractICERegistrant =
      web3Handler.contractInstances.contractIceRegistrant;
    const hash = await contractICERegistrant.methods
      .getHash(wearableContractAddress, tokenId)
      .call();
    const tokenOwner = await contractICERegistrant.methods.owners(hash).call();
    const bonus = Number(
      await contractICERegistrant.methods
        .getIceBonus(tokenOwner, wearableContractAddress, tokenId)
        .call()
    );
    metadata.attributes.push({
      trait_type: 'Bonus',
      value: bonus,
    });
    metadata.attributes.push({
      trait_type: 'Rank',
      value: customMetadata.urnMap[metadata.id].rank.toString(),
    });
  }

  metadata.attributes.push({
    trait_type: 'Line',
    value: customMetadata.collectionName,
  });

  return metadata;
};

// check if tokenId is still owned by give address
export const verifyTokenOwnership = async (
  tokenOwnerToCheck,
  tokenId,
  wearableContractAddress
) => {
  try {
    let contractWearable =
      web3Handler.contractInstances.contractWearables[wearableContractAddress];

    const tokenOwner = await contractWearable.methods.ownerOf(tokenId).call();
    return tokenOwnerToCheck === tokenOwner.toLowerCase();
  } catch {
    return false;
  }
};

export const getCheckInStatus = async (address, tokenId, contractAddress) => {
  // returns true if this token has already been checked in with today

  let metaverseCheckInStatus = false;
  let mobileCheckInStatus = false;

  const startOfToday = moment().utc().startOf('day').valueOf();
  const metaverseCheckInData = await redis.get(
    `iceWearableSnapshot:${address}:${startOfToday}`
  );

  if (metaverseCheckInData) {
    for (let wearable of JSON.parse(metaverseCheckInData).wearableData) {
      if (
        wearable.tokenId === tokenId &&
        wearable.contractAddress === contractAddress &&
        wearable.isEquipped &&
        wearable.isActivated &&
        !wearable.isDelegatedToSomeoneElse
      ) {
        metaverseCheckInStatus = true;
        break;
      }
    }
  }

  const mobileCheckInData = await redis.get(
    `mobileIceWearableSnapshot:${address}:${startOfToday}`
  );

  if (mobileCheckInData) {
    for (let wearable of JSON.parse(mobileCheckInData).wearableData) {
      if (
        wearable.tokenId === tokenId &&
        wearable.contractAddress === contractAddress &&
        wearable.isEquipped &&
        wearable.isActivated &&
        !wearable.isDelegatedToSomeoneElse
      ) {
        mobileCheckInStatus = true;
        break;
      }
    }
  }

  return { metaverseCheckInStatus, mobileCheckInStatus };
};

export const fetchProfileData = async (catalystDomain, address) => {
  const profileInfo = await axios
    .get(`${catalystDomain}/lambdas/profiles/${address}`)
    .then((res) => {
      const isJson = res.headers['content-type']?.includes('application/json');
      if (!isJson) {
        logger.log(
          `Failed to get profile info from ${catalystDomain} - Status: ${res.status}`
        );
        return null;
      }
      return res.data;
    })
    .catch((err) => {
      logger.log(
        `Failed to get profile info from ${catalystDomain} - Status: ${err}`
      );
    });
  return profileInfo;
};

export const getWearableInventory = async (
  address: string
): Promise<TokenData[]> => {
  let userInfo;
  try {
    userInfo = await dbMongo.findUser(address);
  } catch (error) {
    logger.log(`Failed to get user data for address: ${address}`);
    userInfo = undefined;
  }
  let wearableData: TokenData[] = [];

  while (!web3Handler.contractsInitialized) {
    logger.log('Waiting for Web3 contracts to be initialized...');
    await sleep(1000);
  }

  let appConfig = dbMongo.getAppConfig();
  let iceWearableCollectionsData = dbMongo.findIceNftInfos({});
  let outgoingDelegations = dbMongo.findIceDelegations({
    tokenOwner: address,
  });
  const catalystDomain = 'https://peer-lb.decentraland.org';
  let profileInfo = fetchProfileData(catalystDomain, address);

  // execute DB queries in parallel
  await Promise.all([
    appConfig,
    iceWearableCollectionsData,
    outgoingDelegations,
    profileInfo,
  ]).then((values) => {
    appConfig = values[0];
    iceWearableCollectionsData = values[1];
    outgoingDelegations = values[2];
    profileInfo = values[3];
  });

  // look up player's owned tokenIds in valid ICE wearable collections
  let collectionPromises = [];
  for (let collection of iceWearableCollectionsData) {
    const collectionPromise = (async () => {
      let contractWearable =
        web3Handler.contractInstances.contractWearables[
          collection.contractAddress
        ];

      let tokenBalance;
      try {
        tokenBalance = await contractWearable.methods.balanceOf(address).call();
      } catch {
        tokenBalance = 0;
      }

      const contractICERegistrant =
        web3Handler.contractInstances.contractIceRegistrant;

      let tokenPromises = [];
      for (let i = 0; i < tokenBalance; i++) {
        const tokenPromise = (async () => {
          // get token ID
          const tokenId = await contractWearable.methods
            .tokenOfOwnerByIndex(address, i)
            .call();

          const hash = await contractICERegistrant.methods
            .getHash(collection.contractAddress, tokenId)
            .call();

          let decodedTokenId = contractWearable.methods
            .decodeTokenId(tokenId)
            .call()
            .then((decodedTokenId) => decodedTokenId);

          let tokenOwner = contractICERegistrant.methods.owners(hash).call();

          let isIceEnabled = contractICERegistrant.methods
            .isIceEnabled(address, collection.contractAddress, tokenId)
            .call();

          const delegateMap = outgoingDelegations.find(
            (el) =>
              el.tokenId === tokenId &&
              el.contractAddress === collection.contractAddress
          );

          let checkInStatus: any = getCheckInStatus(
            delegateMap ? delegateMap.delegateAddress : address,
            tokenId,
            collection.contractAddress
          );
          let metaverseCheckInStatus;
          let mobileCheckInStatus;

          await Promise.all([
            decodedTokenId,
            tokenOwner,
            isIceEnabled,
            checkInStatus,
          ]).then((values) => {
            decodedTokenId = values[0];
            tokenOwner = values[1];
            isIceEnabled = values[2];
            ({ metaverseCheckInStatus, mobileCheckInStatus } = values[3]);
          });

          // get ICE bonus
          const bonus = Number(
            await contractICERegistrant.methods
              .getIceBonus(tokenOwner, collection.contractAddress, tokenId)
              .call()
          );

          const maxMintCount =
            appConfig.maxMintCounts[collection.contractAddress];

          const getDelegateNickname = () => {
            let nickname;
            if (
              userInfo?.delegateNicknames !== undefined &&
              userInfo?.delegateNicknames !== null &&
              delegateMap?.delegateAddress !== undefined
            ) {
              nickname = userInfo.delegateNicknames.hasOwnProperty(
                delegateMap.delegateAddress.toLowerCase()
              )
                ? userInfo.delegateNicknames[
                    delegateMap.delegateAddress.toLowerCase()
                  ]
                : delegateMap.delegateAddress;
            } else {
              nickname = null;
            }
            return nickname;
          };
          const delegationStatus = {
            delegatedTo: delegateMap ? delegateMap.delegateAddress : null,
            delegatedToNickname: getDelegateNickname(),
            isQueuedForUndelegationByOwner: delegateMap
              ? delegateMap.isQueuedForUndelegationByOwner
              : null,
            isQueuedForUndelegationByDelegatee: delegateMap
              ? delegateMap.isQueuedForUndelegationByDelegatee
              : null,
            createdAt: delegateMap ? delegateMap.createdAt : null,
          };
          const dclUrnBase = `urn:decentraland:matic:collections-v2:${collection.contractAddress}`;
          const dclUrn = `${dclUrnBase}:${decodedTokenId.itemId}`;
          const upgradeURN = `${dclUrnBase}:${
            collection.itemIdUpgradeMap[decodedTokenId.itemId]
          }`;
          const tokenData: TokenData = {
            tokenId,
            contractAddress: collection.contractAddress,
            bonus,
            tokenOwner: address,
            checkInStatus: metaverseCheckInStatus, // keeping for now to prevent client errors
            metaverseCheckInStatus,
            mobileCheckInStatus,
            delegationStatus,
            isActivated: isIceEnabled,
            isEquipped: false,
            dclUrn,
            itemId: decodedTokenId.itemId,
            name: collection.urnMap[dclUrn].name,
            description: `DCL Wearable ${decodedTokenId.issuedId}/${maxMintCount}`,
            rank: collection.urnMap[dclUrn].rank,
            category: collection.urnMap[dclUrn].category,
            image: collection.urnMap[dclUrn].imageUrlSquare,
            imageUpgrade: collection.urnMap[upgradeURN]?.imageUrlSquare ?? null,
          };

          wearableData.push(tokenData);
        })();
        tokenPromises.push(tokenPromise);
      }
      await Promise.all(tokenPromises);
    })();
    collectionPromises.push(collectionPromise);
  }
  await Promise.all(collectionPromises);

  if (wearableData.length === 0) {
    // no ICE wearables detected in wallet; see if player has delegated wearables
    // a player can only use one delegator's wearables

    const incomingDelegations = await dbMongo.findIceDelegations({
      delegateAddress: address,
    });

    const contractICERegistrant =
      web3Handler.contractInstances.contractIceRegistrant;

    let delegationPromises = [];
    for (let delegation of incomingDelegations) {
      const newPromise = (async () => {
        const tokenOwner = delegation.tokenOwner;
        const contractAddress = delegation.contractAddress;
        const tokenId = delegation.tokenId;
        const isQueuedForUndelegationByOwner =
          delegation.isQueuedForUndelegationByOwner;
        const isQueuedForUndelegationByDelegatee =
          delegation.isQueuedForUndelegationByDelegatee;
        const createdAt = delegation.createdAt;

        let contractWearable =
          web3Handler.contractInstances.contractWearables[contractAddress];

        // check if wearable is still owned by original owner
        const currentOwner = await contractWearable.methods
          .ownerOf(tokenId)
          .call();

        if (currentOwner.toLowerCase() !== tokenOwner) {
          return;
        }

        // check if wearable is still activated for original owner
        const isIceEnabled = await contractICERegistrant.methods
          .isIceEnabled(tokenOwner, contractAddress, tokenId)
          .call();

        if (!isIceEnabled) {
          return;
        }

        // get ICE bonus
        const bonus = Number(
          await contractICERegistrant.methods
            .getIceBonus(tokenOwner, contractAddress, tokenId)
            .call()
        );

        const decodedTokenId = await contractWearable.methods
          .decodeTokenId(tokenId)
          .call();

        const maxMintCount = appConfig.maxMintCounts[contractAddress];

        const collection = iceWearableCollectionsData.find(
          (el) => el.contractAddress === contractAddress
        );

        const { metaverseCheckInStatus, mobileCheckInStatus } =
          await getCheckInStatus(address, tokenId, contractAddress);
        const delegationStatus = {
          delegatedTo: address,
          isQueuedForUndelegationByOwner: isQueuedForUndelegationByOwner,
          isQueuedForUndelegationByDelegatee:
            isQueuedForUndelegationByDelegatee,
          createdAt: createdAt,
        };
        const dclUrnBase = `urn:decentraland:matic:collections-v2:${collection.contractAddress}`;
        const dclUrn = `${dclUrnBase}:${decodedTokenId.itemId}`;
        const upgradeURN = `${dclUrnBase}:${
          collection.itemIdUpgradeMap[decodedTokenId.itemId]
        }`;
        const tokenData: TokenData = {
          tokenId,
          contractAddress,
          bonus,
          tokenOwner,
          checkInStatus: metaverseCheckInStatus, // keeping for now to prevent client errors
          metaverseCheckInStatus,
          mobileCheckInStatus,
          delegationStatus,
          isActivated: true,
          isEquipped: false,
          dclUrn,
          itemId: decodedTokenId.itemId,
          name: collection.urnMap[dclUrn].name,
          description: `DCL Wearable ${decodedTokenId.issuedId}/${maxMintCount}`,
          rank: collection.urnMap[dclUrn].rank,
          category: collection.urnMap[dclUrn].category,
          image: collection.urnMap[dclUrn].imageUrlSquare,
          imageUpgrade: collection.urnMap[upgradeURN]?.imageUrlSquare ?? null,
        };

        wearableData.push(tokenData);
      })();
      delegationPromises.push(newPromise);
    }
    await Promise.all(delegationPromises);
  }

  // sort array of token ID data by to prioritize active, undelegated wearables with higher bonuses
  wearableData.sort((a, b) =>
    (a.delegationStatus.delegatedTo &&
      a.delegationStatus.delegatedTo !== address) ||
    !a.isActivated
      ? 1
      : -1
  );

  wearableData.sort((a, b) =>
    (a.delegationStatus.delegatedTo &&
      a.delegationStatus.delegatedTo !== address) ||
    !a.isActivated
      ? 0
      : a.bonus < b.bonus
      ? 1
      : -1
  );

  let equippedWearableURNs = profileInfo['avatars'][0]
    ? profileInfo['avatars'][0]['avatar']['wearables']
    : [];

  for (let tokenData of wearableData) {
    // if wearable is equipped, set isEquipped to true in token data and pop from equippedWearableURNs
    // this ensures that each detected URN is only ever attached to at most one tokenId
    // sorted above to ensure that equipped wearables of the same type prioritize higher bonuses
    // (bonuses are invisible in DCL backpack)
    const indexOfUrn = equippedWearableURNs.indexOf(tokenData.dclUrn);
    if (indexOfUrn > -1 || tokenData.delegationStatus.delegatedTo === address) {
      if (indexOfUrn > -1) {
        equippedWearableURNs.splice(indexOfUrn, 1);
      }
      tokenData.isEquipped = true;
      tokenData.shine = Math.floor(Math.random() * 6);
    }
  }

  return wearableData;
};

export const getAccessoryInventory = async (address: string) => {
  const nonIceWearableCollectionsData = await dbMongo.findAccessoryNftInfos();
  let collectionPromises = [];
  let wearableData = [];

  for (let collection of nonIceWearableCollectionsData) {
    const collectionPromise = (async () => {
      let contractWearable =
        web3Handler.contractInstances.contractWearables[
          collection.contractAddress
        ];

      let tokenBalance;
      try {
        tokenBalance = await contractWearable.methods.balanceOf(address).call();
      } catch {
        tokenBalance = 0;
      }
      let tokenPromises = [];
      for (let i = 0; i < tokenBalance; i++) {
        const tokenPromise = (async () => {
          // get token ID
          const tokenId = await contractWearable.methods
            .tokenOfOwnerByIndex(address, i)
            .call();

          let issuedId;
          let decodedTokenId = contractWearable.methods
            .decodeTokenId(tokenId)
            .call()
            .then((decodedTokenId) => decodedTokenId);

          await Promise.all([decodedTokenId]).then((values) => {
            decodedTokenId = values[0]['itemId'];
            issuedId = values[0]['issuedId'];
          });

          const maxMintCount =
            collection.collectionMap[decodedTokenId].maxMintCount;

          const tokenData = {
            tokenId,
            contractAddress: collection.contractAddress,
            tokenOwner: address,
            itemId: decodedTokenId.itemId,
            collectionName: collection.collectionName,
            description: `DCL Wearable ${issuedId}/${maxMintCount}`,
            itemName: collection.collectionMap[decodedTokenId].name,
            category: collection.collectionMap[decodedTokenId].category,
            image: collection.collectionMap[decodedTokenId].imageUrl,
            line: collection.collectionMap[decodedTokenId].line,
          };

          wearableData.push(tokenData);
        })();
        tokenPromises.push(tokenPromise);
      }
      await Promise.all(tokenPromises);
    })();
    collectionPromises.push(collectionPromise);
  }
  await Promise.all(collectionPromises);
  return wearableData;
};

export const getAccessoryMarketplace = async () => {
  const nonIceWearableCollectionsData = await dbMongo.findAccessoryNftInfos();
  let collectionPromises = [];

  for (let collection of nonIceWearableCollectionsData) {
    const collectionPromise = (async () => {
      let contractWearable =
        web3Handler.contractInstances.contractWearables[
          collection.contractAddress
        ];

      let tokenPromises = [];
      for (let i = 0; i < collection.collectionMap.length; i++) {
        const tokenPromise = (async () => {
          const itemData = await contractWearable.methods
            .items(collection.collectionMap[i].itemId)
            .call();

          await Promise.all([itemData]).then((value) => {
            collection.collectionMap[i].numberMinted = parseInt(
              value[0]['totalSupply']
            );
          });
        })();
        tokenPromises.push(tokenPromise);
      }
      await Promise.all(tokenPromises);
    })();
    collectionPromises.push(collectionPromise);
  }
  await Promise.all(collectionPromises);
  return nonIceWearableCollectionsData;
};

export const claimIceRewards = async (address, iceKeeperAddress) => {
  const network = 'matic';
  const userData = await dbMongo.findUser(address);
  if (!userData) {
    throw new Error(`User ${address} does not exist`);
  }

  // check if user is banned
  const isBanned =
    (await dbMongo.findBannedUser(address)) ||
    (await redis.get(`bannedUsers:${address}`));
  if (isBanned) {
    throw new Error(`User ${address} is banned`);
  }

  let icedropHashes = [];
  let treeIndices = [];
  let amounts = [];
  let merkleProofs = [];

  // find trees for user's unclaimed ICE drops
  let unclaimedDrops = await dbMongo.findIceRewardTrees(
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
        { iceKeeperAddress: iceKeeperAddress },
      ],
    },
    address,
    true
  );

  const appConfig = await dbMongo.getAppConfig();

  const polygonWeb3 = web3Handler.web3Types.matic;
  let totalUnclaimedAmount = 0;

  for (let merkleTree of unclaimedDrops) {
    let claimData = merkleTree.claims[0];
    const contractICEKeeper =
      web3Handler.contractInstances.contractsIceKeeper[iceKeeperAddress];
    const hash = await contractICEKeeper.methods
      .getHash(merkleTree.contractId)
      .call();
    const isClaimed = await contractICEKeeper.methods
      .isClaimed(hash, address)
      .call();

    if (isClaimed) {
      // player has already claimed rewards for this drop
      // shouldn't happen, but just in case, this one is skipped
      continue;
    }
    const amount = polygonWeb3.utils.toBN(claimData.amount).toString();

    icedropHashes.push(hash);
    treeIndices.push(claimData.index);
    amounts.push(amount);
    merkleProofs.push(claimData.proof);

    totalUnclaimedAmount += Number(
      polygonWeb3.utils.fromWei(claimData.amount.toString(), 'ether')
    );
  }

  if (icedropHashes.length === 0) {
    return;
  }

  let iceClaimLimit = appConfig.minIceClaimAmount;
  if (totalUnclaimedAmount < iceClaimLimit) {
    throw new Error(
      `[ICE CLAIM] Minimum claim amount not met (Got ${totalUnclaimedAmount}; Expected >= ${iceClaimLimit})`
    );
  }

  // check if there's an iceGameplayReports document associated with the first unclaimed ICE drop
  let gameplayDayToCheck = moment(unclaimedDrops[0].createdAt)
    .utc()
    .startOf('day')
    .subtract(1, 'day')
    .toDate();
  const gameplayReport = await dbMongo.findIceGameplayReports({
    $or: [
      { address: address },
      { 'wearableSnapshot.delegatorAddress': address },
    ],
    gameplayDay: gameplayDayToCheck,
  });

  if (gameplayReport.length === 0) {
    throw new Error(
      `[ICE CLAIM] No gameplay report found for ${address} on ${gameplayDayToCheck}`
    );
  }

  logger.log(
    `[ICE CLAIM] Valid gameplay report for ${gameplayDayToCheck}:`,
    gameplayReport
  );

  logger.log(
    'giveClaimBulk parameters for',
    address,
    ':\n_hash:',
    icedropHashes,
    '\n_index:',
    treeIndices,
    '\n_amount:',
    amounts,
    '\n_merkleProof:',
    merkleProofs
  );

  // if we are using old contract, use single worker
  // if we are using new contract, use multiple workers (same as iceRegistrant)
  let worker;
  if (
    iceKeeperAddress ===
    contracts.ICE_KEEPER_CONTRACT_ADDRESS_1[network].toLowerCase()
  ) {
    worker = {
      walletAddress: keys.WALLET_ADDRESS_ICE_KEEPER_CLAIM[network],
      privateKey: keys.WALLET_PRIVATE_KEY_ICE_KEEPER_CLAIM[network],
    };
  } else {
    worker = await getICEWorker(network);
  }

  const contractICEKeeper =
    web3Handler.contractInstances.contractsIceKeeper[iceKeeperAddress];
  const contractFunction = contractICEKeeper.methods.giveClaimBulk(
    icedropHashes,
    treeIndices,
    amounts,
    Array(icedropHashes.length).fill(address),
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
            to: contractICEKeeper.options.address,
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
              dbMongo.setRewardsAsClaimed(
                address,
                merkleTree.contractId,
                iceKeeperAddress
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
  const isBanned =
    (await dbMongo.findBannedUser(address)) ||
    (await redis.get(`bannedUsers:${address}`));
  if (isBanned) {
    return { totalUnclaimedAmount, totalClaimedAmount };
  }

  // find trees for user's unclaimed ICE drops
  const iceDrops = await dbMongo.findIceRewardTrees(
    {
      'claims.address': address,
    },
    address,
    false
  );

  let claimPromises = [];
  for (let merkleTree of iceDrops) {
    let claimData = merkleTree.claims[0];
    if (claimData.claimed) {
      totalClaimedAmount = totalClaimedAmount.add(
        polygonWeb3.utils.toBN(claimData.amount)
      );
    } else {
      const claimPromise = (async () => {
        const iceKeeperAddress = merkleTree.iceKeeperAddress;
        const contractICEKeeper =
          web3Handler.contractInstances.contractsIceKeeper[iceKeeperAddress];
        const hash = await contractICEKeeper.methods
          .getHash(merkleTree.contractId)
          .call();
        const isClaimed = await contractICEKeeper.methods
          .isClaimed(hash, address)
          .call();

        if (isClaimed) {
          // player has already claimed rewards for this drop
          // shouldn't happen, but just in case, this one is skipped
          totalClaimedAmount = totalClaimedAmount.add(
            polygonWeb3.utils.toBN(claimData.amount)
          );
          dbMongo.setRewardsAsClaimed(
            address,
            merkleTree.contractId,
            iceKeeperAddress
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
    totalUnclaimedAmount: polygonWeb3.utils.fromWei(
      totalUnclaimedAmount.toString(),
      'ether'
    ),
    totalClaimedAmount: polygonWeb3.utils.fromWei(
      totalClaimedAmount.toString(),
      'ether'
    ),
  };
};

export const editDelegationParamCheck = (params) => {
  const editDelegationParams = [
    'guildName',
    'nickname',
    'delegateAddress',
    'address',
  ];
  const paramsList = Object.keys(params);
  if (
    params.hasOwnProperty('guildName') &&
    (paramsList.length != 2 || !params.hasOwnProperty('address'))
  ) {
    return false;
  }

  if (
    paramsList.length == 3 &&
    !(
      params.hasOwnProperty('nickname') &&
      params.hasOwnProperty('delegateAddress') &&
      params.hasOwnProperty('address')
    )
  ) {
    return false;
  }
  if (!paramsList.every((param) => editDelegationParams.includes(param))) {
    return false;
  }
  if (paramsList.length > 3) {
    return false;
  }
  return true;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// Get All ICE Leaderboard Scores For a Season
export const getAllIceLeaderboardScoresSeason = async (season: string) => {
  const iceGuildLeaderboards: IceLeaderBoardScore[] =
    await dbMongo.findAllIceGuildLeaderboardScores(season);
  if (!iceGuildLeaderboards || iceGuildLeaderboards.length == 0) {
    throw new EntryNotFoundError(
      `Ice Guild Leaderboard for season ${season} not found`
    );
  }
  const guildLeaderBoard: RankedIceLeaderBoardScore[] = [];
  let ranking = 1;
  iceGuildLeaderboards.forEach((guild) => {
    const guidlLeaderBoardObj: RankedIceLeaderBoardScore = {
      GuildOwner: guild.GuildOwner,
      Chips: guild.Chips,
      GuildScore: guild.GuildScore,
      TotalActivatedWearables: guild.TotalActivatedWearables,
      Rank: ranking,
      GuildName: guild.GuildName,
      GuildLeague: guild.GuildLeague
    };
    guildLeaderBoard.push(guidlLeaderBoardObj);
    ranking += 1;
  });

  return guildLeaderBoard;
};

const getPercentileMapping = (allScores) => {
  // maps given score to percentile
  // entrance into a percentile requires score to be >= value in mapping
  const distribution = {};
  const percentileCount = 20;
  const stepSize = 100 / percentileCount;

  allScores = allScores.sort((a, b) => a - b).reverse();
  for (let i = 0; i < 100; i += stepSize) {
    let bound =
      allScores[Math.floor((i + 5) * 0.01 * (allScores.length - 1))];
    if (allScores.length < percentileCount) {
      bound = allScores[Math.round((i + 5) * 0.01 * (allScores.length - 1))];
    }
    distribution[i] = bound ?? 0;
  }
  return distribution;
} 

export const getPercentiles = async (day) => {
  const records = await getIceChipsRecords(day);
  const percentileMapping = getPercentileMapping(
    records.map((player) => Math.round(player.score / multiplier))
  );
  return percentileMapping;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// SECONDARY REVENUE DATA FUNCTIONS
export const getTransactionSecondaryRevenue = async (
  transactionId: string
): Promise<transactionDGRevenueResponse> => {
  const subgraphURL =
    'https://api.thegraph.com/subgraphs/name/tabatha-decentralgames/secondary-revenue-ice';
  const query = `
  {
      transferEvents (where : {id: "${transactionId}"}) {
      id
      contractAddress
      timestamp
      }
  }
  `;
  const response = await axios.post(subgraphURL, { query });
  const transferEvent = response.data.data['transferEvents'][0];
  let revenueResponse = await getRevenue(transferEvent.id);
  let revenueObject = {
    contractAddress: transferEvent.contractAddress,
    paymentTokenAddress: revenueResponse.paymentTokenAddress,
    paymentTokenAmount: revenueResponse.secondaryRevenue,
  };
  return revenueObject;
};

const getRevenue = async (
  transactionId: string
): Promise<{
  secondaryRevenue: number;
  paymentTokenAddress: string | null;
}> => {
  const matic_url =
    'https://polygon-mainnet.g.alchemy.com/v2/8BYbVItwh1m1INl0KWdvWEbui6zjQzvt';
  const web3 = new Web3(matic_url);
  //this is the wallet to which all transactions are sent
  const DGWALLET: string =
    '0x0000000000000000000000007a61a0ed364e599ae4748d1ebe74bf236dd27b09';
  //divisor to convert the token to eth
  const CONVERTTOETH: number = 1e18;
  let retryCtr: number = 0;
  let receipts;
  //we have to retry because these calls occasionally fail
  while (retryCtr < 6 && receipts == null) {
    receipts = await web3.eth.getTransactionReceipt(transactionId);
    retryCtr += 1;
  }

  if (!receipts.status) {
    return { secondaryRevenue: 0, paymentTokenAddress: null };
  }

  const logs = receipts['logs'];
  let secondaryRevenue: number = 0;
  const dgTransaction: ethereumLogReceipt[] = logs.filter(
    (log) => log['topics'][2] == DGWALLET
  );
  //check if any tokens were transfered to DG wallet, if not then we will return early
  if (dgTransaction.length == 0) {
    return { secondaryRevenue, paymentTokenAddress: null };
  }
  let paymentTokenAddress: string | null;
  for (const secondaryRev of dgTransaction) {
    paymentTokenAddress = secondaryRev['address']
      ? secondaryRev['address']
      : '';
    //convert the number from the logs from hex to integer
    const additionalRevenue: number = parseInt(secondaryRev['data'], 16);
    secondaryRevenue += additionalRevenue;
  }

  secondaryRevenue = secondaryRevenue / CONVERTTOETH;
  return { secondaryRevenue, paymentTokenAddress };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////
