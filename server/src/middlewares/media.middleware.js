const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Thư mục lưu media riêng cho review
const REVIEW_MEDIA_DIR = path.join(__dirname, "../resources/review_media");

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(REVIEW_MEDIA_DIR)) {
  fs.mkdirSync(REVIEW_MEDIA_DIR, { recursive: true });
}

// Chỉ chấp nhận ảnh và video
const mediaFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "video/mp4",
    "video/webm",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận ảnh hoặc video!"), false);
  }
};

const multerStorage = multer.memoryStorage();

const uploadReviewMedia = multer({
  storage: multerStorage,
  fileFilter: mediaFilter,
});

const processReviewMedia = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
  const outputPath = path.join(REVIEW_MEDIA_DIR, filename);

  const isImage = file.mimetype.startsWith("image");

  if (isImage) {
    await sharp(file.buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
  } else {
    fs.writeFileSync(outputPath, file.buffer);
  }

  return { filename, type: isImage ? "image" : "video" };
};

module.exports = {
  uploadReviewMedia,
  processReviewMedia,
  REVIEW_MEDIA_DIR,
};
