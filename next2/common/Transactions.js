import BigNumber from 'bignumber.js';
import ABI_TREASURY_CONTRACT from '../components/ABI/ABITreasury';
import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';
import ABI_DG_POINTER_NEW from '../components/ABI/ABIDGPointerNew';
import ABI_TOWN_HALL from '../components/ABI/ABIDGTownHall';
import ABI_DG_STAKING from '../components/ABI/ABIDGStaking';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
import ABI_XDG_TOKEN from '../components/ABI/ABIChildTokenXDG';
import ABI_XDG_TOKEN_MAIN from '../components/ABI/ABIChildTokenXDG';
import ABI_DG_LIGHT_TOKEN from '../components/ABI/ABIDGLightToken';
import ABI_DG_LIGHT_BRIDGE from '../components/ABI/ABIDGLightBridge';
import ABI_DG_TOWN_HALL from '../components/ABI/ABIDGTownHall';
import ABI_BP_TOKEN from '../components/ABI/ABIBalancerPoolToken';
import ABI_DG_KEEPER from '../components/ABI/ABIDGKeeper';
import Global from '../components/Constants';

// set treasury contract instance
async function treasuryContract(web3Default) {
  const treasuryContract = new web3Default.eth.Contract(ABI_TREASURY_CONTRACT, Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS);

  return treasuryContract;
}

// get user's active status (true or false) from smart contract
async function getActiveStatus(userAddress, web3Default) {
  // const parentContract = await treasuryContract(web3Default);

  // try {
  //   const activeStatus = await parentContract.methods
  //     .isEnabled(userAddress)
  //     .call();

  //   return activeStatus;
  // } catch (error) {
  //   console.log('No active status found: ' + error);
  // }
  return true;
}

// set pointer contract instances
async function pointerContract(web3Default) {
  const DGPointerContract = new web3Default.eth.Contract(ABI_DG_POINTER, Global.ADDRESSES.DG_POINTER_CONTRACT_ADDRESS);

  return DGPointerContract;
}

async function pointerContractNew(web3Default) {
  const DGPointerContractNew = new web3Default.eth.Contract(ABI_DG_POINTER_NEW, Global.ADDRESSES.DG_POINTER_CONTRACT_ADDRESS_NEW);

  return DGPointerContractNew;
}

// set DG main contract instance
async function DGTokenContract(web3Default) {
  const chainId = await web3Default.eth.getChainId();
  const DGToken = new web3Default.eth.Contract(
    ABI_DG_TOKEN,
    chainId == 1 ? Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG : chainId == 137 ? Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG : Global.ADDRESSES.ROPSTEN_TOKEN_ADDRESS_DG
  );

  return DGToken;
}

// set xDG Polygon contract instance
async function XDGTokenContract(web3Default) {
  const XDGToken = new web3Default.eth.Contract(ABI_XDG_TOKEN, Global.ADDRESSES.CHILD_TOKEN_XDG_ADDRESS);

  return XDGToken;
}

// set xDG Mainnet contract instance
async function XDGTokenContractChild(web3Default) {
  const XDGTokenChild = new web3Default.eth.Contract(ABI_XDG_TOKEN, '0xc6480Da81151B2277761024599E8Db2Ad4C388C8');

  return XDGTokenChild;
}

// set DGLight main contract instance
async function DGLightTokenContract(web3Default) {
  const chainId = await web3Default.eth.getChainId();
  const DGLightToken = new web3Default.eth.Contract(
    ABI_DG_LIGHT_TOKEN,
    chainId == 1 ? Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG_LIGHT : chainId == 137 ? Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG_LIGHT : Global.ADDRESSES.ROPSTEN_TOKEN_ADDRESS_DG_LIGHT
  );

  return DGLightToken;
}

// set DGLightBridge main contract instance
async function DGLightBridgeContract(web3Default) {
  const chainId = await web3Default.eth.getChainId();
  const DGLightToken = new web3Default.eth.Contract(
    ABI_DG_LIGHT_BRIDGE,
    chainId == 1
      ? Global.ADDRESSES.ROOT_DG_LIGHT_BRIDGE_ADDRESS
      : chainId == 137
      ? Global.ADDRESSES.CHILD_DG_LIGHT_BRIDGE_ADDRESS
      : Global.ADDRESSES.ROPSTEN_DG_LIGHT_BRIDGE_ADDRESS
  );

  return DGLightToken;
}

// set DGLightBridge main contract instance
async function DGTownHallContract(web3Default) {
  const chainId = await web3Default.eth.getChainId();
  const DGTownHall = new web3Default.eth.Contract(ABI_DG_TOWN_HALL, chainId == 1 ? Global.ADDRESSES.ROOT_DG_TOWN_HALL_ADDRESS : Global.ADDRESSES.ROPSTEN_DG_TOWN_HALL_ADDRESS);

  return DGTownHall;
}

// set town hall governance contract instance
async function townHallGovernance(web3Default) {
  const DGTownHall = new web3Default.eth.Contract(ABI_TOWN_HALL, Global.ADDRESSES.ROOT_DG_TOWN_HALL_ADDRESS);

  return DGTownHall;
}

