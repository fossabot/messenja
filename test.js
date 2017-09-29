// Config
const messenja = require(".");

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

const facebookRaw = {
  text: "Hey, je suis *raw*",
};
const TelegramRaw = {
  text: "Hey, je suis  _raw_",
  parse_mode: "Markdown",
};

messenja((request, response) => {
  console.log(JSON.stringify(request));
  if (request.isCallback) {
    response.sendText("Je suis Callback");
    response.sendText(request.data);
    return;
  }

  response.sendRaw(
    request.service === "telegram" ? TelegramRaw : facebookRaw,
    "sendMessage"
  );

  response.sendLocation({ latitude: 46.2050295, longitude: 6.1440885 }, inline);

  if (request.content.api_ai)
    response.sendText(request.content.api_ai.fulfillment.speech, keyboard);
});
