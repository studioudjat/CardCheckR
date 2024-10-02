const { processCreditCard } = require("../controllers/creditCardProcessor.js"); // creditCardProcessorをインポート
const multer = require("multer");
const express = require("express");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/process-credit-card", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const extractedInfo = await processCreditCard(req.file.buffer);
    res.json(extractedInfo);
  } catch (error) {
    console.error("Error processing credit card image:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
