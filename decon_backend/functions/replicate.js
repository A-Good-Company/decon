/* eslint-disable linebreak-style */
const Replicate = require("replicate");
const {defineString} = require("firebase-functions/params");
const replicateKey = defineString("REPLICATE_KEY");


const replicate = new Replicate({
  auth: replicateKey,
});

exports.createPrediction = async (version, input) => {
  try {
    const prediction = await replicate.predictions.create({
      version,
      input,
    });
    return prediction;
  } catch (error) {
    console.error("Error creating prediction:", error);
    throw error;
  }
};

exports.getPrediction = async (predictionId) => {
  try {
    const prediction = await replicate.predictions.get(predictionId);
    return prediction;
  } catch (error) {
    console.error("Error getting prediction:", error);
    throw error;
  }
};

exports.cancelPrediction = async (predictionId) => {
  try {
    await replicate.predictions.cancel(predictionId);
  } catch (error) {
    console.error("Error canceling prediction:", error);
    throw error;
  }
};
