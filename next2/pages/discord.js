import Global from '../components/Constants';

const Discord = () => {
  return {};
};

Discord.getInitialProps = ({ res }) => {
  if (res) {
    res.writeHead(301, {
      Location: Global.CONSTANTS.DISCORD_URL
    });
    res.end();
  } else {
    window.location = Global.CONSTANTS.DISCORD_URL;
  }
};

export default Discord;
