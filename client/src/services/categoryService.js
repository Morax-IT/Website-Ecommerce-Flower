import api from "../api/axios";

// Lấy tất cả
export const getAllCategory = async () => {
  const res = await api.get("/category");
  return res.data;
};

// Lấy danh mục cấp 1
export const fetchLevelOneCategories = async () => {
  const res = await api.get("/category/type");
  return res.data;
};

// Lấy danh mục con theo key (OCCASION | TYPE | ADDON)
export const fetchChildrenCategories = async (key) => {
  const res = await api.get(`/category/children/${key}`);
  return res.data;
};

// Tạo category (chỉ admin)
export const createCategory = async (data) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/category", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Cập nhật category
export const updateCategory = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/category/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Search category theo type + name
export const searchCategories = async (type, name) => {
  const params = {};
  if (type) params.type = type;
  if (name) params.name = name;

  const res = await api.get("/category/search", { params });
  return res.data;
};
