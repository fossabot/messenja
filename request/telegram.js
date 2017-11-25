const dialogflow = require("./dialogflow");

const sanitizeString = string => string.replace(/(`|\[|\])/g, "");

const getUsername = messageFrom => {
  const firstName = messageFrom.first_name ? messageFrom.first_name : "";
  const lastName = messageFrom.last_name ? " " + messageFrom.last_name : "";
  return sanitizeString(firstName + lastName);
};

module.exports = data =>
  new Promise((resolve, reject) => {
    // If request is a message
    if (data.message) {
      // Get request context
      const request = {
        user_id: "telegram-" + data.message.from.id,
        user: getUsername(data.message.from),
        chat_id: data.message.from.id,
        date: data.message.date,
        service: "telegram",
        isCallback: false,
      };

      // Request is a text
      if (data.message.hasOwnProperty("text")) {
        return dialogflow(data.message.text, data.message.from.id)
          .then(resultDialogflow => {
            const content = {
              text: data.message.text,
              dialogflow: resultDialogflow,
            };
            return resolve(
              Object.assign({}, request, {
                content,
              })
            );
          })
          .catch(e => console.log("ERROR " + e));
      }
      // Request is an image
      if (data.message.hasOwnProperty("photo")) {
        return resolve(
          Object.assign({}, request, {
            content: {
              image:
                "telegram-" +
                data.message.photo[data.message.photo.length - 1].file_id,
            },
          })
        );
      }
      // Request is a video
      if (data.message.hasOwnProperty("video")) {
        return resolve(
          Object.assign({}, request, {
            content: {
              video: "telegram-" + data.message.video.file_id,
            },
          })
        );
      }
      // Request is a file
      if (data.message.hasOwnProperty("document")) {
        return resolve(
          Object.assign({}, request, {
            file: "telegram-" + data.message.document.file_id,
          })
        );
      }
      // Request is an audio
      if (data.message.hasOwnProperty("voice")) {
        return resolve(
          Object.assign({}, request, {
            file: "telegram-" + data.message.voice.file_id,
          })
        );
      }
      // Request is a geo-location
      if (data.message.hasOwnProperty("location")) {
        return resolve(
          Object.assign({}, request, {
            content: {
              location: data.message.location,
            },
          })
        );
      }
      return resolve(Object.assign({}, request, { raw: data.message }));
    }
    // If request is a callback
    if (data.callback_query) {
      // Get request context
      const request = {
        user_id: "telegram" + data.callback_query.from.id,
        user: getUsername(data.callback_query.from),
        chat_id: data.callback_query.from.id,
        date: data.callback_query.date,
        service: "telegram",
        isCallback: true,
        data: data.callback_query.data,
      };
      return resolve(request);
    }
    return resolve({});
  });
