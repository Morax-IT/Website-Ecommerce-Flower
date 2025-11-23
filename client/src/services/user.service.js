import api from "../api/axios";

// Lấy tất cả user
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Đăng nhập (truyền email & password)
export const login = async (email, password) => {
  const res = await api.post("/user/login", { email, password });
  return res.data; // { success, message, token, user }
};

// Đăng ký (truyền name, email, phone, password)
export const register = async (name, email, phone, password) => {
  const res = await api.post("/user/register", {
    name,
    email,
    phone,
    password,
  });
  return res.data; // { success, message }
};

// Lấy thông tin người dùng hiện tại
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Cập nhật thông tin người dùng
export const updateUser = async (updateData) => {
  const token = localStorage.getItem("token");
  const res = await api.put("/user/update", updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Đổi mật khẩu
export const changePassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem("token");
  const res = await api.put(
    "/user/change-password",
    { oldPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Lấy danh sách địa chỉ của người dùng
export const getUserAddresses = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/user/addresses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Thêm địa chỉ mới
export const addUserAddress = async (addressData) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/user/addresses", addressData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Cập nhật địa chỉ
export const updateUserAddress = async (id, updateData) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/user/addresses/${id}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Xóa địa chỉ
export const deleteUserAddress = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/user/addresses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
