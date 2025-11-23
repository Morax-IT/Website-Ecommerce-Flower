import api from "../api/axios";

// Lấy tất cả đơn hàng (admin)
export const getAllOrders = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Lấy đơn hàng theo userId (người dùng xem đơn của mình)
export const getOrdersByUserId = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/order/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/order", orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Cập nhật đơn hàng (chỉ update các field như status, note, delivery_time...)
export const updateOrder = async (orderId, updateData) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/order/${orderId}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Lấy mã giảm giá theo code
export const getPromotionByCode = async (code) => {
  const res = await api.get(`/product/promotion/${code}`);
  return res.data;
};
