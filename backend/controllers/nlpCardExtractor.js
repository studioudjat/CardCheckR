//require("dotenv").config();
const { LanguageServiceClient } = require("@google-cloud/language");

// 環境変数から認証情報を設定
const client = new LanguageServiceClient();

// エンティティ抽出を行う非同期関数
async function extractCardInfo(text) {
  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };

  const [result] = await client.analyzeEntities({ document });

  const entities = result.entities;
  console.log(JSON.stringify(entities, null, 2));
  const cardInfo = {};

  // コロンの後の値を安全に取得する関数
  const getValueAfterColon = (str) => {
    const parts = str.split(":");
    return parts.length > 1 ? parts[1].trim() : null;
  };

  entities.forEach((entity) => {
    if (entity.name) {
      const entityName = entity.name.trim();

      if (entityName.includes("Cardholder")) {
        const value = getValueAfterColon(entityName);
        if (value) cardInfo.name = value;
      } else if (entityName.includes("Card Number")) {
        const value = getValueAfterColon(entityName);
        if (value) cardInfo.number = value;
      } else if (entityName.includes("Expiry")) {
        const value = getValueAfterColon(entityName);
        if (value) cardInfo.expiry = value;
      } else if (entityName.includes("CVV")) {
        const value = getValueAfterColon(entityName);
        if (value) cardInfo.cvv = value;
      }
    }
  });

  return cardInfo;
}

module.exports = {
  extractCardInfo,
};
