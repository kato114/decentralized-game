const dbMongo = require('./dbMongo');

type ContractTypes = {
  ROOT_TOKEN_ADDRESS_DG: string;
  ROOT_TOKEN_ADDRESS_XDG: string;
  CHILD_TOKEN_ADDRESS_DG2: string;
  CHILD_TOKEN_ADDRESS_ETH: string;
  CHILD_TOKEN_ADDRESS_DG: string;
  CHILD_TOKEN_ADDRESS_ICE: string;
  CHILD_TOKEN_ADDRESS_XDG: string;
  DG_POINTER_CONTRACT_ADDRESS: string;
  DG_KEEPER_CONTRACT_ADDRESS: string;
  DG_STAKING_CONTRACT_ADDRESS: {
    ethereum: string;
  };
  ICE_REGISTRANT_CONTRACT_ADDRESS: {
    matic: string;
  };
  ICE_KEEPER_CONTRACT_ADDRESS_1: {
    matic: string;
  };
  ICE_KEEPER_CONTRACT_ADDRESS_2: {
    matic: string;
  };
  XDG_KEEPER_CONTRACT_ADDRESS: string;
};

export let contracts: ContractTypes = {
  ROOT_TOKEN_ADDRESS_DG: '',
  ROOT_TOKEN_ADDRESS_XDG: '',
  CHILD_TOKEN_ADDRESS_DG2: '',
  CHILD_TOKEN_ADDRESS_ETH: '',
  CHILD_TOKEN_ADDRESS_DG: '',
  CHILD_TOKEN_ADDRESS_ICE: '',
  CHILD_TOKEN_ADDRESS_XDG: '',
  DG_POINTER_CONTRACT_ADDRESS: '',
  DG_KEEPER_CONTRACT_ADDRESS: '',
  DG_STAKING_CONTRACT_ADDRESS: {
    ethereum: '',
  },
  ICE_REGISTRANT_CONTRACT_ADDRESS: {
    matic: '',
  },
  ICE_KEEPER_CONTRACT_ADDRESS_1: {
    matic: '',
  },
  ICE_KEEPER_CONTRACT_ADDRESS_2: {
    matic: '',
  },
  XDG_KEEPER_CONTRACT_ADDRESS: '',
};

export const updateContracts = async () => {
  const contractAddresses = await dbMongo.getContractAddresses();

  // Update Root Token Addresses
  contracts.ROOT_TOKEN_ADDRESS_DG = contractAddresses.rootTokenAddress.DG;
  contracts.ROOT_TOKEN_ADDRESS_XDG = contractAddresses.rootTokenAddress.XDG;

  // Update Child Token Addresses
  contracts.CHILD_TOKEN_ADDRESS_DG2 = contractAddresses.childTokenAddress.DG2;
  contracts.CHILD_TOKEN_ADDRESS_ETH = contractAddresses.childTokenAddress.ETH;
  contracts.CHILD_TOKEN_ADDRESS_DG = contractAddresses.childTokenAddress.DG;
  contracts.CHILD_TOKEN_ADDRESS_ICE = contractAddresses.childTokenAddress.ICE;
  contracts.CHILD_TOKEN_ADDRESS_XDG = contractAddresses.childTokenAddress.XDG;

  // Update DG Contract Addresses
  contracts.DG_POINTER_CONTRACT_ADDRESS =
    contractAddresses.dgContractAddress.pointer;
  contracts.DG_KEEPER_CONTRACT_ADDRESS =
    contractAddresses.dgContractAddress.keeper;
  contracts.DG_STAKING_CONTRACT_ADDRESS =
    contractAddresses.dgContractAddress.staking;

  // Update ICE Contract Addresses
  contracts.ICE_REGISTRANT_CONTRACT_ADDRESS =
    contractAddresses.iceContractAddress.registrant;
  contracts.ICE_KEEPER_CONTRACT_ADDRESS_1 =
    contractAddresses.iceContractAddress.keeper;
  contracts.ICE_KEEPER_CONTRACT_ADDRESS_2 =
    contractAddresses.iceContractAddress.keeper2;

  // Update xDG Contract Addresses
  contracts.XDG_KEEPER_CONTRACT_ADDRESS =
    contractAddresses.xdgContractAddress.keeper;
};
