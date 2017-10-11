const wget = require("node-wget");
const axios = require("axios");
const querystring = require("querystring");
const fs = require("fs");
const { sendTelegram, sendFacebook } = require("./sender");
const config = require("./config.js");
const cachePath = process.cwd() + "/cache/";

const TELEGRAM_TOKEN = config.telegram.token;
const FACEBOOK_TOKEN = config.facebook.token;

const getTelegramURL = id => {
  if (!id.includes("telegram-")) return id;
  const file_id = id.replace("telegram-", "");
  return sendTelegram("getFile", { file_id }).then(res => {
    if (res.data.result.file_path) {
      const url =
        "https://api.telegram.org/file/bot" +
        TELEGRAM_TOKEN +
        "/" +
        res.data.result.file_path;
      const ext = "." + res.data.result.file_path.split(".").pop();
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);
      return new Promise((resolve, reject) =>
        wget({ url, dest: cachePath + file_id + ext }, () =>
          resolve(config.server.url + "/file/" + file_id + ext)
        )
      );
    }
    return "";
  });
};

const getFacebookProfile = id =>
  axios
    .get(
      `https://graph.facebook.com/v2.6/${id}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${FACEBOOK_TOKEN}`
    )
    .then(res => res.data);

const getSlackUserToken = code => {
  return axios({
    method: "post",
    url: `https://slack.com/api/oauth.access`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: querystring.stringify({
      client_id: config.slack.client_id,
      client_secret: config.slack.client_secret,
      code,
      redirect_uri: `${config.server.url}/slack/oauth`,
    }),
  }).then(res => {
    if (res.data.hasOwnProperty("error"))
      throw { code: "SLACK GET ACCESS_TOKEN", message: res.data.error };
    return res.data;
  });
};

module.exports = {
  getTelegramURL,
  getFacebookProfile,
  getSlackUserToken,
};
