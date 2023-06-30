import React, { FC, useEffect, useContext, useState } from 'react';
import { Table } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { GlobalContext } from '@/store';
import TooltipTwo from 'components/tooltips/TreasuryTooltipGameplay';
import TooltipThree from 'components/tooltips/TreasuryTooltipLP/index';
import Spinner from 'components/lottieAnimation/animations/SpinnerUpdated';
import styles from './Treasury.module.scss';
import Fetch from '@/common/Fetch';
import { formatPrice } from '@/common/utils';

const TreasuryGraph = () => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [treasuryTotal, setTreasuryTotal] = useState<string>(null);
  const [statsUSDX, setStatsUSDX] = useState<number[]>([]);
  const [statsUSDY, setStatsUSDY] = useState<number[]>([]);
  const [gameplayTreasury, setGameplayTreasury] = useState<string>(null);
  const [weeklyChange, setWeeklyChange] = useState<number>(0);
  const [dgTreasury, setDgTreasury] = useState<number>(0);
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
        setTreasuryTotal(formatPrice(api_usd, 0));

        setStatsUSDX(xAxis);
        setStatsUSDY(yAxis);

        // const temp_start = totalUSD[0].secondary;
        // const temp_end = api_usd;
        const change = treasuryMonth.totalBalanceUSD.changes.weekly.amount;
        setWeeklyChange(change);

        const gameplayTotal = treasuryMonth.allTimeGameplayUSD;

        const gameplay = treasuryDetails.erc20BalanceUSD;
        setGameplayTreasury(formatPrice(gameplay, 0));
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
    <div className={styles.treasury_container}>
      <div className={styles.treasury_header}>
        <p className={styles.treasury_title}>Treasury Monthly</p>
        <div className="d-flex flex-column align-end">
          <p className={styles.treasury_total}>${treasuryTotal}</p>
          {getWeeklyChange()}
        </div>
      </div>

      <div className="d-flex">
        <span className={styles.treasury_graph}>
          <Line
            height={150}
            data={weekly}
            options={{
              maintainAspectRatio: false,
              title: { display: false },
              legend: { display: false },
              scales: {
                xAxes: [
                  {
                    display: true,
                    ticks: {
                      autoSkip: true,
                      autoSkipPadding: 70,
                      maxRotation: 0,
                      minRotation: 0
                    }
                  }
                ],
                yAxes: [
                  {
                    display: true,
                    ticks: {
                      autoSkip: true,
                      autoSkipPadding: 22,
                      maxRotation: 0,
                      minRotation: 0
                    }
                  }
                ]
              },
              elements: {
                point: { radius: 0 }
              }
            }}
          />
        </span>
      </div>

      <div className={styles.stats_container}>
        <div className={styles.stat}>
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <p className={styles.stat_header}>ERC-20 Tokens</p>
            <TooltipTwo treasuryDetails={treasuryDetails} />
          </span>
          <div className="d-flex justify-content-center">
            <div>{gameplayTreasury !== null ? <p className={styles.stat_amount}>${gameplayTreasury}</p> : getLoader()}</div>
          </div>
        </div>

        <div className={styles.stat}>
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <p className={styles.stat_header}>Liquidity Provided</p>
            <TooltipThree treasuryDetails={treasuryDetails} />
          </span>
          <div className="d-flex justify-content-center">
            <div>
              {treasuryDetails.totalLiquidityProvided !== undefined ? <p className={styles.stat_amount}>${formatPrice(treasuryDetails.totalLiquidityProvided, 2)}</p> : getLoader()}
            </div>
          </div>
        </div>

        <div className={styles.stat}>
          <p className={styles.stat_header}>Polygon Node</p>
          <div className="d-flex justify-content-center">
            <div>{treasuryDetails.totalMaticUSD !== undefined ? <p className={styles.stat_amount}>${formatPrice(treasuryDetails.totalMaticUSD, 2)}</p> : getLoader()}</div>
          </div>
        </div>

        <div className={styles.stat}>
          <p className={styles.stat_header}>Decentraland Land</p>
          <div className="d-flex justify-content-center">
            <div>{treasuryDetails.decentralandLandUSD ? <p className={styles.stat_amount}>${formatPrice(treasuryDetails.decentralandLandUSD, 2)}</p> : getLoader()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryGraph;
