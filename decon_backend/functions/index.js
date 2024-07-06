// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const https = require("https");

initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
      .collection("messages")
      .add({original: original});
    // Send back a message that we've successfully written the message
  res.json({result: `Messages with ID: ${writeResult.id} added.`});
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercassing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({uppercase}, {merge: true});
});


exports.streamOpenAI = onRequest((req, res) => {
  const openAIKey = "dummy";
  const model = "gpt-3.5-turbo";
  const max_tokens = 1000;
  const prompt = req.query.prompt;

  const options = {
    hostname: "api.openai.com",
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openAIKey}`,
      "Content-Type": "application/json",
    },
  };

  let responseData = ""; // Used to combine chunks of data into a full response

  const apiReq = https.request(options, (apiRes) => {
    apiRes.setEncoding("utf8");

    apiRes.on("data", (chunk) => {
      console.log("riri");
      console.log(chunk);
      responseData += chunk; // Append the chunk to the existing response data
      // If the chunk ends with a
      // newline or closing bracket, we can attempt to parse it
      if (chunk.endsWith("\n") || chunk.endsWith("}")) {
        let eventData = null;
        try {
          eventData = JSON.parse(responseData);
          responseData = ""; // Reset for the next JSON object
        } catch (e) {
          // If JSON parsing fails, wait for more data to arrive
          return;
        }

        try {
          const content = eventData.choices[0].delta.content;
          if (content) {
            res.write(`data: ${JSON.stringify({content})}\n\n`);
          }
        } catch (e) {
          // If error occurs when extracting content, log it and ignore the data
          console.error(e);
        }
      }
    });

    apiRes.on("end", () => {
      res.write("data: [DONE]\n\n");
      res.end();
    });
  }).on("error", (err) => {
    console.error("Error: " + err.message);
  });

  apiReq.write(JSON.stringify({
    model,
    max_tokens: max_tokens,
    messages: [{role: "user", content: prompt}],
    stream: true,
  }));

  apiReq.end();
});
