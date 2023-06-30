import keys from '../config/keys';
import { logger } from '../modules/logger';
import { findSlackCommandPermissions } from '../db/dbMongo';

export const slackPermissionHandler = async (req, res, next) => {
  // used for slackRouter
  if (
    req.body.token === keys.SLACK_VERIFY_TOKEN ||
    (req.body.payload &&
      JSON.parse(req.body.payload).token === keys.SLACK_VERIFY_TOKEN)
  ) {
    const command = req.body.command;
    if (command) {
      const userId = req.body.user_id;
      logger.log(
        `Incoming Slack command from ${req.body.user_name} (${userId}) - ${command} ${req.body.text}`
      );
      // check command permissions
      const permissions = await findSlackCommandPermissions();
      if (permissions.commands[command]) {
        const allowedUsers = permissions.commands[command].map(
          (el) => permissions.users[el]
        );
        if (allowedUsers.includes(userId)) {
          // user is allowed to execute command
          next();
        } else {
          res.send({
            response_type: 'in_channel',
            mrkdwn: true,
            text: `Sorry <@${userId}>, you don't have permission to execute this command :/`,
          });
        }
      } else {
        res.send({
          response_type: 'in_channel',
          mrkdwn: true,
          text: `*Error*: Permissions have not been configured for command \`${command}\``,
        });
      }
    } else {
      res.status(403);
    }
  } else {
    res.status(403);
    res.send({
      isTokenValid: false,
      status: `Expired or invalid token`,
    });
    return;
  }
};
