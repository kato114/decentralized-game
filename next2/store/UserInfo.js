import { useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Fetch from '../common/Fetch';

function UserInfo() {
  // dispatch user's information to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // get user's avatar image
  useEffect(() => {
    // fetch user avatar image
    fetch(`https://peer-lb.decentraland.org/lambdas/profiles?id=${state.userAddress}`)
      .then(res => res.json())
      .then(json => {
        let avatarImg = `https://res.cloudinary.com/dnzambf4m/image/upload/v1613496042/default_face_xqobns.png`;
        if (json && json.length > 0) {
          avatarImg = 'https://peer-lb.decentraland.org/content/contents/' + json[0].avatars[0].avatar.snapshots.face256.split('/').slice(-1)[0];
        }

        if (avatarImg !== state.userAvatarImg) {
          dispatch({
            type: 'user_avatarImg',
            data: avatarImg
          });
        }
      });
  }, [state.userLoggedIn, state.userAddress]);

  // get user's play name, wallet address, MANA balance, email address, players list, and token totals
  useEffect(() => {
    if (state.userLoggedIn && state.userAddress) {
      (async function () {
        const jsonInfo = await Fetch.PLAYER_INFO(state.userAddress);
        console.log('%c jsonInfo: ', 'color: red', jsonInfo);

        if (jsonInfo && jsonInfo._id) {
          const name = jsonInfo.avatarName;
          const id = jsonInfo._id.slice(-6);
          const balancePLAY = jsonInfo.playBalance.toLocaleString();
          const balanceXP = jsonInfo.iceXpCurrent;
          const totalXP = jsonInfo.iceXpAllTime;
          const count = jsonInfo.callCount;
          const email = '';
          const playersList = jsonInfo.playersList;
          const tokenArray = jsonInfo.tokenArray;
          const guildManager = jsonInfo.guildManager ? jsonInfo.guildManager : null;
          const managerOf = jsonInfo.managerOf ? jsonInfo.managerOf : null;

          const data = {
            name: name,
            id: id,
            balancePLAY: balancePLAY,
            count: count,
            email: email,
            playersList: playersList,
            tokenArray: tokenArray,
            balanceXP: balanceXP,
            totalXP: totalXP,
            guildManager: guildManager,
            managerOf: managerOf
          };

          dispatch({
            type: 'user_info',
            data: data
          });
        }
      })();
    }
  }, [state.userLoggedIn, state.userAddress, state.updateInfo, state.refreshBalances]);

  return null;
}

export default UserInfo;
