const telegram = require("./telegram");
const facebook = require("./facebook-messenger");
const config = require("../config.js");

const checkToken = (name, cfg, mdle) => {
  if (cfg.token) return mdle;
  console.log(`No token found for ${name}. Check "config.json"`);
  return {};
};

module.exports = {
  telegram: checkToken("Telegram", config.telegram, telegram),
  facebook: checkToken("Facebook Messenger", config.facebook, facebook),
};
