const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const {
  upload,
  processSingleImage,
  UPLOAD_DIR,
} = require("../middlewares/upload.middleware");

// Upload 1 ảnh
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const ext = ".jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    await processSingleImage(file.buffer, filename);

    const url = `/uploads/${filename}`;
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Xoá ảnh cũ
router.delete("/delete", (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "Thiếu tên file" });

  const filePath = path.join(UPLOAD_DIR, filename);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(404).json({ error: "Không tìm thấy file" });
    res.json({ message: "Đã xoá file" });
  });
});

// Upload nhiều ảnh
router.post("/multi", upload.array("images", 10), async (req, res) => {
  try {
    const urls = [];
    for (let file of req.files) {
      const filename = `${Date.now()}-${Math.floor(Math.random() * 1e6)}.jpg`;
      await processSingleImage(file.buffer, filename);
      urls.push(`/uploads/${filename}`);
    }
    res.json({ urls });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
