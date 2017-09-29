const axios = require("axios");
const { sendFacebook } = require("../sender");
const { getTelegramURL } = require("../utils");

const formatReplyMarkup = (keyboard, text) => {
  if (!keyboard) return false;
  if (keyboard.hasOwnProperty("inline")) {
    const buttons = keyboard.inline.map(btn => {
      if (btn.url) {
        return {
          type: "web_url",
          title: btn.label,
          url: btn.url,
        };
      }
      return {
        type: "postback",
        title: btn.label,
        payload: btn.value || btn.label,
      };
    });
    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text,
          buttons,
        },
      },
    };
  }
  if (keyboard.hasOwnProperty("keyboard")) {
    const quick_replies = keyboard.keyboard.map(btn => {
      if (btn.location) return { content_type: "location" };
      return {
        content_type: "text",
        title: btn.label,
        payload: btn.label,
      };
    });
    return { quick_replies, text };
  }
};

/*
    =============
    API functions
    =============
 */
const sendText = (request, text, keyboard) => {
  const reply_markup = formatReplyMarkup(keyboard, text);
  const message = reply_markup ? reply_markup : { text };
  const data = {
    message,
    recipient: {
      id: request.user_id,
    },
  };
  return sendFacebook(data);
};

const sendImage = (request, imageUrl, text, keyboard) => {
  const data = {
    recipient: {
      id: request.user_id,
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: imageUrl,
        },
      },
    },
  };
  return sendFacebook(data).then(() => sendText(request, text, keyboard));
};

const sendVideo = (request, videoUrl, text, keyboard) => {
  const data = {
    recipient: {
      id: request.user_id,
    },
    message: {
      attachment: {
        type: "video",
        payload: {
          url: videoUrl,
        },
      },
    },
  };
  return sendFacebook(data).then(() => sendText(request, text, keyboard));
};

const sendFile = (request, fileUrl, text, keyboard) => {
  const data = {
    recipient: {
      id: request.user_id,
    },
    message: {
      attachment: {
        type: "file",
        payload: {
          url: fileUrl,
        },
      },
    },
  };
  return sendFacebook(data).then(() => sendText(request, text, keyboard));
};

const sendAudio = (request, audioUrl, text, keyboard) => {
  const data = {
    recipient: {
      id: request.user_id,
    },
    message: {
      attachment: {
        type: "audio",
        payload: {
          url: audioUrl,
        },
      },
    },
  };
  return sendFacebook(data).then(() => sendText(request, text, keyboard));
};

const sendLocation = (request, latLng, keyboard) => {
  const coordinates = latLng.latitude + "," + latLng.longitude;
  const data = {
    recipient: {
      id: request.user_id,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Location",
              subtitle: "Click to see on a map",
              image_url:
                "https://maps.googleapis.com/maps/api/staticmap?markers=color:red|label:B|" +
                coordinates +
                "&size=360x360&zoom=13",
              default_action: {
                type: "web_url",
                url:
                  "https://www.google.com/maps/search/?api=1&query=" +
                  coordinates,
              },
            },
          ],
        },
      },
    },
  };
  return sendFacebook(data);
};

const sendWait = request => {
  const data = {
    recipient: {
      id: request.user_id,
    },
    sender_action: "typing_on",
  };
  return sendFacebook(data);
};

const sendRaw = (request, rawData) => {
  const data = {
    recipient: {
      id: request.user_id,
    },
    message: rawData,
  };
  return sendFacebook(data);
};

module.exports = userRequest => {
  return {
    sendText: (text, keyboard) => sendText(userRequest, text, keyboard),
    sendImage: (imageUrl, text, keyboard) => {
      if (imageUrl.includes("telegram-")) {
        sendWait(userRequest);
        return getTelegramURL(imageUrl).then(url =>
          sendImage(userRequest, url, text, keyboard)
        );
      }
      return sendImage(userRequest, imageUrl, text, keyboard);
    },

    sendVideo: (videoUrl, text, keyboard) => {
      if (videoUrl.includes("telegram-")) {
        sendWait(userRequest);
        return getTelegramURL(videoUrl).then(url =>
          sendVideo(userRequest, url, text, keyboard)
        );
      }
      return sendVideo(userRequest, videoUrl, text, keyboard);
    },
    sendFile: (fileUrl, text, keyboard) => {
      if (fileUrl.includes("telegram-")) {
        sendWait(userRequest);
        return getTelegramURL(fileUrl).then(url =>
          sendFile(userRequest, url, text, keyboard)
        );
      }
      return sendFile(userRequest, fileUrl, text, keyboard);
    },
    sendAudio: (audioUrl, text, keyboard) => {
      if (audioUrl.includes("telegram-")) {
        sendWait(userRequest);
        return getTelegramURL(audioUrl).then(url =>
          sendAudio(userRequest, url, text, keyboard)
        );
      }
      return sendAudio(userRequest, audioUrl, text, keyboard);
    },
    sendLocation: (latLng, keyboard) =>
      sendLocation(userRequest, latLng, keyboard),
    sendWait: () => sendWait(userRequest),
    sendRaw: rawData => sendRaw(userRequest, rawData),
  };
};
