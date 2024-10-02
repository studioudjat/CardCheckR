const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());

// ルートのインポート
const creditCardRoutes = require("./routes/creditCardRoutes.js");
const idCardRoutes = require("./routes/idCardRoutes.js");

// ルートをアプリケーションに適用
app.use(creditCardRoutes);
app.use(idCardRoutes);

// エラー処理
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: err.message });
});

// サーバーの起動
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
