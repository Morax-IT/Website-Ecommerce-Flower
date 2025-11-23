import { useEffect, useState } from "react";
import {
  getProductById,
  getProductImage,
  getProductVariant,
  getProductAddon,
  createProduct,
  updateProduct,
  addCategoriesToProduct,
} from "../../services/productService";
import { getAllCategory } from "../../services/categoryService";
import useUploadImage from "../../hooks/useUploadImage";

const ProductForm = ({ mode = "create", productId = null, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    avatar: "",
    base_price: 0,
    discount_percent: 0,
    images: [],
    variants: [],
    addons: [],
    categories: [],
  });

  const [allCategories, setAllCategories] = useState([]);

  const {
    preview,
    uploading,
    error,
    uploadAvatar,
    uploadGallery,
    deleteImage,
    clearError,
  } = useUploadImage();

  useEffect(() => {
    const loadInit = async () => {
      try {
        const cats = await getAllCategory();
        setAllCategories(cats);

        if (mode === "edit" && productId) {
          const [product, images, variants, addons] = await Promise.all([
            getProductById(productId),
            getProductImage(productId),
            getProductVariant(productId),
            getProductAddon(productId),
          ]);
          setForm({
            ...product[0],
            images,
            variants,
            addons,
            categories: [],
          });
        }
      } catch (err) {
        console.error("Error loading form data:", err);
      }
    };
    loadInit();
  }, [mode, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        base_price: parseFloat(form.base_price),
        discount_percent: parseFloat(form.discount_percent),
        images: form.images.map((img, i) => ({
          image_url: img.image_url,
          sort_order: img.sort_order ?? i + 1,
        })),
      };

      if (mode === "create") {
        await createProduct(payload);
        alert("Tạo thành công");
      } else {
        await updateProduct(productId, payload);
        alert("Cập nhật thành công");
      }

      if (form.categories.length > 0 && mode === "edit") {
        await addCategoriesToProduct(productId, form.categories);
      }

      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    }
  };

  const handleArrayChange = (field, index, subField, value) => {
    const updated = [...form[field]];
    updated[index][subField] = value;
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  const handleAddArrayItem = (field, defaultObj) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], defaultObj] }));
  };

  const handleRemoveArrayItem = (field, index) => {
    const updated = [...form[field]];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  return (
    <div>
      <h2>{mode === "edit" ? "Chỉnh sửa" : "Tạo mới"} sản phẩm</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Tên sản phẩm"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Mô tả"
      />

      {/* Avatar upload */}
      <label>Ảnh đại diện:</label>
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          clearError();
          const file = e.target.files[0];
          const url = await uploadAvatar(file);
          if (url) setForm((prev) => ({ ...prev, avatar: url }));
        }}
      />
      {preview && <img src={preview} width={100} alt="avatar" />}
      {form.avatar && !preview && (
        <img
          src={`http://localhost:8080${form.avatar}`}
          alt="Ảnh sản phẩm"
          width={100}
        />
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="number"
        name="base_price"
        value={form.base_price}
        onChange={handleChange}
        placeholder="Giá gốc"
      />
      <input
        type="number"
        name="discount_percent"
        value={form.discount_percent}
        onChange={handleChange}
        placeholder="Giảm giá (%)"
      />

      {/* Gallery Upload */}
      <h4>📷 Ảnh phụ</h4>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={async (e) => {
          clearError();
          const files = Array.from(e.target.files);
          const urls = await uploadGallery(files);
          const newImages = urls.map((url, i) => ({
            image_url: url,
            sort_order: form.images.length + i + 1,
          }));
          setForm((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages],
          }));
        }}
      />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {form.images.map((img, i) => (
          <div key={img.image_url} style={{ textAlign: "center" }}>
            <img
              src={`http://localhost:8080${img.image_url}`}
              alt=""
              width={80}
              height={80}
              style={{ objectFit: "cover", borderRadius: 6 }}
            />
            <div>#{img.sort_order}</div>
            <button
              onClick={async () => {
                const filename = img.image_url.split("/uploads/")[1];
                await deleteImage(filename);
                const updated = [...form.images];
                updated.splice(i, 1);
                setForm((prev) => ({
                  ...prev,
                  images: updated.map((img, idx) => ({
                    ...img,
                    sort_order: idx + 1,
                  })),
                }));
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>

      <h4>🎨 Biến thể</h4>
      {form.variants.map((v, i) => (
        <div key={i}>
          <select
            value={v.variant_type}
            onChange={(e) =>
              handleArrayChange("variants", i, "variant_type", e.target.value)
            }
          >
            <option value="color">Màu</option>
            <option value="scent">Mùi</option>
          </select>
          <input
            value={v.variant_value}
            onChange={(e) =>
              handleArrayChange("variants", i, "variant_value", e.target.value)
            }
            placeholder="Giá trị"
          />
          <button onClick={() => handleRemoveArrayItem("variants", i)}>
            X
          </button>
        </div>
      ))}
      <button
        onClick={() =>
          handleAddArrayItem("variants", {
            variant_type: "color",
            variant_value: "",
          })
        }
      >
        + Thêm biến thể
      </button>

      <h4>🎁 Addon</h4>
      {form.addons.map((a, i) => (
        <div key={i}>
          <input
            value={a.addon_name}
            onChange={(e) =>
              handleArrayChange("addons", i, "addon_name", e.target.value)
            }
            placeholder="Tên addon"
          />
          <input
            type="number"
            value={a.extra_price}
            onChange={(e) =>
              handleArrayChange("addons", i, "extra_price", e.target.value)
            }
            placeholder="Giá thêm"
          />
          <button onClick={() => handleRemoveArrayItem("addons", i)}>X</button>
        </div>
      ))}
      <button
        onClick={() =>
          handleAddArrayItem("addons", { addon_name: "", extra_price: 0 })
        }
      >
        + Thêm addon
      </button>

      <h4>📂 Danh mục</h4>
      <select
        multiple
        value={form.categories.map((c) => c.category_id)}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions).map((o) => ({
            category_id: parseInt(o.value),
            category_type: o.dataset.type,
          }));
          setForm((prev) => ({ ...prev, categories: selected }));
        }}
      >
        {allCategories.map((c) => (
          <option key={c.id} value={c.id} data-type={c.category_type}>
            [{c.category_type}] {c.name}
          </option>
        ))}
      </select>

      <br />
      <br />
      <button onClick={handleSubmit} disabled={uploading}>
        {uploading
          ? "Đang upload ảnh..."
          : mode === "edit"
          ? "Lưu chỉnh sửa"
          : "Tạo sản phẩm"}
      </button>
    </div>
  );
};

export default ProductForm;
