import api from "../api/axios";

// Lấy tất cả khu vực giao hàng
export const getAllRegion = async () => {
  const res = await api.get("/region");
  return res.data;
};

// Xem detail
export const detailRegion = async (id) => {
  const res = await api.get(`/region/${id}`);
  return res.data;
};

// thêm khu vực giao hàng
export const createRegion = async (data) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/region", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// update khu vực giao hàng
export const updateRegion = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/region/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// delete khu vực giao hàng
export const deleteRegion = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/region/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
