import api from "../api/axios";

// Upload 1 ảnh (avatar)
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const token = localStorage.getItem("token");
  const res = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.url; // => "/uploads/abc.jpg"
};

// Upload nhiều ảnh (gallery)
export const uploadGallery = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const token = localStorage.getItem("token");
  const res = await api.post("/upload/multi", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.urls; // => ["/uploads/img1.jpg", ...]
};

// Xoá ảnh
export const deleteImage = async (filename) => {
  const token = localStorage.getItem("token");
  const res = await api.delete("/upload/delete", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { filename },
  });
  return res.data;
};
