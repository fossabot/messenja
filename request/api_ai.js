const apiai = require("apiai");
const config = require("../config.js").api_ai;
const app = config.token ? apiai(config.token) : false;

module.exports = (text, sessionId) =>
  new Promise((resolve, reject) => {
    if (!app) return resolve({});

    const req = app.textRequest(text, {
      sessionId,
    });

    req.on("response", response => resolve(response.result));
    req.on("error", error => reject(error));
    req.end();
  });
