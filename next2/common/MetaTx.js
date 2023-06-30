import Global from '../components/Constants';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// EIP712 domain params for Biconomy API
const sigUtil = require('eth-sig-util');
let childTokenAddressMANA = '';
let childTokenAddressDAI = '';
let childTokenAddressUSDT = '';
let childTokenAddressATRI = '';
let childTokenAddressWETH = '';
let childTokenAddressICE = '';
let childTokenAddressDG = '';
let childTokenAddressDGLight = '';
let accessoriesContract = '';
let accessoriesContract2 = '';
let accessoriesContract3 = '';
let accessoriesContract4 = '';
let accessoriesContract5 = '';
let accessoriesContract6 = '';
let accessoriesContract7 = '';
let accessoriesContract8 = '';
let accessoriesContract9 = '';
let accessoriesContract10 = '';
let accessoriesContract11 = '';
let accessoriesContract12 = '';
let accessoriesContract13 = '';
let accessoriesContract14 = '';
let accessoriesContract15 = '';

let treasuryAddress = '';
let dgPointerAddress = '';
let dgPointerAddressNew = '';
let iceRegistrantAddress = '';
let arrayDomainType = [];
let arrayDomainData = [];
let metaTransactionType = [];

childTokenAddressMANA = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA;
childTokenAddressDAI = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI;
childTokenAddressUSDT = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT;
childTokenAddressATRI = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI;
childTokenAddressWETH = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH;
childTokenAddressICE = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ICE;
childTokenAddressDG = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG;
childTokenAddressDGLight = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG_LIGHT;
accessoriesContract = Global.ADDRESSES.COLLECTION_V2_ADDRESS;
accessoriesContract2 = Global.ADDRESSES.COLLECTION_PH_ADDRESS;
accessoriesContract3 = Global.ADDRESSES.COLLECTION_LINENS_ADDRESS;
accessoriesContract4 = Global.ADDRESSES.COLLECTION_BOMBER_ADDRESS;
accessoriesContract5 = Global.ADDRESSES.COLLECTION_CRYPTO_DRIP_ADDRESS;

accessoriesContract6 = Global.ADDRESSES.COLLECTION_FOUNDING_FATHERS_ADDRESS;
accessoriesContract7 = Global.ADDRESSES.COLLECTION_JOKER_ADDRESS;
accessoriesContract8 = Global.ADDRESSES.COLLECTION_CHEF_ADDRESS;
accessoriesContract9 = Global.ADDRESSES.COLLECTION_BEACH_ADDRESS;
accessoriesContract10 = Global.ADDRESSES.COLLECTION_AIRLINE_ADDRESS;
accessoriesContract11 = Global.ADDRESSES.COLLECTION_POET_ADDRESS;
accessoriesContract12 = Global.ADDRESSES.COLLECTION_SPARTAN_ADDRESS;
accessoriesContract13 = Global.ADDRESSES.COLLECTION_CYBERPUNK_ADDRESS;
accessoriesContract14 = Global.ADDRESSES.COLLECTION_VIKING_ADDRESS;
accessoriesContract15 = Global.ADDRESSES.COLLECTION_MUTANT_ADDRESS;

treasuryAddress = Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS;
dgPointerAddress = Global.ADDRESSES.DG_POINTER_CONTRACT_ADDRESS;
dgPointerAddressNew = Global.ADDRESSES.DG_POINTER_CONTRACT_ADDRESS_NEW;
iceRegistrantAddress = Global.ADDRESSES.ICE_REGISTRANT_ADDRESS;

const domainTypeToken = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'verifyingContract', type: 'address' },
  { name: 'salt', type: 'bytes32' }
];

const domainTypeTreasury = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
];

arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeTreasury);
arrayDomainType.push(domainTypeTreasury);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeTreasury);
arrayDomainType.push(domainTypeTreasury);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeTreasury);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken); // 16
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken); // 18
arrayDomainType.push(domainTypeToken); // 19
arrayDomainType.push(domainTypeToken); // 20
arrayDomainType.push(domainTypeToken); // 21
arrayDomainType.push(domainTypeToken); // 22
arrayDomainType.push(domainTypeToken); // 23
arrayDomainType.push(domainTypeToken); // 24
arrayDomainType.push(domainTypeToken); // 25
arrayDomainType.push(domainTypeToken); // 26

metaTransactionType.push({ name: 'nonce', type: 'uint256' }, { name: 'from', type: 'address' }, { name: 'functionSignature', type: 'bytes' });

