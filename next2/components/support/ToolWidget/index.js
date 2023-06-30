import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Modal, Button } from 'semantic-ui-react';
import styles from './ToolWidget.module.scss';
import Fetch from '../../../common/Fetch';
import _ from 'lodash';

const ToolWidget = props => {
  // get wearable listings from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [completed, setCompleted] = useState(false);
  const [walletaddress, setWalletaddress] = useState(null);
  const [playBalance, setPlayBalance] = useState(0);
  const [iceChipsBalance, setIceChipsBalance] = useState(0);

  const [bannedUserAddress, setBannedUserAddress] = useState('');
  const [reason, setReason] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [type, setType] = useState('');
  const [hasBannedUserInfo, setHasBannedUserInfo] = useState(false);
  const [bannedUserAddressesInput, setBannedUserAddressesInput] = useState('');
  const [banReasonInput, setBanReasonInput] = useState('');
  const [banTypeInput, setBanTypeInput] = useState('');
  const [banReporterNameInput, setBanReporterNameInput] = useState('');

  const [addedPlayBalance, setAddedPlayBalance] = useState('');
  const [addedIceChipsBalance, setAddedIceChipsBalance] = useState('');

  const setBannedUserInfo = jsonInfo => {
    setBannedUserAddress(jsonInfo.BannedUserAddress);
    setReason(jsonInfo.Reason);
    setReporterName(jsonInfo.ReporterName);
    setType(jsonInfo.type);
  };

  const resetBanInputForm = () => {
    setBannedUserAddressesInput('');
    setBanReasonInput('');
    setBanTypeInput('');
    setBanReporterNameInput('');
  };

  /// //////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  async function fetchBalance(wallet_addr) {
    const jsonInfo = await Fetch.PLAYER_INFO(wallet_addr);

    console.log('%c jsonInfo: ', 'color: red', jsonInfo);

    if (jsonInfo) {
      setPlayBalance(jsonInfo.playBalance);
      setIceChipsBalance(jsonInfo.iceChipsBalance);
    }
  }

  function modalButtons(type) {
    if (type === 'help') {
      return (
        <span className={styles.button_help}>
          <svg width="22" height="20" viewBox="0 -1 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <rect width="22" height="20" fill="url(#pattern0)" />
            <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image0" transform="translate(0.0965909) scale(0.00378788 0.00416667)" />
              </pattern>
              <image
                id="image0"
                width="213"
                height="240"
                xlinkHref="data:image/png;base64,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"
              />
            </defs>
          </svg>
          Help
        </span>
      );
    } else if (type === 'close') {
      return (
        <span
          className={styles.button_close}
          onClick={() => {
            props.close();
            setHasBannedUserInfo(false);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
              fill="white"
            />
          </svg>
        </span>
      );
    } else if (type === 'back') {
      return (
        <span
          className={styles.button_close}
          onClick={() => {
            props.close();
            setHasBannedUserInfo(false);
          }}
        >
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.0107422 8.6543C0.0107422 9.11133 0.168945 9.48926 0.555664 9.8584L7.16504 16.3271C7.44629 16.6084 7.78027 16.7402 8.17578 16.7402C8.99316 16.7402 9.65234 16.0811 9.65234 15.2812C9.65234 14.8682 9.48535 14.499 9.17773 14.2002L3.44727 8.64551L9.17773 3.1084C9.48535 2.80078 9.65234 2.43164 9.65234 2.02734C9.65234 1.22754 8.99316 0.568359 8.17578 0.568359C7.78027 0.568359 7.44629 0.708984 7.16504 0.981445L0.555664 7.4502C0.177734 7.81934 0.0107422 8.18848 0.0107422 8.6543Z"
              fill="white"
            />
          </svg>
        </span>
      );
    }
  }

  return (
    <Modal
      className={styles.delegate_modal}
      onClose={() => {
        props.close();
      }}
      open={true}
      closeOnDimmerClick={false}
      close
    >
      {props.status === 1 ? (
        <>
          <div className={styles.top_buttons}>{modalButtons('close')}</div>
          <div className={styles.title}>Free Play & Chip Balance</div>

          <div
            className={styles.body}
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <input
              className={styles.input}
              maxLength="42"
              placeholder="Paste User Address Here"
              onChange={async evt => {
                if (evt.target.value.length > 40) {
                  setWalletaddress(evt.target.value);
                  setCompleted(true);

                  const jsonInfo = await Fetch.PLAYER_INFO(evt.target.value);

                  console.log('%c jsonInfo: ', 'color: red', jsonInfo);

                  if (jsonInfo) {
                    setPlayBalance(jsonInfo.playBalance);
                    setIceChipsBalance(jsonInfo.iceChipsBalance);
                  }
                } else {
                  setCompleted(false);
                }
              }}
            />

            <Button
              className={styles.enter_button}
              disabled={completed ? false : true}
              onClick={() => {
                setStatus(0);
              }}
            >
              Enter Address
            </Button>
          </div>
        </>
      ) : props.status === 2 ? (
        <>
          <div className={styles.top_buttons}>{modalButtons('close')}</div>
          <div className={styles.title}>Bulk Block Users</div>

          <div
            className={styles.body}
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <input
              className={styles.input}
              placeholder="Paste User Addresses Here"
              onChange={async evt => {
                setBannedUserAddressesInput(evt.target.value.trim());

                // if (evt.target.value.length > 40) {
                //   setWalletaddress(evt.target.value);
                //   setCompleted(true);

                //   const jsonInfo = await Fetch.PLAYER_INFO(evt.target.value);
                // } else {
                //   setCompleted(false);
                // }
              }}
            />
            <input
              className={styles.input}
              placeholder="Reason For Ban"
              onChange={async evt => {
                setBanReasonInput(evt.target.value.trim());

                // if (evt.target.value.length > 40) {
                //   setWalletaddress(evt.target.value);
                //   setCompleted(true);

                //   const jsonInfo = await Fetch.PLAYER_INFO(evt.target.value);
                // } else {
                //   setCompleted(false);
                // }
              }}
            ></input>
            <input
              className={styles.input}
              placeholder="Reporter Name"
              onChange={async evt => {
                setBanReporterNameInput(evt.target.value.trim());

                // if (evt.target.value.length > 40) {
                //   setWalletaddress(evt.target.value);
                //   setCompleted(true);

                //   const jsonInfo = await Fetch.PLAYER_INFO(evt.target.value);
                // } else {
                //   setCompleted(false);
                // }
              }}
            />
            <input
              className={styles.input}
              placeholder="Type of Ban"
              onChange={async evt => {
                setBanTypeInput(evt.target.value.trim());

                // if (evt.target.value.length > 40) {
                //   setWalletaddress(evt.target.value);
                //   setCompleted(true);

                //   const jsonInfo = await Fetch.PLAYER_INFO(evt.target.value);
                // } else {
                //   setCompleted(false);
                // }
              }}
            />

            <Button
              className={styles.enter_button}
              onClick={async () => {
                console.log(banReasonInput);
                let apiReqData = {
                  banAddresses: bannedUserAddressesInput,
                  reporterName: banReporterNameInput,
                  type: banTypeInput,
                  reason: banReasonInput
                };

                apiReqData = _.pickBy(apiReqData, (value, key) => !(value == ''));
                console.log('here is the api request data', apiReqData);
                await Fetch.BULK_BLOCK_USERS(apiReqData);
                setStatus(0);
                resetBanInputForm();
              }}
            >
              Ban These Users
            </Button>
          </div>
        </>
      ) : props.status === 3 ? (
        <>
          <div className={styles.top_buttons}>{modalButtons('close')}</div>
          <div className={styles.title}>Find Blocked User</div>

          <div
            className={styles.body}
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {hasBannedUserInfo ? (
              <>
                <p>
                  Reason
                  <input className={styles.input} type="text" name="Reason" value={reason} />
                </p>
                <p>
                  Ban Type
                  <input className={styles.input} type="text" name="Type" value={type} />
                </p>
                <p>
                  Reporter Name
                  <input className={styles.input} type="text" name="ReporterName" value={reporterName} />
                </p>
              </>
            ) : (
              <>
                <input
                  className={styles.input}
                  maxLength="42"
                  placeholder="Paste the Banned User's Address Here"
                  onChange={async evt => {
                    if (evt.target.value.length > 40) {
                      setWalletaddress(evt.target.value.toLowerCase());
                      setCompleted(true);

                      const jsonInfo = await Fetch.FIND_BLOCK_USER(evt.target.value);

                      if (jsonInfo) {
                        setBannedUserInfo(jsonInfo);
                        setHasBannedUserInfo(true);
                      }
                    } else {
                      setCompleted(false);
                    }
                  }}
                ></input>

                <Button
                  className={styles.enter_button}
                  disabled={completed ? false : true}
                  onClick={() => {
                    // setStatus(0);
                  }}
                >
                  Find User
                </Button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles.top_buttons}>{modalButtons('close')}</div>
          <div className={styles.title2}>{walletaddress}</div>

          <div
            className={styles.body}
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span className={styles.balance}>Current Balances</span>

            <div className={styles.card}>
              <div className={styles.logo}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M31.9998 16.0001C32.0006 17.1837 31.8704 18.3638 31.6117 19.5188C31.2117 21.3034 30.5055 23.0052 29.5246 24.5488C28.2553 26.5558 26.5556 28.2555 24.5486 29.5249C23.005 30.5058 21.3032 31.2119 19.5186 31.6119C17.2013 32.1294 14.7985 32.1294 12.4812 31.6119C10.6966 31.2119 8.99479 30.5058 7.4512 29.5249C5.44419 28.2555 3.7445 26.5558 2.47516 24.5488C1.49426 23.0052 0.788141 21.3034 0.388108 19.5188C-0.129369 17.2006 -0.129369 14.7969 0.388108 12.4788C1.05619 9.52707 2.54659 6.82494 4.68677 4.68521C6.82695 2.54547 9.52938 1.05564 12.4812 0.388175C14.7985 -0.12931 17.2013 -0.12931 19.5186 0.388175C22.4701 1.05637 25.1721 2.54645 27.3122 4.68607C29.4522 6.82568 30.9429 9.52741 31.6117 12.4788C31.8706 13.6346 32.0008 14.8156 31.9998 16.0001Z"
                    fill="#1A1A1A"
                  />
                  <path
                    d="M16.0003 25.5735C21.288 25.5735 25.5745 21.287 25.5745 15.9992C25.5745 10.7115 21.288 6.42493 16.0003 6.42493C10.7126 6.42493 6.42603 10.7115 6.42603 15.9992C6.42603 21.287 10.7126 25.5735 16.0003 25.5735Z"
                    fill="white"
                  />
                  <path
                    d="M19.8173 18.0758C20.3234 17.5697 20.6077 16.8833 20.6077 16.1675C20.6077 15.4518 20.3234 14.7653 19.8173 14.2592L16.0007 10.4426L12.1841 14.2592C11.7638 14.6805 11.4946 15.229 11.4183 15.8192C11.342 16.4094 11.4629 17.0083 11.7623 17.5226C12.0616 18.037 12.5226 18.438 13.0734 18.6632C13.6243 18.8884 14.2341 18.9253 14.8081 18.768C14.6911 19.7581 14.3576 20.7103 13.8314 21.557H18.1707C17.6444 20.7103 17.3109 19.7581 17.194 18.768C17.6534 18.8948 18.1383 18.8975 18.5991 18.7759C19.0599 18.6543 19.4802 18.4128 19.8173 18.0758Z"
                    fill="#1A1A1A"
                  />
                  <path d="M19.5186 0.388175L18.6447 3.59846H13.3551L12.4812 0.388175C14.7985 -0.12931 17.2013 -0.12931 19.5186 0.388175Z" fill="white" />
                  <path d="M19.5186 31.612C17.2013 32.1295 14.7985 32.1295 12.4812 31.612L13.3551 28.3991H18.6447L19.5186 31.612Z" fill="white" />
                  <path d="M29.5241 7.45135L26.6377 9.10147L22.8979 5.35914L24.5455 2.47272C26.5539 3.74222 28.2546 5.44289 29.5241 7.45135Z" fill="white" />
                  <path d="M9.10198 26.6383L7.45187 29.5247C5.44486 28.2554 3.74517 26.5557 2.47583 24.5487L5.36224 22.8986L9.10198 26.6383Z" fill="white" />
                  <path d="M32 16C32.0008 17.1836 31.8706 18.3637 31.6119 19.5187L28.4016 18.6448V13.3552L31.6119 12.4787C31.8708 13.6346 32.0009 14.8155 32 16Z" fill="white" />
                  <path d="M3.59837 13.3552V18.6448L0.388108 19.5187C-0.129369 17.2006 -0.129369 14.7969 0.388108 12.4787L3.59837 13.3552Z" fill="white" />
                  <path d="M29.5241 24.5487C28.2548 26.5557 26.5551 28.2554 24.5481 29.5247L22.8979 26.6383L26.6377 22.8986L29.5241 24.5487Z" fill="white" />
                  <path d="M9.10198 5.35914L5.36224 9.10147L2.47583 7.45135C3.74532 5.44289 5.44599 3.74222 7.45444 2.47272L9.10198 5.35914Z" fill="white" />
                </svg>
              </div>
              <div className={styles.main}>
                <div className={styles.text}>
                  <span className={styles.top_label}>Free Play</span>
                  <span className={styles.bottom_label}>{playBalance} Free</span>
                </div>
                <input
                  className={styles.edit}
                  placeholder="Add Amount"
                  value={addedPlayBalance.toString()}
                  onChange={e => {
                    const re = /^[0-9\b]+$/;

                    if (e.target.value === '' || re.test(e.target.value)) {
                      setAddedPlayBalance(e.target.value);
                    }
                  }}
                />
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.logo}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M31.9998 16.0001C32.0006 17.1837 31.8704 18.3638 31.6117 19.5188C31.2117 21.3034 30.5055 23.0052 29.5246 24.5488C28.2553 26.5558 26.5556 28.2555 24.5486 29.5249C23.005 30.5058 21.3032 31.2119 19.5186 31.6119C17.2013 32.1294 14.7985 32.1294 12.4812 31.6119C10.6966 31.2119 8.99479 30.5058 7.4512 29.5249C5.44419 28.2555 3.7445 26.5558 2.47516 24.5488C1.49426 23.0052 0.788141 21.3034 0.388108 19.5188C-0.129369 17.2006 -0.129369 14.7969 0.388108 12.4788C1.05619 9.52707 2.54659 6.82494 4.68677 4.68521C6.82695 2.54547 9.52938 1.05564 12.4812 0.388175C14.7985 -0.12931 17.2013 -0.12931 19.5186 0.388175C22.4701 1.05637 25.1721 2.54645 27.3122 4.68607C29.4522 6.82568 30.9429 9.52741 31.6117 12.4788C31.8706 13.6346 32.0008 14.8156 31.9998 16.0001Z"
                    fill="#B10000"
                  />
                  <path
                    d="M16.0003 25.5735C21.288 25.5735 25.5745 21.287 25.5745 15.9992C25.5745 10.7115 21.288 6.42493 16.0003 6.42493C10.7126 6.42493 6.42603 10.7115 6.42603 15.9992C6.42603 21.287 10.7126 25.5735 16.0003 25.5735Z"
                    fill="white"
                  />
                  <path
                    d="M19.8173 18.0758C20.3234 17.5697 20.6077 16.8833 20.6077 16.1675C20.6077 15.4518 20.3234 14.7654 19.8173 14.2592L16.0007 10.4426L12.1841 14.2592C11.7638 14.6806 11.4946 15.229 11.4183 15.8192C11.342 16.4094 11.4629 17.0083 11.7623 17.5227C12.0616 18.037 12.5226 18.438 13.0734 18.6632C13.6243 18.8885 14.2341 18.9253 14.8081 18.768C14.6911 19.7581 14.3576 20.7103 13.8314 21.557H18.1707C17.6444 20.7103 17.3109 19.7581 17.194 18.768C17.6534 18.8948 18.1383 18.8975 18.5991 18.7759C19.0599 18.6544 19.4802 18.4128 19.8173 18.0758Z"
                    fill="#B10000"
                  />
                  <path d="M19.5186 0.388175L18.6447 3.59846H13.3551L12.4812 0.388175C14.7985 -0.12931 17.2013 -0.12931 19.5186 0.388175Z" fill="white" />
                  <path d="M19.5186 31.612C17.2013 32.1295 14.7985 32.1295 12.4812 31.612L13.3551 28.3992H18.6447L19.5186 31.612Z" fill="white" />
                  <path d="M29.5241 7.45135L26.6377 9.10147L22.8979 5.35914L24.5455 2.47272C26.5539 3.74222 28.2546 5.44289 29.5241 7.45135Z" fill="white" />
                  <path d="M9.10198 26.6383L7.45187 29.5247C5.44486 28.2554 3.74517 26.5557 2.47583 24.5487L5.36224 22.8986L9.10198 26.6383Z" fill="white" />
                  <path d="M32 16C32.0008 17.1836 31.8706 18.3637 31.6119 19.5187L28.4016 18.6448V13.3552L31.6119 12.4787C31.8708 13.6345 32.0009 14.8155 32 16Z" fill="white" />
                  <path d="M3.59837 13.3552V18.6448L0.388108 19.5187C-0.129369 17.2006 -0.129369 14.7968 0.388108 12.4787L3.59837 13.3552Z" fill="white" />
                  <path d="M29.5241 24.5487C28.2548 26.5557 26.5551 28.2554 24.5481 29.5247L22.8979 26.6383L26.6377 22.8986L29.5241 24.5487Z" fill="white" />
                  <path d="M9.10198 5.35914L5.36224 9.10147L2.47583 7.45135C3.74532 5.44289 5.44599 3.74222 7.45444 2.47272L9.10198 5.35914Z" fill="white" />
                </svg>
              </div>
              <div className={styles.main}>
                <div className={styles.text}>
                  <span className={styles.top_label}>ICE Chips</span>
                  <span className={styles.bottom_label}>{iceChipsBalance} Chips</span>
                </div>
                <input
                  className={styles.edit}
                  placeholder="Add Amount"
                  value={addedIceChipsBalance.toString()}
                  onChange={e => {
                    const re = /^[0-9\b]+$/;

                    if (e.target.value === '' || re.test(e.target.value)) {
                      setAddedIceChipsBalance(e.target.value);
                    }
                  }}
                />
              </div>
            </div>

            <Button
              className={styles.update}
              onClick={async () => {
                setLoading(true);

                if (addedPlayBalance.length === 0 || addedIceChipsBalance.length === 0) {
                  setLoading(false);
                  const msg = 'The values should not empty!';

                  dispatch({
                    type: 'show_toastMessage',
                    data: msg
                  });
                } else {
                  await Fetch.UPDATE_FREE_PLAYER_BALANCE(addedPlayBalance, walletaddress);
                  await Fetch.UPDATE_ICE_CHIP_BALANCE(addedIceChipsBalance, walletaddress);
                  await fetchBalance(walletaddress);
                  setLoading(false);

                  const msg = 'Values updated successfully!';

                  dispatch({
                    type: 'show_toastMessage',
                    data: msg
                  });
                }
              }}
            >
              Update
            </Button>

            <Button
              className={styles.done}
              onClick={() => {
                setStatus(0);
              }}
            >
              Done
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ToolWidget;
