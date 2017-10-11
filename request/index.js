const Telegram = require("./telegram");
const Messenger = require("./facebook-messenger");
const Slack = require("./slack");

module.exports = (messenger, data) => {
  switch (messenger) {
    case "telegram":
      return Telegram(data);
      break;
    case "facebook":
      return Messenger(data);
      break;
    case "slack":
      return Slack(data);
      break;
    default:
      console.log(`Service "${messenger}" not supported`);
      return Promise.reject("Service not supported");
  }
};
