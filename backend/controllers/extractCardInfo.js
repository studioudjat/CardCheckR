const OpenAI = require("openai");

async function extractCardInfo(apiKey, text) {
  if (!text) {
    console.error("Input text is empty");
    throw new Error("Input text is required to extract card information.");
  }

  const openai = new OpenAI({ apiKey: apiKey });

  const prompt = `As an AI specialized in extracting credit card information, analyze the following text and extract the requested details. Pay particular attention to identifying a 3-digit security code. It may appear as an isolated set of 3 digits within the text. The security code is likely to be a standalone 3-digit number that is not part of a phone number or address. Provide only the information in the specified format, nothing else. If a piece of information is not available or unclear, write 'Not found' for that field.

Required information:
1. Cardholder name
2. Card number (format: XXXXXXXXXXXXXXXX)
3. Expiration date (format: MM/YY)
4. 3 digits security code

Output Format:
cardHolderName: [Cardholder name]
cardNumber: [Card number]
expiryDate: [MM/YY]
securityCode: [Security code]

Text to analyze:

${text}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an AI specialized in accurately extracting credit card information from text. Ensure high precision and format compliance.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0,
    });

    if (!response.choices[0].message.content) {
      throw new Error("Invalid response from OpenAI");
    }

    const fullTextResponse = response.choices[0].message.content.trim();
    console.log("\nOpenAI response:\n" + fullTextResponse);

    const cardInfo = {
      cardNumber: "Card number not found",
      expiryDate: "Expiry date not found",
      cardHolderName: "Cardholder name not found",
      securityCode: "Security code not found",
    };

    const lines = fullTextResponse.split("\n");

    lines.forEach((line) => {
      line = line.trim();
      if (line.toLowerCase().startsWith("cardholdername:")) {
        cardInfo.cardHolderName = line.split(":")[1].trim();
      } else if (line.toLowerCase().startsWith("cardnumber:")) {
        cardInfo.cardNumber = line.split(":")[1].trim();
      } else if (line.toLowerCase().startsWith("expirydate:")) {
        cardInfo.expiryDate = line.split(":")[1].trim();
      } else if (line.toLowerCase().startsWith("securitycode:")) {
        cardInfo.securityCode = line.split(":")[1].trim();
      }
    });

    // Normalize "Not found" values
    for (let key in cardInfo) {
      if (cardInfo[key].toLowerCase() === "not found") {
        cardInfo[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } not found`;
      }
    }

    return cardInfo;
  } catch (error) {
    console.error("Error extracting card information:", error);
    throw new Error("Failed to extract card information using OpenAI GPT-4.");
  }
}

module.exports = {
  extractCardInfo,
};
