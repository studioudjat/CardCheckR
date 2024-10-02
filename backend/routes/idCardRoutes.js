const { processIdCard } = require("../controllers/idCardProcessor.js"); // idCardProcessorをインポート
const multer = require("multer");
const express = require("express");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/process-id-card", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const extractedInfo = await processIdCard(req.file.buffer);
    res.json(extractedInfo);
  } catch (error) {
    console.error("Error processing ID card image:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
