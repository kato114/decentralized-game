import { useContext, useEffect } from 'react';
import { GlobalContext } from '@/store';
import getConfig from 'next/config';
import { decode, encode } from './crypto';
import { SocketUrlsByAppEnv } from './environments';

const { publicRuntimeConfig } = getConfig();
const { APP_ENV } = publicRuntimeConfig;

const Socket = () => {
  const [state, dispatch] = useContext(GlobalContext);
  const reconnectDelay = 1000;

  const setUpSocket = () => {
    /** ===================================
     * open WebSocket connection and handle incoming WebSocket messages
     * ==================================== */

    let webSocket;
    try {
      webSocket = new WebSocket(SocketUrlsByAppEnv[APP_ENV] || 'wss://socket.decentral.games');

      webSocket.onerror = async err => {
        // console.log('WebSocket connection error', err);
      };

      webSocket.onopen = async () => {
        console.log('WebSocket connection activated for website');

        const web = encode(
          JSON.stringify({
            isWebsiteMessage: true,
            authToken: localStorage.token
          })
        );
        webSocket.send(web); // generate website socket client
      };

      webSocket.onclose = async event => {
        console.log('Websocket connection closed for website');

        // Reconnect if disconnection was unexpected
        setTimeout(() => {
          setUpSocket();
          webSocket = undefined;
        }, reconnectDelay);
      };

      webSocket.onmessage = async message => {
        const json = JSON.parse(decode(message.data));
        console.log('New message received from WebSocket:', json);

        if (json.minMintVerifyStep || json.minMintVerifyStep === 0) {
          dispatch({
            type: 'app_config',
            data: json
          });
        }
      };
    } catch (err) {
      (async () => {
        // Reconnect if disconnection was unexpected
        setTimeout(() => {
          setUpSocket();
        }, reconnectDelay);
      })();
      return;
    }
  };

  useEffect(() => {
    if (state.userLoggedIn) {
      setUpSocket();
    }
  }, [state.userLoggedIn]);

  return null;
};

export default Socket;
