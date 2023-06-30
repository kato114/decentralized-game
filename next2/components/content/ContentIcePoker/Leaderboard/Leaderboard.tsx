import React, { FC, ReactElement, useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Table } from 'semantic-ui-react';
import FoxAnimation from 'components/lottieAnimation/animations/Fox';
import StarAnimation from 'components/lottieAnimation/animations/Star';
import NoResult from 'components/lottieAnimation/animations/NoResult';
import styles from './Leaderboard.module.scss';

interface PersonalRecord {
  myScore: number;
  myRank: string;
}

export interface LeaderboardType {
  className?: string;
}

const Leaderboard: FC<LeaderboardType> = ({ className = '' }: LeaderboardType): ReactElement => {
  // get leaderboard data from the Context API store
  const [state] = useContext(GlobalContext);
  const [gameRecords, setGameRecords] = useState([]);
  const initialPersonalRecordState: PersonalRecord = {
    myScore: 0,
    myRank: 'N/A'
  };
  const [personalRecord, setPersonalRecord] = useState(initialPersonalRecordState);

  // define local variables
  const [time, setTime] = useState('Weekly');

  useEffect(() => {
    if (state.gameRecords && Object.keys(state.gameRecords).length !== 0) {
      if (time === 'Weekly') {
        setGameRecords(state.gameRecords.weekly.poker.chips);
        setPersonalRecord(state.gameRecords.weekly.poker.personalChipsData);
      } else if (time === 'Monthly') {
        setGameRecords(state.gameRecords.monthly.poker.chips);
        setPersonalRecord(state.gameRecords.monthly.poker.personalChipsData);
      } else {
        setGameRecords(state.gameRecords.all.poker.chips);
        setPersonalRecord(state.gameRecords.all.poker.personalChipsData);
      }
    }
  }, [state.gameRecords, time]);

  return (
    <div className={`ice-leaderboard component ${className} ${styles.main_wrapper}`}>
      {!state.userStatus ? (
        <FoxAnimation />
      ) : (
        <>
          <div className={styles.title}>
            <h1>ICE Poker Leaderboard</h1>
          </div>

          <div className={styles.time_div}>
            <div
              className={time === 'Weekly' ? styles.active : null}
              onClick={() => {
                setTime('Weekly');
              }}
            >
              Weekly
            </div>
            <div
              className={time === 'Monthly' ? styles.active : null}
              onClick={() => {
                setTime('Monthly');
              }}
            >
              Monthly
            </div>
            <div
              className={time === 'All Time' ? styles.active : null}
              onClick={() => {
                setTime('All Time');
              }}
            >
              All Time
            </div>
          </div>

          <div className={styles.user_div}>
            <div className={styles.rank}>
              <abbr>{personalRecord.myRank}</abbr>
            </div>
            <div className={styles.user_info}>
              <img src={`https://events.decentraland.org/api/profile/${state.userAddress}/face.png`} alt="avatar" />
              <abbr>{state.userInfo.name === null || state.userInfo.name === '' ? 'Unnamed' : state.userInfo.name}</abbr>
            </div>
            <div className={styles.winnings}>
              <abbr>{(Number(personalRecord.myScore) / 1000000000000000000).toFixed(0).toLocaleString()}</abbr>
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635212177/FREE_Coin_c08hyk.png" alt="ice" />
            </div>
          </div>

          <div className={styles.table}>
            <Table fixed unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Player</Table.HeaderCell>
                  <Table.HeaderCell>Total CHIP Winnings</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>

            {gameRecords && gameRecords.length > 0 ? (
              <Table fixed unstackable>
                <Table.Body>
                  {gameRecords.map((row, i) => {
                    let style = '';

                    {
                      i % 2 === 0 ? (style = 'rgba(255, 255, 255, 0.08)') : (style = 'black');
                    }

                    return (
                      <Table.Row key={i} style={{ background: style }}>
                        <Table.Cell className={styles.user_info}>
                          {row.address === state.userAddress ? <StarAnimation /> : null}
                          <abbr>{i + 1}</abbr>

                          {i < 0 && (
                            <div className={styles.gold_info}>
                              <svg width="49" height="53" viewBox="0 0 49 53" fill="#3b3b3b" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="24.5" cy="21.5" r="20.5" stroke="url(#paint0_linear_12_1534)" strokeWidth="2" />
                                <circle cx="24.5" cy="21.5" r="18.5" stroke="url(#paint1_linear_12_1534)" strokeWidth="2" />
                                <path d="M38.349 45.1584L43.5005 42.8721L46.0002 43L37.4248 46.7593L38.349 45.1584Z" fill="url(#paint2_linear_12_1534)" />
                                <path d="M37.4247 39.113L46.1091 43.0638L48.5002 43L36.5004 37.5121L37.4247 39.113Z" fill="url(#paint3_linear_12_1534)" />
                                <path d="M37.4247 39.113L46.1091 43.0638L48.5002 43L36.5004 37.5121L37.4247 39.113Z" fill="#FBCF4F" fillOpacity="0.2" />
                                <path d="M38.3483 40.7135L43.4998 42.9998L46.1084 43.0634L37.424 39.1126L38.3483 40.7135Z" fill="url(#paint4_linear_12_1534)" />
                                <path d="M36.924 46.8991L45.4997 43L48.4997 43L35.9998 48.5L36.924 46.8991Z" fill="url(#paint5_linear_12_1534)" />
                                <path d="M11.0753 39.113L2.39086 43.0638L-0.000244124 43L11.9996 37.5121L11.0753 39.113Z" fill="url(#paint6_linear_12_1534)" />
                                <path d="M10.1517 40.7135L5.00024 42.9998L2.39157 43.0634L11.076 39.1126L10.1517 40.7135Z" fill="url(#paint7_linear_12_1534)" />
                                <path d="M11.576 46.8991L3.00028 43L0.000277996 43L12.5002 48.5L11.576 46.8991Z" fill="url(#paint8_linear_12_1534)" />
                                <path d="M10.151 45.1584L4.99946 42.8721L2.49976 43L11.0752 46.7593L10.151 45.1584Z" fill="url(#paint9_linear_12_1534)" />
                                <path d="M10.151 45.1584L4.99946 42.8721L2.49976 43L11.0752 46.7593L10.151 45.1584Z" fill="#FCD456" fillOpacity="0.5" />
                                <path d="M28.9755 34.8485L23.43 42.6122H21.9512L28.9755 33V34.8485Z" fill="url(#paint10_linear_12_1534)" />
                                <path d="M28.9755 34.8485L23.43 42.6122H21.9512L28.9755 33V34.8485Z" fill="url(#paint11_linear_12_1534)" />
                                <path d="M34.0243 34.8485L28.4788 42.6122H27L34.0243 33V34.8485Z" fill="url(#paint12_linear_12_1534)" />
                                <path d="M34.0243 34.8485L28.4788 42.6122H27L34.0243 33V34.8485Z" fill="url(#paint13_linear_12_1534)" />
                                <path d="M28.9752 36.6971L24.9085 42.6124H23.4297L28.9752 34.8486V36.6971Z" fill="url(#paint14_linear_12_1534)" />
                                <path d="M28.9752 36.6971L24.9085 42.6124H23.4297L28.9752 34.8486V36.6971Z" fill="url(#paint15_linear_12_1534)" />
                                <path d="M34.024 36.6971L29.9573 42.6124H28.4785L34.024 34.8486V36.6971Z" fill="url(#paint16_linear_12_1534)" />
                                <path d="M34.024 36.6971L29.9573 42.6124H28.4785L34.024 34.8486V36.6971Z" fill="url(#paint17_linear_12_1534)" />
                                <path d="M19.0907 34.8485L13.5452 42.6122H12.0664L19.0907 33V34.8485Z" fill="url(#paint18_linear_12_1534)" />
                                <path d="M19.0907 34.8485L13.5452 42.6122H12.0664L19.0907 33V34.8485Z" fill="url(#paint19_linear_12_1534)" />
                                <path d="M19.0904 36.6971L15.0237 42.6124H13.5449L19.0904 34.8486V36.6971Z" fill="url(#paint20_linear_12_1534)" />
                                <path d="M19.0904 36.6971L15.0237 42.6124H13.5449L19.0904 34.8486V36.6971Z" fill="url(#paint21_linear_12_1534)" />
                                <path d="M24.9091 34.8485L19.3636 42.6122H17.8848L24.9091 33V34.8485Z" fill="url(#paint22_linear_12_1534)" />
                                <path d="M15.0243 34.8485L9.47881 42.6122H8L15.0243 33V34.8485Z" fill="url(#paint23_linear_12_1534)" />
                                <path d="M15.024 36.6971L10.9573 42.6124H9.47852L15.024 34.8486V36.6971Z" fill="url(#paint24_linear_12_1534)" />
                                <path d="M24.9093 34.8485L30.4548 42.6122H31.9336L24.9093 33V34.8485Z" fill="url(#paint25_linear_12_1534)" />
                                <path d="M15.0245 34.8485L20.57 42.6122H22.0488L15.0245 33V34.8485Z" fill="url(#paint26_linear_12_1534)" />
                                <path d="M15.0248 36.6971L19.0915 42.6124H20.5703L15.0248 34.8486V36.6971Z" fill="url(#paint27_linear_12_1534)" />
                                <path d="M24.9091 50.3761L19.3636 42.6124H17.8848L24.9091 52.2246V50.3761Z" fill="url(#paint28_linear_12_1534)" />
                                <path d="M15.0243 50.3761L9.47881 42.6124H8L15.0243 52.2246V50.3761Z" fill="url(#paint29_linear_12_1534)" />
                                <path d="M15.024 48.5275L10.9573 42.6122H9.47852L15.024 50.376V48.5275Z" fill="url(#paint30_linear_12_1534)" />
                                <path d="M24.9093 50.3761L30.4548 42.6124H31.9336L24.9093 52.2246V50.3761Z" fill="url(#paint31_linear_12_1534)" />
                                <path d="M24.9093 50.3761L30.4548 42.6124H31.9336L24.9093 52.2246V50.3761Z" fill="url(#paint32_linear_12_1534)" />
                                <path d="M15.0245 50.3761L20.57 42.6124H22.0488L15.0245 52.2246V50.3761Z" fill="url(#paint33_linear_12_1534)" />
                                <path d="M15.0245 50.3761L20.57 42.6124H22.0488L15.0245 52.2246V50.3761Z" fill="url(#paint34_linear_12_1534)" />
                                <path d="M15.0248 48.5275L19.0915 42.6122H20.5703L15.0248 50.376V48.5275Z" fill="url(#paint35_linear_12_1534)" />
                                <path d="M15.0248 48.5275L19.0915 42.6122H20.5703L15.0248 50.376V48.5275Z" fill="url(#paint36_linear_12_1534)" />
                                <path d="M28.9757 34.8485L34.5212 42.6122H36L28.9757 33V34.8485Z" fill="url(#paint37_linear_12_1534)" />
                                <path d="M34.0245 34.8485L39.57 42.6122H41.0488L34.0245 33V34.8485Z" fill="url(#paint38_linear_12_1534)" />
                                <path d="M19.0909 34.8485L24.6364 42.6122H26.1152L19.0909 33V34.8485Z" fill="url(#paint39_linear_12_1534)" />
                                <path d="M28.976 36.6971L33.0427 42.6124H34.5215L28.976 34.8486V36.6971Z" fill="url(#paint40_linear_12_1534)" />
                                <path d="M34.0248 36.6971L38.0915 42.6124H39.5703L34.0248 34.8486V36.6971Z" fill="url(#paint41_linear_12_1534)" />
                                <path d="M19.0912 36.6971L23.1579 42.6124H24.6367L19.0912 34.8486V36.6971Z" fill="url(#paint42_linear_12_1534)" />
                                <path d="M28.9755 50.3761L23.43 42.6124H21.9512L28.9755 52.2246V50.3761Z" fill="url(#paint43_linear_12_1534)" />
                                <path d="M34.0243 50.3761L28.4788 42.6124H27L34.0243 52.2246V50.3761Z" fill="url(#paint44_linear_12_1534)" />
                                <path d="M28.9752 48.5275L24.9085 42.6122H23.4297L28.9752 50.376V48.5275Z" fill="url(#paint45_linear_12_1534)" />
                                <path d="M34.024 48.5275L29.9573 42.6122H28.4785L34.024 50.376V48.5275Z" fill="url(#paint46_linear_12_1534)" />
                                <path d="M19.0907 50.3761L13.5452 42.6124H12.0664L19.0907 52.2246V50.3761Z" fill="url(#paint47_linear_12_1534)" />
                                <path d="M19.0904 48.5275L15.0237 42.6122H13.5449L19.0904 50.376V48.5275Z" fill="url(#paint48_linear_12_1534)" />
                                <path d="M28.9757 50.3761L34.5212 42.6124H36L28.9757 52.2246V50.3761Z" fill="url(#paint49_linear_12_1534)" />
                                <path d="M34.0245 50.3761L39.57 42.6124H41.0488L34.0245 52.2246V50.3761Z" fill="url(#paint50_linear_12_1534)" />
                                <path d="M28.976 48.5275L33.0427 42.6122H34.5215L28.976 50.376V48.5275Z" fill="url(#paint51_linear_12_1534)" />
                                <path d="M34.0248 48.5275L38.0915 42.6122H39.5703L34.0248 50.376V48.5275Z" fill="url(#paint52_linear_12_1534)" />
                                <path d="M19.0912 48.5275L23.1579 42.6122H24.6367L19.0912 50.376V48.5275Z" fill="url(#paint53_linear_12_1534)" />
                                <circle cx="24" cy="43" r="5.5" fill="#3B3B3B" stroke="url(#paint54_linear_12_1534)" />
                                <circle cx="24" cy="43" r="6.5" stroke="url(#paint55_linear_12_1534)" />
                                <defs>
                                  <linearGradient id="paint0_linear_12_1534" x1="6.5" y1="6" x2="41.5" y2="35" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FDD85B" />
                                    <stop offset="0.34375" stopColor="#FAC746" />
                                    <stop offset="1" stopColor="#9D6A12" />
                                  </linearGradient>
                                  <linearGradient id="paint1_linear_12_1534" x1="10.5" y1="6.5" x2="40.5" y2="35" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#90600C" />
                                    <stop offset="1" stopColor="#FBCD4E" />
                                  </linearGradient>
                                  <linearGradient id="paint2_linear_12_1534" x1="37.661" y1="46.0581" x2="45.0052" y2="42.8951" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint3_linear_12_1534" x1="36.8033" y1="38.405" x2="46.1528" y2="42.3987" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#805004" />
                                    <stop offset="1" stopColor="#A8651A" />
                                  </linearGradient>
                                  <linearGradient id="paint4_linear_12_1534" x1="37.7183" y1="39.9689" x2="46.6711" y2="43.6647" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#C28948" />
                                    <stop offset="1" stopColor="#7A4E0A" />
                                  </linearGradient>
                                  <linearGradient id="paint5_linear_12_1534" x1="36.8028" y1="47.4672" x2="46.1523" y2="43.4734" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#805004" />
                                    <stop offset="1" stopColor="#A8651A" />
                                  </linearGradient>
                                  <linearGradient id="paint6_linear_12_1534" x1="11.6569" y1="38.5081" x2="1.2445" y2="42.7965" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint7_linear_12_1534" x1="10.7817" y1="39.9689" x2="1.82894" y2="43.6647" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7F5203" />
                                    <stop offset="1" stopColor="#B47D1E" />
                                  </linearGradient>
                                  <linearGradient id="paint8_linear_12_1534" x1="12.1548" y1="47.4766" x2="1.43712" y2="42.8779" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#5F3A00" />
                                    <stop offset="1" stopColor="#AC7735" />
                                  </linearGradient>
                                  <linearGradient id="paint9_linear_12_1534" x1="10.7936" y1="45.9248" x2="2.05388" y2="42.1731" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#885A16" />
                                    <stop offset="0.526042" stopColor="#9C6A27" />
                                    <stop offset="1" stopColor="#7A4E0A" />
                                  </linearGradient>
                                  <linearGradient id="paint10_linear_12_1534" x1="29.1604" y1="33.9243" x2="23.0603" y2="42.0577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint11_linear_12_1534" x1="28.0389" y1="34.3732" x2="24.6287" y2="39.0251" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#855412" stopOpacity="0" />
                                    <stop offset="0.489583" stopColor="#533713" stopOpacity="0.5" />
                                    <stop offset="1" stopColor="#7C521A" stopOpacity="0" />
                                  </linearGradient>
                                  <linearGradient id="paint12_linear_12_1534" x1="34.2092" y1="33.9243" x2="28.1091" y2="42.0577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint13_linear_12_1534" x1="33.0878" y1="34.3732" x2="29.6775" y2="39.0251" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#855412" stopOpacity="0" />
                                    <stop offset="0.489583" stopColor="#533713" stopOpacity="0.5" />
                                    <stop offset="1" stopColor="#7C521A" stopOpacity="0" />
                                  </linearGradient>
                                  <linearGradient id="paint14_linear_12_1534" x1="29.1485" y1="35.7373" x2="23.2431" y2="43.4144" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7F5203" />
                                    <stop offset="1" stopColor="#B47D1E" />
                                  </linearGradient>
                                  <linearGradient id="paint15_linear_12_1534" x1="28.2358" y1="35.9577" x2="25.0933" y2="40.0245" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#855412" stopOpacity="0" />
                                    <stop offset="0.489583" stopOpacity="0.47" />
                                    <stop offset="1" stopColor="#7C521A" stopOpacity="0" />
                                  </linearGradient>
                                  <linearGradient id="paint16_linear_12_1534" x1="34.1973" y1="35.7373" x2="28.2919" y2="43.4144" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7F5203" />
                                    <stop offset="1" stopColor="#B47D1E" />
                                  </linearGradient>
                                  <linearGradient id="paint17_linear_12_1534" x1="33.2846" y1="35.9577" x2="30.1422" y2="40.0245" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#855412" stopOpacity="0" />
                                    <stop offset="0.489583" stopOpacity="0.47" />
                                    <stop offset="1" stopColor="#7C521A" stopOpacity="0" />
                                  </linearGradient>
                                  <linearGradient id="paint18_linear_12_1534" x1="19.2756" y1="33.9243" x2="13.1755" y2="42.0577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint19_linear_12_1534" x1="18.1542" y1="34.3732" x2="14.7439" y2="39.0251" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#855412" stopOpacity="0" />
                                    <stop offset="0.489583" stopColor="#533713" stopOpacity="0.5" />
                                    <stop offset="1" stopColor="#7C521A" stopOpacity="0" />
                                  </linearGradient>
                                  <linearGradient id="paint20_linear_12_1534" x1="19.2637" y1="35.7373" x2="13.3583" y2="43.4144" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7F5203" />
                                    <stop offset="1" stopColor="#B47D1E" />
                                  </linearGradient>
                                  <linearGradient id="paint21_linear_12_1534" x1="18.351" y1="35.9577" x2="15.2086" y2="40.0245" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#855412" stopOpacity="0" />
                                    <stop offset="0.489583" stopOpacity="0.47" />
                                    <stop offset="1" stopColor="#7C521A" stopOpacity="0" />
                                  </linearGradient>
                                  <linearGradient id="paint22_linear_12_1534" x1="25.094" y1="33.9243" x2="18.9939" y2="42.0577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint23_linear_12_1534" x1="15.2092" y1="33.9243" x2="9.10911" y2="42.0577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint24_linear_12_1534" x1="15.1973" y1="35.7373" x2="9.2919" y2="43.4144" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7F5203" />
                                    <stop offset="1" stopColor="#B47D1E" />
                                  </linearGradient>
                                  <linearGradient id="paint25_linear_12_1534" x1="24.7244" y1="33.9243" x2="30.8245" y2="42.0577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#805004" />
                                    <stop offset="1" stopColor="#A8651A" />
                                  </linearGradient>
                                  <linearGradient id="paint26_linear_12_1534" x1="14.8396" y1="33.9243" x2="20.9397" y2="42.0577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#805004" />
                                    <stop offset="1" stopColor="#A8651A" />
                                  </linearGradient>
                                  <linearGradient id="paint27_linear_12_1534" x1="14.8515" y1="35.7373" x2="20.7569" y2="43.4144" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#C28948" />
                                    <stop offset="1" stopColor="#7A4E0A" />
                                  </linearGradient>
                                  <linearGradient id="paint28_linear_12_1534" x1="25.094" y1="51.3004" x2="18.9939" y2="43.1669" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#5F3A00" />
                                    <stop offset="1" stopColor="#AC7735" />
                                  </linearGradient>
                                  <linearGradient id="paint29_linear_12_1534" x1="15.2092" y1="51.3004" x2="9.10911" y2="43.1669" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#5F3A00" />
                                    <stop offset="1" stopColor="#AC7735" />
                                  </linearGradient>
                                  <linearGradient id="paint30_linear_12_1534" x1="15.1973" y1="49.4873" x2="9.2919" y2="41.8102" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#885A16" />
                                    <stop offset="0.526042" stopColor="#9C6A27" />
                                    <stop offset="1" stopColor="#7A4E0A" />
                                  </linearGradient>
                                  <linearGradient id="paint31_linear_12_1534" x1="24.6897" y1="51.1243" x2="31.9568" y2="41.4591" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7F5203" />
                                    <stop offset="1" stopColor="#B47D1E" />
                                  </linearGradient>
                                  <linearGradient id="paint32_linear_12_1534" x1="25.8458" y1="50.8514" x2="29.7132" y2="45.7311" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#855412" stopOpacity="0" />
                                    <stop offset="0.489583" stopOpacity="0.47" />
                                    <stop offset="1" stopColor="#7C521A" stopOpacity="0" />
                                  </linearGradient>
                                  <linearGradient id="paint33_linear_12_1534" x1="14.805" y1="51.1243" x2="22.0721" y2="41.4591" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7F5203" />
                                    <stop offset="1" stopColor="#B47D1E" />
                                  </linearGradient>
                                  <linearGradient id="paint34_linear_12_1534" x1="15.9611" y1="50.8514" x2="19.8285" y2="45.7311" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#855412" stopOpacity="0" />
                                    <stop offset="0.489583" stopOpacity="0.47" />
                                    <stop offset="1" stopColor="#7C521A" stopOpacity="0" />
                                  </linearGradient>
                                  <linearGradient id="paint35_linear_12_1534" x1="14.8789" y1="49.6295" x2="19.8362" y2="43.1687" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint36_linear_12_1534" x1="15.7642" y1="49.2669" x2="18.537" y2="45.5699" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#855412" stopOpacity="0" />
                                    <stop offset="0.489583" stopColor="#533713" stopOpacity="0.5" />
                                    <stop offset="1" stopColor="#7C521A" stopOpacity="0" />
                                  </linearGradient>
                                  <linearGradient id="paint37_linear_12_1534" x1="28.7908" y1="33.9243" x2="34.8909" y2="42.0577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#805004" />
                                    <stop offset="1" stopColor="#A8651A" />
                                  </linearGradient>
                                  <linearGradient id="paint38_linear_12_1534" x1="33.8396" y1="33.9243" x2="39.9397" y2="42.0577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#805004" />
                                    <stop offset="1" stopColor="#A8651A" />
                                  </linearGradient>
                                  <linearGradient id="paint39_linear_12_1534" x1="18.906" y1="33.9243" x2="25.0061" y2="42.0577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#805004" />
                                    <stop offset="1" stopColor="#A8651A" />
                                  </linearGradient>
                                  <linearGradient id="paint40_linear_12_1534" x1="28.8027" y1="35.7373" x2="34.7081" y2="43.4144" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#C28948" />
                                    <stop offset="1" stopColor="#7A4E0A" />
                                  </linearGradient>
                                  <linearGradient id="paint41_linear_12_1534" x1="33.8515" y1="35.7373" x2="39.7569" y2="43.4144" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#C28948" />
                                    <stop offset="1" stopColor="#7A4E0A" />
                                  </linearGradient>
                                  <linearGradient id="paint42_linear_12_1534" x1="18.9179" y1="35.7373" x2="24.8233" y2="43.4144" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#C28948" />
                                    <stop offset="1" stopColor="#7A4E0A" />
                                  </linearGradient>
                                  <linearGradient id="paint43_linear_12_1534" x1="29.1604" y1="51.3004" x2="23.0603" y2="43.1669" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#5F3A00" />
                                    <stop offset="1" stopColor="#AC7735" />
                                  </linearGradient>
                                  <linearGradient id="paint44_linear_12_1534" x1="34.2092" y1="51.3004" x2="28.1091" y2="43.1669" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#5F3A00" />
                                    <stop offset="1" stopColor="#AC7735" />
                                  </linearGradient>
                                  <linearGradient id="paint45_linear_12_1534" x1="29.1485" y1="49.4873" x2="23.2431" y2="41.8102" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#885A16" />
                                    <stop offset="0.526042" stopColor="#9C6A27" />
                                    <stop offset="1" stopColor="#7A4E0A" />
                                  </linearGradient>
                                  <linearGradient id="paint46_linear_12_1534" x1="34.1973" y1="49.4873" x2="28.2919" y2="41.8102" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#885A16" />
                                    <stop offset="0.526042" stopColor="#9C6A27" />
                                    <stop offset="1" stopColor="#7A4E0A" />
                                  </linearGradient>
                                  <linearGradient id="paint47_linear_12_1534" x1="19.2756" y1="51.3004" x2="13.1755" y2="43.1669" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#5F3A00" />
                                    <stop offset="1" stopColor="#AC7735" />
                                  </linearGradient>
                                  <linearGradient id="paint48_linear_12_1534" x1="19.2637" y1="49.4873" x2="13.3583" y2="41.8102" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#885A16" />
                                    <stop offset="0.526042" stopColor="#9C6A27" />
                                    <stop offset="1" stopColor="#7A4E0A" />
                                  </linearGradient>
                                  <linearGradient id="paint49_linear_12_1534" x1="28.7562" y1="51.1243" x2="36.0232" y2="41.4591" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7F5203" />
                                    <stop offset="1" stopColor="#B47D1E" />
                                  </linearGradient>
                                  <linearGradient id="paint50_linear_12_1534" x1="33.805" y1="51.1243" x2="41.0721" y2="41.4591" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7F5203" />
                                    <stop offset="1" stopColor="#B47D1E" />
                                  </linearGradient>
                                  <linearGradient id="paint51_linear_12_1534" x1="28.83" y1="49.6295" x2="33.7874" y2="43.1687" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint52_linear_12_1534" x1="33.8789" y1="49.6295" x2="38.8362" y2="43.1687" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint53_linear_12_1534" x1="18.9453" y1="49.6295" x2="23.9026" y2="43.1687" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FEE166" />
                                    <stop offset="1" stopColor="#F9C543" />
                                  </linearGradient>
                                  <linearGradient id="paint54_linear_12_1534" x1="19.6923" y1="38.3846" x2="28.9231" y2="47.1538" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#90600C" />
                                    <stop offset="0.770833" stopColor="#BF9029" />
                                    <stop offset="1" stopColor="#FBCD4E" />
                                  </linearGradient>
                                  <linearGradient id="paint55_linear_12_1534" x1="18.4615" y1="38.2308" x2="29.2308" y2="47.1538" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#E1BE4F" />
                                    <stop offset="0.168595" stopColor="#FAC746" />
                                    <stop offset="1" stopColor="#845606" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <span className={styles.rank_number}>{i + 1}</span>
                            </div>
                          )}

                          <img src={row.imageURL} alt="avatar" className={i < 0 ? styles.top_rank : styles.normal_rank} />
                          <abbr className={row.address === state.userAddress ? styles.active : null}>{row.name}</abbr>
                        </Table.Cell>
                        <Table.Cell className={styles.winnings}>
                          <abbr>{(Number(row.winnings) / 1000000000000000000).toFixed(0).toLocaleString()}</abbr>
                          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635212177/FREE_Coin_c08hyk.png" alt="ice" />
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            ) : (
              <NoResult />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
