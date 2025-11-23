const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./config/database.config");

const PORT = process.env.PORT || 8080;
const route = require("./routes/api.route");

// ✅ Import cron
const {
  updateExpiredPromotions,
  startPromotionCronJob,
} = require("./cron/updatePromotions");

const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Public ảnh từ thư mục resources/uploads
app.use("/uploads", express.static(path.join(__dirname, "resources/uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Định tuyến router
route(app);
// Gọi update ngay khi start server
updateExpiredPromotions();

// Bật cron job chạy hằng ngày
startPromotionCronJob();
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
