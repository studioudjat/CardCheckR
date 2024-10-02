const { ImageAnnotatorClient } = require("@google-cloud/vision");

const visionClient = new ImageAnnotatorClient();

async function processCreditCard(imageBuffer) {
  // Vision APIを使用してテキスト検出
  const [result] = await visionClient.textDetection(imageBuffer);
  const detections = result.textAnnotations;

  if (!detections || detections.length === 0) {
    throw new Error("No text detected in the image.");
  }

  // 認識されたテキストを取得
  const fullText = detections[0]?.description || "";

  // console.log(fullText);

  // 改行コードを統一
  const normalizedFullText = fullText.replace(/\r\n|\r/g, "\n");

  // 処理を容易にするため、テキストを行に分割
  const lines = normalizedFullText.split("\n").map((line) => line.trim());

  // カード番号の抽出（13〜16桁の数字）
  const cardNumberMatch = normalizedFullText.match(/\b(?:\d[ -]*?){13,16}\b/g);
  let cardNumber = "Card number not found";
  if (cardNumberMatch) {
    // スペースとハイフンを削除
    cardNumber = cardNumberMatch[0].replace(/[ -]/g, "");
  }

  // 有効期限の抽出
  let expiryDate = "Expiry date not found";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 「GOOD」または「VALID」を含む行をチェック
    if (/GOOD|VALID/i.test(line)) {
      // 同じ行に日付があるかチェック
      const expiryMatch = line.match(
        /(GOOD|VALID)[^\d]*([0-1]?[0-9])[/\-]?([0-9]{2,4})/i
      );
      if (expiryMatch) {
        expiryDate = `${expiryMatch[2].padStart(2, "0")}/${expiryMatch[3]}`;
        break;
      } else {
        // 次の行に日付があるかチェック
        const nextLine = lines[i + 1] || "";
        const nextLineMatch = nextLine.match(/([0-1]?[0-9])[/\-]?([0-9]{2,4})/);
        if (nextLineMatch) {
          expiryDate = `${nextLineMatch[1].padStart(2, "0")}/${
            nextLineMatch[2]
          }`;
          break;
        }
      }
    }

    // 「GOOD THRU」や「VALID THRU」を含む行をチェック
    if (/GOOD\s*THRU|VALID\s*THRU/i.test(line)) {
      // 次の行に日付があるかチェック
      const nextLine = lines[i + 1] || "";
      const expiryMatch = nextLine.match(/([0-1]?[0-9])[/\-]?([0-9]{2,4})/);
      if (expiryMatch) {
        expiryDate = `${expiryMatch[1].padStart(2, "0")}/${expiryMatch[2]}`;
        break;
      }
    }
  }

  // 有効期限が見つからない場合、行全体をチェック
  if (expiryDate === "Expiry date not found") {
    for (const line of lines) {
      const expiryMatch = line.match(/^([0-1]?[0-9])[/\-]([0-9]{2,4})$/);
      if (expiryMatch) {
        expiryDate = `${expiryMatch[1].padStart(2, "0")}/${expiryMatch[2]}`;
        break;
      }
    }
  }

  // 有効期限をMM/YY形式に正規化
  if (expiryDate && expiryDate !== "Expiry date not found") {
    expiryDate = expiryDate.replace(/\-/g, "/");
    // 年がYYYYの場合、YYに変換
    expiryDate = expiryDate.replace(
      /(\d{2})\/(\d{4})/,
      (match, p1, p2) => `${p1}/${p2.slice(-2)}`
    );
  }

  // カードホルダー名の抽出
  const ignorePatterns = [
    /\b(?:credit|debit|business|card|valid|thru|good|from|until|month|year|date|bank|member|since|electron|platinum|gold|silver|classic|business|corporate|visa|[0-9]{2,4})\b/i,
    /^[^A-Za-z]+$/, // 文字が含まれない行
    /^[A-Za-z]\b/, // 単一の文字
    /[^\w\s]/, // 特殊文字を含む行
    /^\s*$/, // 空行
  ];

  const nameCandidates = lines.filter((line) => {
    return (
      !ignorePatterns.some((pattern) => pattern.test(line)) && line.length > 5 // 短すぎる行を除外
    );
  });

  // アルファベット文字数が最も多い行を名前として仮定
  let cardHolderName = "Cardholder name not found";
  if (nameCandidates.length > 0) {
    cardHolderName = nameCandidates.reduce((a, b) => {
      const aLetters = (a.match(/[A-Za-z]/g) || []).length;
      const bLetters = (b.match(/[A-Za-z]/g) || []).length;
      return aLetters > bLetters ? a : b;
    });
  }

  // セキュリティコードの抽出（3桁の数字）
  let securityCode = "Security code not found";

  // 3桁の数字を抽出
  const potentialCodes = normalizedFullText.match(/\b\d{3}\b/g);

  if (potentialCodes && potentialCodes.length > 0) {
    // 既知の数字を除外（カード番号や有効期限の一部など）
    const excludeNumbers = [
      ...(cardNumber.match(/\d{3}/g) || []),
      ...(expiryDate.match(/\d{2}/g) || []),
      ...(normalizedFullText.match(/\b1[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}\b/g) ||
        []),
    ].flatMap((num) => num.match(/\d{3}/g) || []);

    const filteredCodes = potentialCodes.filter(
      (code) => !excludeNumbers.includes(code)
    );

    if (filteredCodes.length > 0) {
      // セキュリティコードに関連するキーワードを含む行を優先
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/CVV|CVC|SECURITY CODE|SEC CODE|Truth Us/i.test(line)) {
          const codeMatch = line.match(/\b(\d{3})\b/);
          if (codeMatch) {
            securityCode = codeMatch[1];
            break;
          }
        }
      }
      // 見つからない場合、最初の候補を使用
      if (securityCode === "Security code not found") {
        securityCode = filteredCodes[0];
      }
    }
  }

  // 抽出した情報を返す
  return {
    cardNumber,
    expiryDate,
    cardHolderName,
    securityCode,
  };
}

module.exports = {
  processCreditCard,
};
