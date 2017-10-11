// Config
const messenja = require(".");
const slackUsers = require("./slack-users.json");
const fs = require("fs");

const auth = {
  slack: {
    /*
    slackData = {
    "ok": true,
    "access_token",
    "scope":,
    "user_id":,
    "team_name": "Messenja",
    "team_id": "T7FH0BLQY"
}
     */
    setUserToken: slackData => {
      slackUsers[slackData.user_id] = slackData.access_token;
      const newContent = Object.assign({}, slackUsers, {
        [slackData.user_id]: slackData,
      });
      fs.writeFile("./slack-users.json", JSON.stringify(newContent), function(
        err,
        data
      ) {
        if (err) {
          return console.log(err);
        }
        console.log(data);
      });
    },
  },
};

const handleErrors = (error, res) => {
  console.log({ error });
  res.json(error);
};

const inline = {
  inline: [
    { label: "Bouton 1", url: "http://5ika.org" },
    { label: "Bouton 2", value: "Yolo" },
    { label: "Bouton 3" },
  ],
};

const keyboard = {
  keyboard: [{ label: "Send location", location: true }, { label: "Key 2" }],
};

messenja(
  (request, response) => {
    console.log(JSON.stringify(request));
    if (request.isCallback) {
      response.sendText("Je suis Callback");
      response.sendText(request.data);
      return;
    }

    if (request.content.api_ai)
      response.sendText(request.content.api_ai.fulfillment.speech, keyboard);
    else response.sendText("Coucou", keyboard);
  },
  auth,
  handleErrors
);
