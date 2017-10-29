const dialogflow = require("apiai");
const config = require("../config.js").dialogflow;
const app = config.token ? dialogflow(config.token) : false;

module.exports = (text, sessionId) =>
  new Promise((resolve, reject) => {
    if (!app) return resolve(null);

    const req = app.textRequest(text, {
      sessionId,
    });

    req.on("response", response => resolve(response.result));
    req.on("error", error => reject(error));
    req.end();
  });
