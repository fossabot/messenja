const axios = require("axios");
const config = require("./config.js");

const TELEGRAM_TOKEN = config.telegram.token;
const TELEGRAM_URL = "https://api.telegram.org/bot" + TELEGRAM_TOKEN;

const sendTelegram = (url, data) => {
  if (config.debug) console.log(JSON.stringify({ dataSentToTelegram: data }));
  return axios
    .post(TELEGRAM_URL + "/" + url, data)
    .catch(e => console.log("Erreur lors de l'envoi de la réponse"));
};

const FACEBOOK_TOKEN = config.facebook.token;
const FACEBOOK_URL =
  "https://graph.facebook.com/v2.6/me/messages?access_token=" + FACEBOOK_TOKEN;

const sendFacebook = data => {
  if (config.debug) console.log(JSON.stringify({ dataSentToFacebook: data }));
  return axios
    .post(FACEBOOK_URL, data)
    .catch(e => console.log("Erreur lors de l'envoi de la réponse : " + e));
};

module.exports = {
  sendTelegram,
  sendFacebook,
};
