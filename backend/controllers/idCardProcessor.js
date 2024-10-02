const { ImageAnnotatorClient } = require("@google-cloud/vision");

const visionClient = new ImageAnnotatorClient();

async function processIdCard(imageBuffer) {
  // Vision API に画像を送信
  const [result] = await visionClient.textDetection(imageBuffer);
  const detections = result.textAnnotations;

  if (!detections || detections.length === 0) {
    throw new Error("No text detected in the image.");
  }

  // 認識されたテキストを取得
  const fullText = detections[0]?.description || "";

  // console.log(fullText);

  // 改行コードを統一（\nに変換）
  const normalizedFullText = fullText.replace(/\r\n|\r/g, "\n");

  // 名前を抽出
  const nameRegex = /氏名\s*([\s\S]*?)\s*(?:昭和|平成|令和)\d+年\d+月\d+日生/;
  const nameMatch = normalizedFullText.match(nameRegex);

  let name = "名前が見つかりません";
  if (nameMatch) {
    name = nameMatch[1]
      .replace(/\s/g, "") // 空白を除去
      .replace(/[^\u4e00-\u9fa5\u3040-\u30FF]/g, ""); // 日本語以外の文字を除去
  }

  // 生年月日を抽出
  const dateOfBirthMatch = fullText.match(/(昭和|平成|令和)\d+年\d+月\d+日生/);
  const dateOfBirth = dateOfBirthMatch
    ? dateOfBirthMatch[0]
    : "生年月日が見つかりません";

  // 有効期限を抽出（パターンを改良）
  const expiryDateMatch = fullText.match(/(\d{4}年.*?(\d{1,2}月\d{1,2}日))/);
  const expiryDate = expiryDateMatch
    ? expiryDateMatch[1]
    : "有効期限が見つかりません";

  // 抽出された情報をオブジェクトとして返す
  return {
    name,
    dateOfBirth,
    expiryDate,
  };
}

module.exports = {
  processIdCard,
};
