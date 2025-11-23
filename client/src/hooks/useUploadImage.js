import { useState } from "react";
import api from "../api/axios";

const MAX_FILE_SIZE_MB = 2;

const useUploadImage = () => {
  const [preview, setPreview] = useState(null); // avatar preview
  const [galleryPreview, setGalleryPreview] = useState([]); // [FileReader URL]
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Check file size
  const isValidFile = (file) => {
    const maxSize = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (!file.type.startsWith("image/")) {
      setError("Chỉ được chọn file ảnh");
      return false;
    }
    if (file.size > maxSize) {
      setError(`Ảnh vượt quá ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  // ✅ Upload 1 ảnh
  const uploadAvatar = async (file) => {
    if (!isValidFile(file)) return null;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.url; // "/uploads/abc.jpg"
    } catch (err) {
      setError(`Lỗi upload ảnh: ${err}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ✅ Upload nhiều ảnh
  const uploadGallery = async (files) => {
    const validFiles = files.filter(isValidFile);
    if (validFiles.length === 0) return [];

    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreview((prev) => [...prev, ...previews]);

    const formData = new FormData();
    validFiles.forEach((file) => formData.append("images", file));

    setUploading(true);
    try {
      const res = await api.post("/upload/multi", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.urls; // ["/uploads/..."]
    } catch (err) {
      setError("Lỗi upload ảnh");
      return [];
    } finally {
      setUploading(false);
    }
  };

  // ✅ Xoá ảnh
  const deleteImage = async (filename) => {
    try {
      await api.delete("/upload/delete", {
        data: { filename },
      });
    } catch (err) {
      console.error("Lỗi xoá ảnh:", err);
    }
  };

  return {
    uploading,
    error,
    preview,
    galleryPreview,
    uploadAvatar,
    uploadGallery,
    deleteImage,
    clearError: () => setError(""),
  };
};

export default useUploadImage;
