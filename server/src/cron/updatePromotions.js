const cron = require("node-cron");
const db = require("../config/database.config");

/**
 * Hàm cập nhật khuyến mãi hết hạn
 * Gọi được cả khi start server & từ cron job
 */
async function updateExpiredPromotions() {
  console.log("🔄 Kiểm tra & cập nhật khuyến mãi hết hạn...");

  await db.query(`
    UPDATE promotions 
    SET status = 'expired'
    WHERE valid_to IS NOT NULL 
      AND valid_to < NOW()
      AND status = 'active'
  `);

  console.log("✅ Đã cập nhật khuyến mãi hết hạn.");
}

/**
 * Cron job chạy mỗi ngày lúc 0h
 */
function startPromotionCronJob() {
  cron.schedule("0 0 * * *", async () => {
    console.log("⏳ Cron job chạy: cập nhật khuyến mãi hết hạn...");
    await updateExpiredPromotions();
  });
}

module.exports = {
  updateExpiredPromotions,
  startPromotionCronJob,
};
