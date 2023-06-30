import { Transaction } from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import { web3Handler } from '../web3';
import { logger } from '../logger';
const dbMongo = require('../../db/dbMongo');
import keys from '../../config/keys';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
export const prepareTransaction = async (affiliateID, playerAddress) => {
  // get affiliate wallet address base on the affiliate's ID
  const affiliateAddress = await dbMongo.findAddress(affiliateID);
  logger.log(
    'Assign player: ' +
      playerAddress +
      ' to affiliate address: ' +
      affiliateAddress
  );

  const network = 'matic';
  const web3 = web3Handler.web3Types[network];
  const contractDgPointer = web3Handler.contractInstances.contractDgPointer;
  const contractFunction = contractDgPointer.methods.assignAffiliate(
    affiliateAddress,
    playerAddress
  );

  try {
    const functionABI = contractFunction.encodeABI();
    const gasAmount = 8000000;
    const gasMultiple = Math.min(Math.floor(gasAmount * 1.5), 8000000);
    logger.log('gas amount * 1.5: ' + gasMultiple);

    web3.eth
      .getTransactionCount(keys.WALLET_ADDRESS[network])
      .then((_nonce) => {
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
            gasPrice: web3.utils.toHex(50000000000),
            gasLimit: web3.utils.toHex(gasMultiple),
            to: contractDgPointer.options.address,
            data: functionABI,
            nonce: web3.utils.toHex(_nonce),
          },
          { common: customCommon }
        );

        const privateKey = Buffer.from(keys.WALLET_PRIVATE_KEY[network], 'hex');
        tx.sign(privateKey);
        const serializedTx = tx.serialize();

        /////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////
        const sendTransaction = async () => {
          try {
            await web3.eth
              .sendSignedTransaction('0x' + serializedTx.toString('hex'))
              .once('transactionHash', (hash) => {
                logger.log('TxHash: ' + hash);
              });

            logger.log('Assign player transaction complete');

            // add player to affilate's playersList array
            const userData = await dbMongo.findUser(affiliateAddress);

            if (userData) {
              userData.playersList.push(playerAddress);
              dbMongo.updateUser(affiliateAddress, userData);
            }
          } catch (e) {
            logger.log(
              'Transaction failed: player already asigned to affiliate'
            );
          }
        };

        sendTransaction();
      });
  } catch (e) {
    logger.log('Assign player transaction failed: ' + e);
  }
};
