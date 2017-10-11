/**
 * Messenga main module
 * @module messenja
 */
// Config
const config = require("./config.js");
const PORT = config.server.port || 3333;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const request = require("./request");
const response = require("./response");
const utils = require("./utils");

// Set Body Parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// GET message for connectivity checks
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Okay !" });
});

// Serve hosted files
app.use("/file", express.static(process.cwd() + "/cache"));

// Facebook Messenger - token verification
app.use("/facebook", (req, res, next) => {
  if (req.query["hub.mode"] !== "subscribe") return next();
  if (req.query["hub.verify_token"] === config.facebook.verify_token) {
    console.log("Validating webhook for Facebook Messenger");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error(
      "Failed Facebook validation. Make sure the validation tokens match."
    );
    res.sendStatus(403);
  }
});

// Slack - token verification
app.use(/\/slack$/, (req, res, next) => {
  console.log("CHECK TOKEN");
  if (req.body.token === config.slack.verify_token) {
    if (req.body.type !== "url_verification") {
      console.log("Validating webhook for Slack");
      return res.status(200).send(req.body.challenge);
    }
    return next();
  } else {
    console.error(
      "Failed Slack validation. Make sure the validation tokens match"
    );
    res.sendStatus(403);
  }
});

/**
 * Create an API endpoint for communicate with services
 * @param  {Function} fn Actions to process when a message is received
 * @return {Object}      Express app object
 */
module.exports = (fn, auth, err) => {
  app.post("/:messenger", (req, res) => {
    request(req.params.messenger, req.body)
      .then(userRequest => {
        const botResponse = response[req.params.messenger](userRequest);
        try {
          fn(userRequest, botResponse, utils);
        } catch (e) {
          console.log(e);
        }
        res.json({ ok: true, message: "Received" });
      })
      .catch(error => res.json({ ok: false, message: error }));
  });

  // Slack - OAuth
  app.get("/slack/oauth", (req, res) => {
    if (req.query.state === config.slack.verify_state) {
      return utils
        .getSlackUserToken(req.query.code)
        .then(slackData => {
          auth.slack.setUserToken(slackData);
          return res.json({
            ok: true,
            message: "You have been correctly authentified",
          });
        })
        .catch(e => err(e, res));
    }
    return res.sendStatus(403);
  });

  app.listen(PORT, () => console.log(`Listen on port ${PORT}`));
  return app;
};
