const apiAi = require("./api_ai");

module.exports = data =>
  new Promise((resolve, reject) => {
    if (data.entry && data.entry.length > 0) {
      const entry = data.entry[0];
      const message = entry.messaging[0].message;
      const request = {
        user_id: entry.messaging[0].sender.id,
        user: entry.messaging[0].sender.id,
        chat_id: entry.id,
        date: entry.time,
        service: "facebook",
        isCallback: false,
      };
      // Request is a text
      if (message.hasOwnProperty("text")) {
        return apiAi(message.text, entry.messaging[0].sender.id)
          .then(resultApiAi => {
            const content = {
              text: message.text,
              api_ai: resultApiAi,
            };
            return resolve(
              Object.assign({}, request, {
                content,
              })
            );
          })
          .catch(e => console.log("ERROR " + e));
      }
      // Request has an attachment
      if (
        message.hasOwnProperty("attachments") &&
        message.attachments.length > 0
      ) {
        const attachment = message.attachments[0];
        // Request is an image
        if (attachment.type === "image") {
          const content = { image: attachment.payload.url };
          return resolve(Object.assign({}, request, { content }));
        }
        // Request is a video
        if (attachment.type === "video") {
          const content = { video: attachment.payload.url };
          return resolve(Object.assign({}, request, { content }));
        }
        // Request is a file
        if (attachment.type === "file") {
          const content = { video: attachment.payload.url };
          return resolve(Object.assign({}, request, { content }));
        }
        // Request is an audio
        if (attachment.type === "audio") {
          const content = { video: attachment.payload.url };
          return resolve(Object.assign({}, request, { content }));
        }
        // Request is a location
        if (attachment.type === "location") {
          const content = {
            location: {
              latitude: attachment.payload.coordinates.lat,
              longitude: attachment.payload.coordinates.long,
            },
          };
          return resolve(Object.assign({}, request, { content }));
        }
        return resolve(Object.assign({}, request, { raw: message }));
      }
      // Request is a callback
      if (entry.messaging[0].hasOwnProperty("postback")) {
        const request = {
          user_id: entry.messaging[0].sender.id,
          user: entry.messaging[0].sender.id,
          chat_id: entry.id,
          date: entry.time,
          service: "facebook",
          isCallback: true,
          data: entry.messaging[0].postback.payload,
        };
        return resolve(request);
      }
      return resolve(Object.assign({}, request, { raw: message }));
    } else resolve({});
  });
