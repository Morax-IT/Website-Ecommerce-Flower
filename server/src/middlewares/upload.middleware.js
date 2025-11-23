const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const UPLOAD_DIR = path.join(__dirname, "../resources/uploads");

// Tạo thư mục nếu chưa có
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
// Kiểm tra định dạng file (chỉ ảnh)
const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload ảnh"), false);
  }
};
const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter: imageFilter,
});
const processSingleImage = async (buffer, filename, width = 800) => {
  const outputPath = path.join(UPLOAD_DIR, filename);
  await sharp(buffer)
    .resize({ width })
    .jpeg({ quality: 80 })
    .toFile(outputPath);
  return filename;
};

module.exports = {
  upload,
  processSingleImage,
  UPLOAD_DIR,
};
