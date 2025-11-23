const express = require("express");
const router = express.Router();
const qs = require("qs");
const crypto = require("crypto");
const moment = require("moment");
require("dotenv").config();

const OrderService = require("../services/order.service");
const sortObject = require("../config/sortObject");

const vnp_TmnCode = "SA4T20OD";
const vnp_HashSecret = "RLDACN88A1LORYXOB6VG97KDO4UX8RMI";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = `${process.env.CLIENT_URL}/vnpay-callback`;

// Tạo URL thanh toán VNPay và đơn hàng tạm (PENDING)
router.post("/create-vnpay-url", async (req, res) => {
  const { amount, info } = req.body;

  try {
    const order = await OrderService.createOrder({
      ...info,
      status: "PENDING",
    });
    const orderId = order.orderId.toString();
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const expireDate = moment(date).add(15, "minutes").format("YYYYMMDDHHmmss");

    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnp_TmnCode,
      vnp_Amount: amount * 100,
      vnp_BankCode: "VNBANK",
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
      vnp_CurrCode: "VND",
      vnp_IpAddr:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "127.0.0.1",
      vnp_Locale: "vn",
      vnp_OrderInfo: `ThanhToanDonHang_${orderId}`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_TxnRef: orderId,
    };

    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto
      .createHmac("sha512", vnp_HashSecret)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    sortedParams.vnp_SecureHash = hmac;
    const paymentUrl = `${vnp_Url}?${qs.stringify(sortedParams, {
      encode: false,
    })}`;

    return res.json({ paymentUrl });
  } catch (err) {
    console.error("Lỗi khi tạo đơn PENDING:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Xác minh callback từ VNPay và cập nhật đơn
router.get("/verify-vnpay", async (req, res) => {
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params.vnp_SecureHash;

  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  if (!secureHash || hmac.toUpperCase() !== secureHash.toUpperCase()) {
    return res.status(400).json({ success: false, message: "Sai chữ ký" });
  }

  const txnRef = vnp_Params.vnp_TxnRef;
  const responseCode = vnp_Params.vnp_ResponseCode;

  if (responseCode === "00") {
    try {
      const order = await OrderService.getOrderById(txnRef);
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy đơn hàng" });
      }

      if (order.status !== "PAID") {
        await OrderService.updateOrderStatus(txnRef, "PAID");
      }

      return res.json({ success: true, orderId: txnRef });
    } catch (err) {
      console.error("Lỗi khi cập nhật đơn:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: `Thanh toán thất bại (code ${responseCode})`,
    });
  }
});

module.exports = router;
