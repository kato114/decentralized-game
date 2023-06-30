import { BigNumber, utils } from 'ethers';
import BalanceTree from './balance-tree';

const { isAddress, getAddress } = utils;

// This blob is completely sufficient for recreating the entire merkle tree.
// Anyone can verify that all air drops are included in the tree,
// and the tree has no additional distributions.

interface ClaimInfo {
  address: string;
  index: number;
  amount: string;
  proof: string[];
  claimed: boolean;
}

interface AirdropInfo {
  merkleRoot: string;
  tokenTotal: string;
  claims: ClaimInfo[];
}

export function parseBalanceMap(balanceMap: {
  [account: string]: string;
}): AirdropInfo {
  const mapped = Object.keys(balanceMap).reduce<{
    [address: string]: BigNumber;
  }>((memo, account) => {
    if (!isAddress(account)) {
      throw new Error(`Found invalid address: ${account}`);
    }
    const parsed = getAddress(account);
    if (memo[parsed]) throw new Error(`Duplicate address: ${parsed}`);
    const parsedNum = BigNumber.from(balanceMap[account]);
    if (parsedNum.lte(0))
      throw new Error(`Invalid amount for account: ${account}`);
    memo[parsed] = parsedNum;
    return memo;
  }, {});

  const treeElements = Object.keys(mapped).map((account) => ({
    account,
    amount: mapped[account],
  }));

  const tree = new BalanceTree(treeElements);

  const claims = treeElements.reduce<ClaimInfo[]>(
    (memo, { account }, index) => {
      memo.push({
        address: account.toLowerCase(),
        index,
        amount: mapped[account].toHexString(),
        proof: tree.getProof(index, account, mapped[account]),
        claimed: false,
      });
      return memo;
    },
    []
  );

  const tokenTotal: BigNumber = Object.keys(mapped).reduce<BigNumber>(
    (memo, key) => memo.add(mapped[key]),
    BigNumber.from(0)
  );

  return {
    merkleRoot: tree.getHexRoot(),
    tokenTotal: tokenTotal.toHexString(),
    claims,
  };
}
