const category = require("./category.route");
const product = require("./product.route");
const user = require("./user.route");
const review = require("./review.route");
const upload = require("./upload.route");
const region = require("./region.route");
const order = require("./order.route");
const vnpayRoutes = require("./vnpay.routes");

const router = (app) => {
  app.use("/api/category", category);
  app.use("/api/product", product);
  app.use("/api/user", user);
  app.use("/api/review", review);
  app.use("/api/upload", upload);
  app.use("/api/region", region);
  app.use("/api/order", order);
  app.use("/api", vnpayRoutes);
};

module.exports = router;
