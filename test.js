// Config
const messenja = require(".");
const fs = require("fs");

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

messenja((request, response) => {
  console.log(JSON.stringify(request));
  if (request.isCallback) {
    response.sendText("Je suis Callback");
    response.sendText(request.data);
    return;
  }
  if (request.api_ai) response.sendText("API AI");
  response.sendText("Coucou", keyboard);
});
