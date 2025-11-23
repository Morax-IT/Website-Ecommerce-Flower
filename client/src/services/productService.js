import api from "../api/axios";

// Lấy tất cả sản phẩm
export const getAllProduct = async () => {
  const res = await api.get("/product");
  return res.data;
};

//Lấy tất cả theo category type
export const getProductByCategoryType = async (key) => {
  const res = await api.get(`/product/category-type/${key}`);
  return res.data;
};

//Lấy tất cả theo category id
export const getProductByCategoryId = async (id) => {
  const res = await api.get(`/product/category-id/${id}`);
  return res.data;
};

//Lấy sản phẩm theo id - detail
export const getProductById = async (id) => {
  const res = await api.get(`/product/product-id/${id}`);
  return res.data;
};

//Lấy tất cả image của product-id
export const getProductImage = async (id) => {
  const res = await api.get(`/product/product-image/${id}`);
  return res.data;
};

//Lấy tất cả thuộc tính của product-id
export const getProductVariant = async (id) => {
  const res = await api.get(`/product/product-variant/${id}`);
  return res.data;
};

//Lấy tất cả product đính kèm
export const getProductAddon = async (id) => {
  const res = await api.get(`/product/product-addon/${id}`);
  return res.data;
};
// thêm sản phẩm
export const createProduct = async (data) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/product", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// update
export const updateProduct = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/product/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// gán thêm danh mục
export const addCategoriesToProduct = async (id, categories) => {
  const token = localStorage.getItem("token");
  const res = await api.patch(
    `/product/${id}/categories`,
    { categories },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

//search theo name
export const searchProductByName = async (keyword) => {
  const res = await api.get(`/product/search?q=${encodeURIComponent(keyword)}`);
  return res.data;
};
