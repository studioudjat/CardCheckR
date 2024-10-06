const { ImageAnnotatorClient } = require("@google-cloud/vision");
const { extractCardInfo } = require("./extractCardInfo");
const {
  processCreditCard: regexProcessCreditCard,
} = require("./regexCardProcessor");

const visionClient = new ImageAnnotatorClient();

async function processCreditCard(imageBuffer, useRegex = false) {
  try {
    const [result] = await visionClient.textDetection(imageBuffer);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      throw new Error("No text detected in the image.");
    }

    const fullText = detections[0]?.description || "";
    console.log("\n" + fullText);

    if (!fullText) {
      throw new Error("OCR text extraction failed. No valid text to process.");
    }

    let cardInfo;

    if (useRegex) {
      cardInfo = await regexProcessCreditCard(imageBuffer);
    } else {
      cardInfo = await extractCardInfo(process.env.OPENAI_API_KEY, fullText);
    }

    return cardInfo;
  } catch (error) {
    console.error("Error processing credit card image:", error);
    throw error;
  }
}

module.exports = {
  processCreditCard,
};