const domainDataTokenMANA = {
  name: '(PoS) Decentraland MANA',
  version: '1',
  verifyingContract: childTokenAddressMANA,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataTreasury = {
  name: 'Treasury',
  version: 'v4.0',
  chainId: Global.CONSTANTS.PARENT_NETWORK_ID,
  verifyingContract: treasuryAddress
};

const domainDataDGPointer = {
  name: 'NEW',
  version: '5.0',
  chainId: Global.CONSTANTS.PARENT_NETWORK_ID,
  verifyingContract: dgPointerAddress
};

const domainDataTokenDAI = {
  name: '(PoS) Dai Stablecoin',
  version: '1',
  verifyingContract: childTokenAddressDAI,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataTokenUSDT = {
  name: '(PoS) Tether USD',
  version: '1',
  verifyingContract: childTokenAddressUSDT,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataTokenATRI = {
  name: 'Atari (PoS)',
  version: '1',
  verifyingContract: childTokenAddressATRI,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataTokenWETH = {
  name: 'Wrapped Ether',
  version: '1',
  verifyingContract: childTokenAddressWETH,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataDGPointerNew = {
  name: 'NEW',
  version: 'V6',
  chainId: Global.CONSTANTS.PARENT_NETWORK_ID,
  verifyingContract: dgPointerAddressNew
};

const domainDataTokenICE = {
  name: 'IceToken',
  version: 'v1.2',
  chainId: Global.CONSTANTS.PARENT_NETWORK_ID,
  verifyingContract: childTokenAddressICE
};

const domainDataTokenDG = {
  name: 'decentral.games (PoS)',
  version: '1',
  verifyingContract: childTokenAddressDG,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataTokenDGLight = {
  name: 'Decentral Games (PoS)',
  version: '1',
  verifyingContract: childTokenAddressDGLight,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataICERegistrant = {
  name: 'IceRegistrant',
  version: 'v1.3',
  chainId: Global.CONSTANTS.PARENT_NETWORK_ID,
  verifyingContract: iceRegistrantAddress
};

const domainDataAccessories2 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract2,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories3 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract3,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories4 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract4,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories5 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract5,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories6 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract6,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories7 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract7,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories8 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract8,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories9 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract9,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories10 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract10,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories11 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract11,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories12 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract12,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories13 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract13,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories14 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract14,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

const domainDataAccessories15 = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract15,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0')
};

arrayDomainData.push(domainDataTokenMANA);
arrayDomainData.push(domainDataTreasury);
arrayDomainData.push(domainDataDGPointer);
arrayDomainData.push(domainDataTokenDAI);
arrayDomainData.push(domainDataTokenUSDT);
arrayDomainData.push(domainDataTokenATRI);
arrayDomainData.push(domainDataTokenWETH);
arrayDomainData.push(domainDataDGPointerNew);
arrayDomainData.push(domainDataTokenICE);
arrayDomainData.push(domainDataTokenDG); // 9
arrayDomainData.push(domainDataAccessories);
arrayDomainData.push(domainDataICERegistrant); // 11
arrayDomainData.push(domainDataAccessories2);
arrayDomainData.push(domainDataAccessories3);
arrayDomainData.push(domainDataAccessories4);
arrayDomainData.push(domainDataTokenDGLight); // 15
arrayDomainData.push(domainDataAccessories5);
arrayDomainData.push(domainDataAccessories6);
arrayDomainData.push(domainDataAccessories7); // 18
arrayDomainData.push(domainDataAccessories8); // 19
arrayDomainData.push(domainDataAccessories9); // 20
arrayDomainData.push(domainDataAccessories10); // 21
arrayDomainData.push(domainDataAccessories11); // 22
arrayDomainData.push(domainDataAccessories12); // 23
arrayDomainData.push(domainDataAccessories13); // 24
arrayDomainData.push(domainDataAccessories14); // 25
arrayDomainData.push(domainDataAccessories15); // 25

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// execute functions on Matic Network from Mainnet using Biconomy PoS meta-transactions API
function executeMetaTransaction(i, functionSignature, contractInstance, userAddress, web3Default) {
  return new Promise(async (resolve, reject) => {
    console.log('Execute Biconomy PoS meta-transaction: ' + i);
    console.log('Function signature: ' + functionSignature);
    console.log('User address: ' + userAddress);
    console.log('Verify contract: ' + arrayDomainData[i].verifyingContract);

    try {
      // console.log('contract instance...');
      // console.log(contractInstance);

      let nonce = await contractInstance.methods.getNonce(userAddress).call();

      let message = {};
      message.nonce = parseInt(nonce);
      message.from = userAddress;
      message.functionSignature = functionSignature;

      const dataToSign = JSON.stringify({
        types: {
          EIP712Domain: arrayDomainType[i],
          MetaTransaction: metaTransactionType
        },
        domain: arrayDomainData[i],
        primaryType: 'MetaTransaction',
        message: message
      });

      console.log('Domain data: ');
      console.log(arrayDomainData[i]);

      await web3Default.eth.currentProvider.send(
        {
          jsonrpc: '2.0',
          id: 999999999999,
          method: 'eth_signTypedData_v4',
          params: [userAddress, dataToSign]
        },

        async (error, response) => {
          let { r, s, v } = getSignatureParameters(response.result, web3Default);

          const recovered = sigUtil.recoverTypedSignature_v4({
            data: JSON.parse(dataToSign),
            sig: response.result
          });

          console.log('User signature: ' + response.result);
          console.log('Recovered address: ' + recovered);
          console.log('r: ' + r);
          console.log('s: ' + s);
          console.log('v: ' + v);

          try {
            const ret = await contractInstance.methods.executeMetaTransaction(userAddress, functionSignature, r, s, v).send({
              from: userAddress
            });

            console.log('Execute Meta-Transactions done');
            console.log(ret);
            resolve(ret.transactionHash);
          } catch (error) {
            console.log('Execute Meta-Transactions failed: ', error);
            reject(false);
          }
        }
      );
    } catch (error) {
      console.log('Execute Meta-Transactions failed: ', error);
      reject(false);
    }
  });
}

function getSignatureParameters(signature, web3Default) {
  if (!web3Default.utils.isHexStrict(signature)) {
    throw new Error('Given value "'.concat(signature, '" is not a valid hex string.'));
  }

  const r = signature.slice(0, 66);
  const s = '0x'.concat(signature.slice(66, 130));
  let v = '0x'.concat(signature.slice(130, 132));
  v = web3Default.utils.hexToNumber(v);

  if (![27, 28].includes(v)) v += 27;
  return {
    r: r,
    s: s,
    v: v
  };
}

export default { executeMetaTransaction };