// set DG staking governance contract instance
async function stakingContractGovernance(web3Default) {
  const DGStakingGovernance = new web3Default.eth.Contract(ABI_DG_STAKING, Global.ADDRESSES.DG_STAKING_GOVERNANCE_ADDRESS);

  return DGStakingGovernance;
}

// set staking contract instance DG pool 1
async function stakingContractPool1(web3Default) {
  const DGStakingContract = new web3Default.eth.Contract(ABI_DG_STAKING, Global.ADDRESSES.DG_STAKING_BALANCER_ADDRESS_1);

  return DGStakingContract;
}

// set staking contract instance DG pool 2
async function stakingContractPool2(web3Default) {
  const DGStakingContract = new web3Default.eth.Contract(ABI_DG_STAKING, Global.ADDRESSES.DG_STAKING_BALANCER_ADDRESS_2);

  return DGStakingContract;
}

// set staking contract instance DG uniswap
async function stakingContractUniswap(web3Default) {
  const DGStakingContract = new web3Default.eth.Contract(ABI_DG_STAKING, Global.ADDRESSES.DG_STAKING_UNISWAP_ADDRESS);

  return DGStakingContract;
}

// set staking contract instance BPT pool 1
async function BPTContract1(web3Default) {
  const BPTokenContract = new web3Default.eth.Contract(ABI_BP_TOKEN, Global.ADDRESSES.BP_TOKEN_ADDRESS_1);

  return BPTokenContract;
}

// set staking contract instance BPT pool 2
async function BPTContract2(web3Default) {
  const BPTokenContract = new web3Default.eth.Contract(ABI_BP_TOKEN, Global.ADDRESSES.BP_TOKEN_ADDRESS_2);

  return BPTokenContract;
}

// set staking contract instance uniswap
async function uniswapContract(web3Default) {
  const UNIContract = new web3Default.eth.Contract(ABI_BP_TOKEN, Global.ADDRESSES.UNISWAP_ADDRESS_STAKING);

  return UNIContract;
}

// set DG keeper contract instance
async function keeperContract(web3Default) {
  const DGKeeperContract = new web3Default.eth.Contract(ABI_DG_KEEPER, Global.ADDRESSES.DG_KEEPER_CONTRACT_ADDRESS);

  return DGKeeperContract;
}

// get user or contract token balance from MetaMask
async function balanceOfToken(tokenContract, userOrContractAddress, units) {
  try {
    const amount = await tokenContract.methods.balanceOf(userOrContractAddress).call();

    let amountAdjusted = '0';
    if (units) {
      amountAdjusted = BigNumber(amount).div(Global.CONSTANTS.FACTOR).toFixed(units);
    } else {
      amountAdjusted = BigNumber(amount).div(Global.CONSTANTS.FACTOR).toString();
    }

    return amountAdjusted;
  } catch (error) {
    console.log('Get balance failed', error);
  }
}

// get user's token authorization status from token contract
async function tokenAuthorization(tokenContract, userAddress, spenderAddress) {
  try {
    const tokenAllowance = await tokenContract.methods.allowance(userAddress, spenderAddress).call();

    // console.log('token allowance: ' + tokenAllowance);

    let tokenAuthorizationStatus = false;
    if (tokenAllowance > 0) {
      tokenAuthorizationStatus = true;
    }

    return tokenAuthorizationStatus;
  } catch (error) {
    console.log('Get token authorization status failed', error);
  }
}

// get NFT approval address/status for from token contract
async function NFTApproved(tokenContract, tokenId) {
  // console.log('tokenContract...');
  // console.log(tokenContract);
  // console.log('token ID: ' + tokenId);

  try {
    const tokenAddress = await tokenContract.methods.getApproved(tokenId).call();

    let tokenApproved = false;
    if (tokenAddress.toLowerCase() === Global.ADDRESSES.ICE_REGISTRANT_ADDRESS.toLowerCase()) {
      tokenApproved = true;
    }

    return tokenApproved;
  } catch (error) {
    console.log('Get NFT approval address/status failed', error);
  }
}

// amount user has earned from smart contract
async function balanceEarned(tokenContract, userAddress, units) {
  try {
    const amount = await tokenContract.methods.earned(userAddress).call();

    let amountAdjusted = 0;
    if (units) {
      amountAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(units);
    } else {
      amountAdjusted = (amount / Global.CONSTANTS.FACTOR).toString();
    }

    return amountAdjusted;
  } catch (error) {
    console.log('Get amount earned failed', error);
  }
}

// get total supply of token in contract
async function getTotalSupply(tokenContract) {
  const supply = await tokenContract.methods.totalSupply().call();
  const supplyAdjusted = supply / Global.CONSTANTS.FACTOR;

  return supplyAdjusted;
}

export default {
  XDGTokenContractChild,
  treasuryContract,
  getActiveStatus,
  pointerContract,
  pointerContractNew,
  DGTokenContract,
  XDGTokenContract,
  DGLightTokenContract,
  DGLightBridgeContract,
  DGTownHallContract,
  townHallGovernance,
  stakingContractGovernance,
  stakingContractPool1,
  stakingContractPool2,
  stakingContractUniswap,
  BPTContract1,
  BPTContract2,
  uniswapContract,
  keeperContract,
  balanceOfToken,
  tokenAuthorization,
  NFTApproved,
  balanceEarned,
  getTotalSupply
};
