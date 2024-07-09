// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const replicateService = require("./replicate");


// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const https = require("https");
const {defineString} = require("firebase-functions/params");
const openAIKey = defineString("OPENAI_KEY");
const claudeKey = defineString("CLAUDE_KEY");
const replicateKey = defineString("REPLICATE_KEY");


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
  // eslint-disable-next-line camelcase
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

  const apiReq = https.request(options, (apiRes) => {
    apiRes.setEncoding("utf8");

    apiRes.on("data", (chunk) => {
      res.write(chunk);
    });

    apiRes.on("end", () => {
      res.end();
    });
  }).on("error", (err) => {
    console.error("Error: " + err.message);
  });

  apiReq.write(JSON.stringify({
    model,
    // eslint-disable-next-line camelcase
    max_tokens: max_tokens,
    messages: [{role: "user", content: prompt}],
    stream: true,
  }));

  apiReq.end();
});


exports.streamAI = onRequest((req, res) => {
  // Check if the request method is POST
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  console.log(req.body);

  const {service, model, tokenCount, prompt} = req.body;

  // Validate input
  if (!service || !model || !tokenCount || !prompt) {
    res.status(400).send("Missing required parameters");
    return;
  }

  // Configure API details based on the service
  let apiConfig;
  switch (service.toLowerCase()) {
    case "openai":
      apiConfig = getOpenAIConfig(model, tokenCount, prompt);
      break;
    case "claude":
      apiConfig = getClaudeConfig(model, tokenCount, prompt);
      break;
    case "replicate":
      apiConfig = getReplicateConfig(model, tokenCount, prompt);
      break;
    default:
      res.status(400).send("Invalid service");
      return;
  }

  const options = {
    hostname: apiConfig.hostname,
    path: apiConfig.path,
    method: "POST",
    headers: apiConfig.headers,
  };

  const apiReq = https.request(options, (apiRes) => {
    apiRes.setEncoding("utf8");

    apiRes.on("data", (chunk) => {
      res.write(chunk);
    });

    apiRes.on("end", () => {
      res.end();
    });
  }).on("error", (err) => {
    console.error("Error: " + err.message);
    res.status(500).send("Internal Server Error");
  });

  apiReq.write(JSON.stringify(apiConfig.body));
  apiReq.end();
});
exports.transcribeAudio = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  console.log("update");

  // eslint-disable-next-line camelcase
  const {file, prompt, language, num_speakers} = req.body;

  if (!file) {
    res.status(400).send("Missing required parameter: file");
    return;
  }

  try {
    const input = {
      file: file,
      prompt: prompt || "",
      file_url: "",
      language: language || "en",
      // eslint-disable-next-line camelcase
      num_speakers: num_speakers || 2,
    };

    // eslint-disable-next-line max-len
    const version = "80648d30772b580c9528f51592a827b850dd42269fe92881f9084d916e67617f";
    const prediction = await replicateService.createPrediction(version, input);

    console.log(prediction.id);
    res.status(200).json(prediction);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

exports.getPrediction = onRequest(async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const predictionId = req.query.id;

  if (!predictionId) {
    res.status(400).send("Missing required parameter: id");
    return;
  }

  try {
    const prediction = await replicateService.getPrediction(predictionId);
    res.status(200).json(prediction);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

exports.cancelPrediction = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const predictionId = req.body.id;

  if (!predictionId) {
    res.status(400).send("Missing required parameter: id");
    return;
  }

  try {
    await replicateService.cancelPrediction(predictionId);
    res.status(200).send("Prediction canceled successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Generates configuration for OpenAI API requests.
 * @param {string} model - The model to use (e.g., 'GPT3.5' or 'GPT4').
 * @param {number} tokenCount - The maximum number of tokens to generate.
 * @param {string} prompt - The input prompt for the AI.
 * @return {Object} Configuration object for the OpenAI API request.
 */
function getOpenAIConfig(model, tokenCount, prompt) {
  const validModels = [
    "gpt-4o", "gpt-4", "gpt-3.5-turbo-16k-0613",
  ];
  if (!validModels.includes(model)) {
    throw new Error("Invalid model. Please use a valid model.");
  }
  return {
    hostname: "api.openai.com",
    path: "/v1/chat/completions",
    headers: {
      "Authorization": `Bearer ${openAIKey.value()}`,
      "Content-Type": "application/json",
    },
    body: {
      model: model === "GPT3.5" ? "gpt-3.5-turbo" : "gpt-4",
      max_tokens: parseInt(tokenCount),
      messages: [{role: "user", content: prompt}],
      stream: true,
    },
  };
}

/**
 * Generates configuration for Claude API requests.
 * @param {string} model - The model to use (e.g., 'Haiku' or 'Opus').
 * @param {number} tokenCount - The maximum number of tokens to generate.
 * @param {string} prompt - The input prompt for the AI.
 * @return {Object} Configuration object for the Claude API request.
 */
function getClaudeConfig(model, tokenCount, prompt) {
  const validModels = [
    "claude-3-opus-20240229",
    "claude-3-5-sonnet-20240620",
    "claude-3-haiku-20240307",
  ];
  if (!validModels.includes(model)) {
    throw new Error("Invalid model. Please use a valid model.");
  }
  console.log("Claude key:" + claudeKey);
  return {
    hostname: "api.anthropic.com",
    path: "/v1/messages",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": claudeKey.value(),
      "anthropic-version": "2023-06-01",
    },
    body: {
      model: model,
      max_tokens: parseInt(tokenCount),
      messages: [{role: "user", content: prompt}],
      stream: true,
    },
  };
}

/**
 * Generates configuration for Replicate API requests.
 * @param {string} model - The model to use (specific to Replicate).
 * @param {number} tokenCount - The maximum number of tokens to generate.
 * @param {string} prompt - The input prompt for the AI.
 * @return {Object} Configuration object for the Replicate API request.
 */
function getReplicateConfig(model, tokenCount, prompt) {
  return {
    hostname: "api.replicate.com",
    path: "/v1/predictions",
    headers: {
      "Authorization": `Token ${replicateKey.value()}`,
      "Content-Type": "application/json",
    },
    body: {
      version: "model_version_id_here",
      input: {
        prompt: prompt,
        max_length: parseInt(tokenCount),
      },
    },
  };
}
