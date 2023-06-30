import cn from 'classnames';
import BigNumber from 'bignumber.js';
import { useEffect, useContext, useState, React } from 'react';
import Web3 from 'web3';
import Link from 'next/link';
import { Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/SpinnerUpdated';
import { GlobalContext } from '../../../../store';
import Transactions from '../../../../common/Transactions';
import Global from '../../../Constants';
import Constants from '../../../Constants';
import styles from './Governance.module.scss';
import { formatPrice, roundDownDecimals, getAmounts } from '@/common/utils';

const Governance = () => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [stakeType, setStakeType] = useState('Stake');
  const [amountInput, setAmountInput] = useState(0);
  const [DGLightTokenContract, setDGLightTokenContract] = useState({});
  const [DGTownHallContract, setDGTownHallContract] = useState({});
  const [apy, setAPY] = useState('');
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [ratio, setRatio] = useState(0);
  const { BALANCE_ROOT_DG_LIGHT: dgAmount, BALANCE_CHILD_DG_LIGHT: maticDGAmount, BALANCE_CHILD_TOKEN_XDG: maticXDGAmount } = state.DGBalances;

  const { BALANCE_USER_GOVERNANCE: xDGAmount } = state.stakingBalances;

  const { xDG: xDGPrice } = state.DGPrices;

  const { userAddress, userStatus, refreshBalances } = state;

  const handleAmountInputChange = e => {
    let enteredValue = Number(e.target.value);

    if (e.key !== 'Backspace') {
      if (e.target.value.includes('.')) {
        if (e.target.value.split('.')[1].length >= 3) {
          enteredValue = roundDownDecimals(e.target.value);
        }
      }
    }

    setAmountInput(enteredValue);
  };

  useEffect(() => {
    if (userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const [_DGLightTokenContract, _DGTownHallContract] = await Promise.all([Transactions.DGLightTokenContract(web3), Transactions.DGTownHallContract(web3)]);

        const [balance, _ratio] = [await _DGTownHallContract.methods.innerSupply().call(), await _DGTownHallContract.methods.outsidAmount(1000000).call()];

        setDGLightTokenContract(_DGLightTokenContract);
        setDGTownHallContract(_DGTownHallContract);

        setAPY(
          BigNumber(Global.CONSTANTS.APR_NUMBER * 100)
            .div(BigNumber(balance))
            .multipliedBy(Constants.CONSTANTS.FACTOR)
            .toString()
        );
        setRatio(_ratio / 1000000);
      }

      fetchData();
    }
  }, [userStatus]);

  const staking = async () => {
    const { amountAdjusted, amountToString } = getAmounts(amountInput);

    try {
      const amountAllowance = await DGLightTokenContract.methods.allowance(userAddress, DGTownHallContract._address).call();

      if (Number(amountAllowance) < amountAdjusted) {
        await DGLightTokenContract.methods
          .approve(DGTownHallContract._address, Global.CONSTANTS.MAX_AMOUNT)
          .send({ from: userAddress })
          .on('transactionHash', function (hash) {
            setApproving(true);
          })
          .on('confirmation', function (confirmation, receipt) {
            setApproving(false);
          });

        dispatch({
          type: 'show_toastMessage',
          data: 'DG approved successfully!'
        });
      }

      await DGTownHallContract.methods
        .stepInside(amountToString)
        .send({ from: userAddress })
        .on('transactionHash', function (hash) {
          setLoading(true);
        })
        .on('confirmation', function (confirmation, receipt) {
          setLoading(false);
        });

      // update global state staking balances
      const refresh = !refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });
      dispatch({
        type: 'show_toastMessage',
        data: 'DG staked successfully!'
      });
    } catch (error) {
      setLoading(false);
      setApproving(false);

      dispatch({
        type: 'show_toastMessage',
        data: 'Failed to stake DG!'
      });
    }
  };

  const unstaking = async () => {
    const { amountAdjusted, amountToString } = getAmounts(amountInput);

    try {
      const amountAllowance = await DGLightTokenContract.methods.allowance(userAddress, DGTownHallContract._address).call();

      if (Number(amountAllowance) < amountAdjusted) {
        await DGLightTokenContract.methods
          .approve(DGTownHallContract._address, Global.CONSTANTS.MAX_AMOUNT)
          .send({ from: userAddress })
          .on('transactionHash', function (hash) {
            setApproving(true);
          })
          .on('confirmation', function (confirmation, receipt) {
            console.log('approve() transaction completed');
            setApproving(false);
          });

        dispatch({
          type: 'show_toastMessage',
          data: 'DG approved successfully!'
        });
      }

      await DGTownHallContract.methods
        .stepOutside(amountToString)
        .send({ from: userAddress })
        .on('transactionHash', function (hash) {
          setLoading(true);
        })
        .on('confirmation', function (confirmation, receipt) {
          setLoading(false);
        });

      // update global state staking balances
      const refresh = !refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh
      });
      dispatch({
        type: 'show_toastMessage',
        data: 'DG unstaked successfully!'
      });
    } catch (error) {
      setLoading(false);
      setApproving(false);

      dispatch({
        type: 'show_toastMessage',
        data: 'Failed to unstake DG!'
      });
    }
  };

  return (
    <div className={styles.governanace_main_wrapper}>
      <h1 className={styles.welcome_text}>Welcome to DG Governance</h1>
      <p className={styles.welcome_content}>
        When you stake DG in governance, you receive xDG, a token which represents your share in the governance. In return, you can make proposals and vote on the future of the
        DAO, earn autocompounding APR, and get access to ICE Wearable mints.
      </p>
      <div className={styles.governance_stake_overview}>
        <h1 className={cn(styles.staking_header, 'mb-3')}>Governance Staking Overview</h1>
        <div className="row">
          <div className="col-md-4">
            <h6 className={cn('mb-1', styles.staking_subfooter)}>Your Total xDG</h6>
            <div className="d-flex mb-1 align-items-center">
              <div className={styles.item_value}>
                {xDGAmount !== undefined && maticXDGAmount !== undefined ? (
                  <>
                    {formatPrice(parseFloat(xDGAmount) + parseFloat(maticXDGAmount))}
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1637260602/grayLogo_ojx2hi.png" alt="xDG" />
                  </>
                ) : (
                  <Spinner width={33} height={33} />
                )}
              </div>
            </div>
            <p className={styles.staking_subfooter}>
              {xDGAmount !== undefined && maticXDGAmount !== undefined && xDGPrice ? (
                `$${formatPrice((parseFloat(xDGAmount) + parseFloat(maticXDGAmount)) * xDGPrice, 2)}`
              ) : (
                <Spinner width={20} height={20} />
              )}
            </p>
          </div>
          <div className="col-md-4">
            <h6 className={cn('mb-1', styles.staking_subfooter)}>Your Equivalent DG Value</h6>
            <div className="d-flex mb-1 align-items-center">
              <div className={styles.item_value}>
                {xDGAmount !== undefined && maticXDGAmount !== undefined && ratio ? (
                  <>
                    {formatPrice((parseFloat(xDGAmount) + parseFloat(maticXDGAmount)) * ratio)}
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                  </>
                ) : (
                  <Spinner width={33} height={33} />
                )}
              </div>
            </div>
            <p className={styles.staking_subfooter}>
              {xDGAmount !== undefined && maticXDGAmount !== undefined && ratio && xDGPrice ? (
                `$${formatPrice((parseFloat(xDGAmount) + parseFloat(maticXDGAmount)) * ratio * xDGPrice, 2)}`
              ) : (
                <Spinner width={20} height={20} />
              )}
            </p>
          </div>
          <div className="col-md-4">
            <h6 className={cn('mb-1', styles.staking_subfooter)}>Staking APR</h6>
            <div className="mb-1">
              <div className={styles.item_value}>{apy ? `${apy}%` : <Spinner width={33} height={33} />}</div>
            </div>
            <p className={styles.staking_subfooter}>1 xDG = {formatPrice(ratio, 3)} DG</p>
          </div>
        </div>
      </div>
      <div className={styles.staking_module}>
        <div className={styles.staking_switch}>
          <div
            className={stakeType === 'Stake' ? styles.active : null}
            onClick={() => {
              setStakeType('Stake');
            }}
          >
            Stake
          </div>
          <div
            className={stakeType === 'Unstake' ? styles.active : null}
            onClick={() => {
              setStakeType('Unstake');
            }}
          >
            Unstake
          </div>
        </div>
        <div className={styles.divider}></div>

        <div className={styles.staking_inner}>
          <div className={styles.contract_div}>
            <h5 className={cn(styles.staking_header, 'mb-1')}>
              <i class="ethereum icon"></i>&nbsp;{stakeType} on ETH Mainnet
            </h5>
            <p className={cn('mb-3', styles.staking_subfooter)}>
              {stakeType} your {stakeType === 'Stake' ? '' : 'x'}DG in governance and receive {stakeType === 'Unstake' ? '' : 'x'}DG
            </p>
            <div className={styles.content}>
              <img
                className={styles.dg}
                src={
                  stakeType === 'Stake'
                    ? 'https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png'
                    : 'https://res.cloudinary.com/dnzambf4m/image/upload/v1637260602/grayLogo_ojx2hi.png'
                }
                alt="DG"
              />
              <input
                type="number"
                className={styles.dg_input}
                value={amountInput.toString()}
                onChange={handleAmountInputChange}
                style={{
                  minWidth: `${5 + (amountInput.toString().length + 1) * 12}px`,
                  maxWidth: `${5 + (amountInput.toString().length + 1) * 12}px`
                }}
              />

              <Button
                className={styles.max_button}
                onClick={() => {
                  if (stakeType === 'Stake') {
                    setAmountInput(roundDownDecimals(dgAmount));
                  } else {
                    setAmountInput(roundDownDecimals(xDGAmount));
                  }
                }}
              >
                MAX
              </Button>
            </div>

            <div className={styles.description}>
              <h4 className={Number(amountInput) <= Number(stakeType === 'Stake' ? dgAmount : xDGAmount) ? styles.success : styles.error}>
                {roundDownDecimals(stakeType === 'Stake' ? dgAmount : xDGAmount, 3)}
                &nbsp;{stakeType === 'Stake' ? '' : 'x'}DG Available to&nbsp;
                {stakeType}
              </h4>
              <p>On ETH Mainnet</p>
            </div>
          </div>

          <div className={styles.button_wrapper}>
            <Button
              className={styles.button_blue}
              onClick={() => {
                if (stakeType === 'Stake') {
                  staking();
                } else {
                  unstaking();
                }
                setAmountInput('');
              }}
              disabled={approving || loading || Number(amountInput) <= 0 || Number(amountInput) > (stakeType === 'Stake' ? Number(dgAmount) : xDGAmount) ? true : false}
            >
              {approving || loading ? <Spinner width={33} height={33} /> : null}
              &nbsp;
              {approving || loading ? '' : `${stakeType} ${amountInput > 0 ? amountInput : ''} ${stakeType === 'Unstake' ? 'x' : ''}DG`}
            </Button>
            <span>
              You Will Receive {stakeType === 'Stake' ? formatPrice(Number(amountInput) / ratio, 3) : formatPrice(Number(amountInput) * ratio, 3)}{' '}
              {stakeType === 'Stake' ? 'x' : ''}DG
            </span>
          </div>
        </div>
        <div className={styles.staking_inner}>
          <div className={styles.contract_div}>
            <h5 className={cn(styles.staking_header, 'mb-1')}>
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634606779/polygon_rsgtjk.png" alt="polygon" />
              &nbsp; {stakeType} on Polygon
            </h5>
            <p className={cn('mb-3', styles.staking_subfooter)}>
              Swap {stakeType === 'Stake' ? '' : 'x'}DG for {stakeType === 'Stake' ? 'x' : ''}DG directly on Uniswap
            </p>
            <img className={styles.uniswap_ellipse} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636428353/uniswap_tkdx8e.png" alt="uniswap" />

            <div className={styles.description}>
              <h4 className={styles.gray}>
                {formatPrice(stakeType === 'Stake' ? maticDGAmount : maticXDGAmount, 3)}
                &nbsp;{stakeType === 'Stake' ? '' : 'x'}DG Available to&nbsp;
                {stakeType}
              </h4>
              <p>On Polygon</p>
            </div>
          </div>

          <div className={styles.button_wrapper} style={{ marginBottom: '15px' }}>
            <Button
              className={styles.button}
              href={
                stakeType === 'Stake'
                  ? 'https://app.uniswap.org/#/swap?inputCurrency=0xef938b6da8576a896f6E0321ef80996F4890f9c4&outputCurrency=0xc6480Da81151B2277761024599E8Db2Ad4C388C8&chain=polygon'
                  : 'https://app.uniswap.org/#/swap?inputCurrency=0xc6480Da81151B2277761024599E8Db2Ad4C388C8&outputCurrency=0xef938b6da8576a896f6E0321ef80996F4890f9c4&chain=polygon'
              }
              target="_blank"
            >
              Swap for {stakeType === 'Stake' ? 'x' : ''}DG on Uniswap&nbsp;
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636424323/TransBgArrow_ukntvi.png" alt="" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Governance;
