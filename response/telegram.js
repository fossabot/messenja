const axios = require("axios");
const { sendTelegram } = require("../sender");

const formatButton = btn => ({
  text: btn.label,
  callback_data: btn.value || btn.label,
  url: btn.url,
});

const formatReplyMarkup = keyboard => {
  if (!keyboard) return {};
  if (keyboard.hasOwnProperty("inline")) {
    if (keyboard.inline.length > 0 && Array.isArray(keyboard.inline[0])) {
      const rows = keyboard.inline.map(row => row.map(formatButton));
      return {
        reply_markup: {
          inline_keyboard: rows,
        },
      };
    }
    const buttons = keyboard.inline.map(formatButton);
    return {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    };
  }
  if (keyboard.hasOwnProperty("keyboard")) {
    const buttons = keyboard.keyboard.map(btn => ({
      text: btn.label,
      request_location: btn.location,
    }));
    const rows = buttons
      .map((btn, index) => {
        if (!(index % 2))
          return buttons[index + 1] ? [btn, buttons[index + 1]] : [btn];
        return false;
      })
      .filter(i => i);
    return {
      reply_markup: {
        keyboard: rows,
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    };
  }
};

/*
    =============
    API functions
    =============
 */
const sendText = (request, text, keyboard) => {
  const message = {
    chat_id: request.chat_id,
    text,
    parse_mode: "Markdown",
  };
  const reply_markup = formatReplyMarkup(keyboard);
  const data = Object.assign({}, message, reply_markup);
  return sendTelegram("sendMessage", data);
};

const sendImage = (request, urlOrId, text, keyboard) => {
  const message = {
    chat_id: request.chat_id,
    photo: urlOrId.replace("telegram-", ""),
    caption: text,
  };
  const reply_markup = formatReplyMarkup(keyboard);
  const data = Object.assign({}, message, reply_markup);
  return sendTelegram("sendPhoto", data);
};

const sendVideo = (request, urlOrId, text, keyboard) => {
  const message = {
    chat_id: request.chat_id,
    video: urlOrId.replace("telegram-", ""),
    caption: text,
  };
  const reply_markup = formatReplyMarkup(keyboard);
  const data = Object.assign({}, message, reply_markup);
  return sendTelegram("sendVideo", data);
};

const sendFile = (request, urlOrId, text, keyboard) => {
  const message = {
    chat_id: request.chat_id,
    document: urlOrId.replace("telegram-", ""),
    caption: text,
  };
  const reply_markup = formatReplyMarkup(keyboard);
  const data = Object.assign({}, message, reply_markup);
  return sendTelegram("sendDocument", data);
};

const sendAudio = (request, urlOrId, text, keyboard) => {
  const message = {
    chat_id: request.chat_id,
    voice: urlOrId.replace("telegram-", ""),
    caption: text,
  };
  const reply_markup = formatReplyMarkup(keyboard);
  const data = Object.assign({}, message, reply_markup);
  return sendTelegram("sendVoice", data);
};

const sendLocation = (request, latLng, keyboard) => {
  const message = {
    chat_id: request.chat_id,
    latitude: latLng.latitude,
    longitude: latLng.longitude,
  };
  const reply_markup = formatReplyMarkup(keyboard);
  const data = Object.assign({}, message, reply_markup);
  return sendTelegram("sendLocation", data);
};

const sendWait = (request, action) => {
  const message = {
    chat_id: request.chat_id,
    action: action || "typing",
  };
  return sendTelegram("sendChatAction", message);
};

const sendRaw = (request, rawData, method) => {
  const message = {
    chat_id: request.chat_id,
  };
  const data = Object.assign({}, message, rawData);
  return sendTelegram(method, data);
};

module.exports = userRequest => {
  return {
    sendText: (text, keyboard) => sendText(userRequest, text, keyboard),
    sendImage: (urlOrId, text, keyboard) =>
      sendImage(userRequest, urlOrId, text, keyboard),
    sendVideo: (urlOrId, text, keyboard) =>
      sendVideo(userRequest, urlOrId, text, keyboard),
    sendFile: (urlOrId, text, keyboard) =>
      sendFile(userRequest, urlOrId, text, keyboard),
    sendAudio: (urlOrId, text, keyboard) =>
      sendAudio(userRequest, urlOrId, text, keyboard),
    sendLocation: (latLng, keyboard) =>
      sendLocation(userRequest, latLng, keyboard),
    sendWait: action => sendWait(userRequest, action),
    sendRaw: (rawData, method) => sendRaw(userRequest, rawData, method),
  };
};
