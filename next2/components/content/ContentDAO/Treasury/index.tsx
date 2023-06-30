import React, { FC, useEffect, useContext, useState } from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import cn from 'classnames';
import { isEmpty, reverse } from 'lodash';
import { GlobalContext } from '@/store';
import Spinner from 'components/lottieAnimation/animations/SpinnerUpdated';
import styles from './Treasury.module.scss';
import Fetch from '@/common/Fetch';
import { formatBigNumber, formatPrice } from '@/common/utils';
import TreasuryGraph from './graph';

const Treasury: FC = () => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [treasuryTotal, setTreasuryTotal] = useState<number>(0);
  const [statsUSDX, setStatsUSDX] = useState<number[]>([]);
  const [statsUSDY, setStatsUSDY] = useState<number[]>([]);
  const [gameplayTreasury, setGameplayTreasury] = useState<number>(0);
  const [gameplayHotPercent, setGameplayHotPercent] = useState<number>(0);
  const [weeklyChange, setWeeklyChange] = useState<number>(0);
  const [gameplayAll, setGameplayAll] = useState<number>(0);
  const [gameplayAllPercent, setGameplayAllPercent] = useState<number>(0);
  const [dgTreasury, setDgTreasury] = useState<number>(0);
  const [landTreasury, setLandTreasury] = useState<number>(0);
  const [landTreasuryPercent, setLandTreasuryPercent] = useState<number>(0);
  const [nftTreasury, setNftTreasury] = useState<number>(0);
  const [nftTreasuryPercent, setNftTreasuryPercent] = useState<number>(0);
  const [liquidityTreasury, setLiquidityTreasury] = useState<number>(0);
  const [lpPercent, setLpPercent] = useState<number>(0);
  const [maticTreasury, setMaticTreasury] = useState<number>(0);
  const [maticTreasuryPercent, setMaticTreasuryPercent] = useState<number>(0);
  const [wearableSales, setWearableSales] = useState<number>(0);
  const [wearableSalesPercent, setWearableSalesPercent] = useState<number>(0);
  const [unvestedDG, setUnvestedDG] = useState<number>(0);
  const [dgTreasuryPercent, setDgTreasuryPercent] = useState<number>(0);
  const [period, setPeriod] = useState<string>('breakdownLastMonth');
  const [treasuryDetails, setTreasuryDetails] = useState<any>({});
  const [treasuryMonth, setTreasuryMonth] = useState<any>({});

  useEffect(() => {
    const fetchTreasuryDetails = async () => {
      const [_treasuryDetails, _treasuryMonthly] = await Promise.all([Fetch.TREASURY_DETAILS(), Fetch.TREASURY_STATS_NUMBERS('all')]);
      setTreasuryDetails(_treasuryDetails);
      setTreasuryMonth(_treasuryMonthly);
      console.log('treasuryDetails: ', _treasuryDetails, _treasuryMonthly);
    };

    fetchTreasuryDetails();
  }, []);

  // use for both the graph and the stats
  // that'll just be week? to match discord bot 'in the past week'
  // that data will include the percent changes for both daily/weekly in the changes object
  // call .weekly to match labels
  useEffect(() => {
    try {
      if (Object.keys(treasuryMonth).length !== 0 && !isEmpty(treasuryDetails)) {
        const xAxis = [];
        const yAxis = [];

        treasuryMonth.totalBalanceUSD.graph.slice(100).map((treasury, index) => {
          const month = moment(treasury.primary).format('MMM');
          if (!xAxis.includes(month)) {
            console.log(month, treasury);
            xAxis.push(moment(treasury.primary).format('MMM'));
            yAxis.push(treasury.secondary / 1000000);
          }
        });

        const totalUSD = treasuryMonth.totalBalanceUSD.graph;
        const api_usd = Number(totalUSD.slice(-1)[0].secondary);
        setTreasuryTotal(Number(formatPrice(api_usd, 0)));

        setStatsUSDX(xAxis);
        setStatsUSDY(yAxis);

        // const temp_start = totalUSD[0].secondary;
        // const temp_end = api_usd;
        const change = treasuryMonth.totalBalanceUSD.changes.weekly.amount;
        setWeeklyChange(change);

        const gameplayTotal = treasuryMonth.allTimeGameplayUSD;
        const game_temp = Number(gameplayTotal.graph.slice(-1)[0].secondary);
        setGameplayAll(Number(formatPrice(game_temp, 0)));

        const gameplayTotal_temp = gameplayTotal.changes.weekly.percent.toFixed(2);
        setGameplayAllPercent(Number(gameplayTotal_temp));

        const gameplay = treasuryDetails.erc20BalanceUSD;
        setGameplayTreasury(Number(formatPrice(gameplay, 0)));

        const gameplay_temp2 = gameplay.changes.weekly.percent.toFixed(2);
        setGameplayHotPercent(Number(gameplay_temp2));

        const land = treasuryMonth?.totalLandUSD;
        setLandTreasury(Number(formatPrice(land.graph.slice(-1)[0].secondary, 0)));

        const land_temp = land?.changes?.weekly?.percent.toFixed(2);
        setLandTreasuryPercent(Number(land_temp));

        const wearables = state?.treasuryNumbers?.totalWearablesUSD;
        setNftTreasury(Number(formatPrice(wearables.graph.slice(-1)[0].secondary, 0)));

        const wearables_temp = wearables?.changes?.weekly?.percent.toFixed(2);
        setNftTreasuryPercent(Number(wearables_temp));

        const ice_wearables = treasuryMonth.totalIceWearablesUSD;
        setWearableSales(Number(formatPrice(ice_wearables.graph.slice(-1)[0].secondary, 0)));

        const ice_percent = ice_wearables.changes.weekly.percent.toFixed(2);
        setWearableSalesPercent(Number(ice_percent));

        setDgTreasury(Number(treasuryMonth.totalDgWalletUSD.graph[treasuryMonth.totalDgWalletUSD.graph.length - 1].secondary));
        setUnvestedDG(Number(formatPrice(dgTreasury, 0)));

        const dg_temp = treasuryMonth.totalDgWalletUSD.changes.weekly.percent.toFixed(2);
        setDgTreasuryPercent(Number(dg_temp));

        const liq = treasuryMonth.totalLiquidityProvided;
        const old_liq = Number(liq.graph.slice(-1)[0].secondary);
        setLiquidityTreasury(Number(formatPrice(old_liq, 0)));

        const liq_temp = liq.changes.weekly.percent.toFixed(2);
        setLpPercent(Number(liq_temp));

        const maticBal = treasuryMonth.totalMaticUSD;
        setMaticTreasury(Number(formatPrice(maticBal.graph.slice(-1)[0].secondary, 0)));

        const matic_temp = maticBal?.changes?.weekly?.percent.toFixed(2);
        setMaticTreasuryPercent(Number(matic_temp));
      }
    } catch (error) {
      console.log('Treasury Numbers Error: ' + error);
    }
  }, [treasuryMonth, dgTreasury, state.userStatus]);

  // helper functions
  function getWeeklyChange() {
    return (
      <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {weeklyChange && weeklyChange > 0 && treasuryTotal ? (
          <span
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '-6px',
              paddingBottom: '9px'
            }}
          >
            <p className={styles.earned_percent_pos}>
              +$
              {weeklyChange.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </p>
            <p className={styles.earned_text}>this week</p>
          </span>
        ) : treasuryTotal ? (
          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <p className={styles.earned_percent_neg}>
              -$
              {(weeklyChange * -1).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </p>
            <p className={styles.earned_text}>this week</p>
          </span>
        ) : null}
      </span>
    );
  }

  function getLoader() {
    return (
      <Table.Cell textAlign="right" style={{ position: 'relative', top: '-5px' }}>
        <Spinner height={33} width={33} />
      </Table.Cell>
    );
  }

  const weekly = {
    labels: statsUSDX,
    datasets: [
      {
        fill: true,
        lineTension: 0.5,
        backgroundColor: '#000000',
        borderColor: '#67DD6C',
        borderWidth: 6,
        data: statsUSDY
      }
    ]
  };

  return (
    <div className={styles.treasury_wrapper}>
      <h1 className={styles.welcome_text}>Welcome to the DG Treasury</h1>
      <div className={styles.treasury_overview}>
        <h1 className={cn(styles.treasury_overview_header, 'mb-3')}>Treasury Overview</h1>
        <div className="row">
          <div className="col-md-4">
            <h6 className={styles.treasury_overview_subfooter}>Treasury Balance</h6>
            <div className="d-flex align-items-center">
              <div className={styles.item_value}>{!isEmpty(treasuryDetails) ? <>{formatBigNumber(treasuryDetails.treasuryBalance)}</> : <Spinner width={33} height={33} />}</div>
            </div>
          </div>
          <div className="col-md-4">
            <h6 className={styles.treasury_overview_subfooter}>All Time Revenue</h6>
            <div className="d-flex align-items-center">
              <div className={styles.item_value}>
                {!isEmpty(treasuryDetails) ? (
                  <>
                    {formatBigNumber(
                      treasuryDetails.breakdownAllTime?.activationRevenue +
                        treasuryDetails.breakdownAllTime?.iceUpgradesRevenue +
                        treasuryDetails.breakdownAllTime?.mintRevenue +
                        treasuryDetails.breakdownAllTime?.secondaryRevenue
                    )}
                  </>
                ) : (
                  <Spinner width={33} height={33} />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <h6 className={styles.treasury_overview_subfooter}>Revenue Last Month</h6>
            <div>
              <div className={styles.item_value}>
                {!isEmpty(treasuryDetails) ? (
                  <>
                    {' '}
                    {formatBigNumber(
                      treasuryDetails.breakdownLastMonth.activationRevenue +
                        treasuryDetails.breakdownLastMonth.iceUpgradesRevenue +
                        treasuryDetails.breakdownLastMonth.mintRevenue +
                        treasuryDetails.breakdownLastMonth.secondaryRevenue
                    )}
                  </>
                ) : (
                  <Spinner width={33} height={33} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TreasuryGraph />
      <div className={styles.treasury_breakdown}>
        <h2>Revenue Breakdown</h2>
        <div className={styles.treasury_switch}>
          <div
            className={period === 'breakdownLastMonth' ? styles.active : null}
            onClick={() => {
              setPeriod('breakdownLastMonth');
            }}
          >
            Last Month
          </div>
          <div
            className={period === 'breakdownAllTime' ? styles.active : null}
            onClick={() => {
              setPeriod('breakdownAllTime');
            }}
          >
            All Time
          </div>
        </div>
        <div className={styles.treasury_breakdown_container}>
          <div className={styles.treasury_overview}>
            <h6 className={styles.treasury_overview_subfooter}>Mints Revenue</h6>
            <div className="d-flex align-items-center">
              <div className={styles.item_value}>
                {!isEmpty(treasuryDetails) ? <>${formatBigNumber(treasuryDetails[period].mintRevenue)}</> : <Spinner width={33} height={33} />}
              </div>
            </div>
          </div>
          <div className={styles.treasury_overview}>
            <h6 className={styles.treasury_overview_subfooter}>Secondary Revenue</h6>
            <div className="d-flex align-items-center">
              <div className={styles.item_value}>
                {!isEmpty(treasuryDetails) ? <>${formatBigNumber(treasuryDetails[period].secondaryRevenue)}</> : <Spinner width={33} height={33} />}
              </div>
            </div>
          </div>
          <div className={styles.treasury_overview}>
            <h6 className={styles.treasury_overview_subfooter}>Upgrade Revenue</h6>
            <div className="d-flex align-items-center">
              <div className={styles.item_value}>
                {!isEmpty(treasuryDetails) ? <>${formatBigNumber(treasuryDetails[period].iceUpgradesRevenue)}</> : <Spinner width={33} height={33} />}
              </div>
            </div>
          </div>
          <div className={styles.treasury_overview}>
            <h6 className={styles.treasury_overview_subfooter}>Activation Revenue</h6>
            <div className="d-flex align-items-center">
              <div className={styles.item_value}>
                {!isEmpty(treasuryDetails) ? <>${formatBigNumber(treasuryDetails[period].activationRevenue)}</> : <Spinner width={33} height={33} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treasury;
