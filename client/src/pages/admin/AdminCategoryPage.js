import { useEffect, useState } from "react";
import {
  getAllCategory,
  searchCategories,
  createCategory,
  updateCategory,
} from "../../services/categoryService";
import CategorySearchBar from "../../components/categories/CategorySearchBar";
import CategoryFormModal from "../../components/categories/CategoryFormModal";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null); // dữ liệu đang sửa

  const loadCategories = async () => {
    const data = await getAllCategory();
    console.log(`data: ${data}`);
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSearch = async (searchType, searchName) => {
    // ✅ Nếu không có filter => load all
    if (!searchType && !searchName) {
      const data = await getAllCategory();
      setCategories(data);
      return;
    }

    // ✅ Có filter => search
    const data = await searchCategories(searchType, searchName);
    setCategories(data);
  };

  const handleSave = async (formData) => {
    if (editingData) {
      await updateCategory(editingData.id, formData);
      alert("Cập nhật thành công!");
    } else {
      await createCategory(formData);
      alert("Tạo mới thành công!");
    }
    setShowModal(false);
    setEditingData(null);
    loadCategories();
  };

  const handleAdd = () => {
    setEditingData(null);
    setShowModal(true);
  };

  const handleEdit = (cat) => {
    setEditingData(cat);
    setShowModal(true);
  };

  return (
    <div>
      <h1>Quản lý danh mục</h1>

      {/* ✅ Thanh tìm kiếm */}
      <CategorySearchBar onSearch={handleSearch} />

      <button onClick={handleAdd}>➕ Thêm danh mục</button>

      {/* Danh sách */}
      <table border="1" cellPadding="8" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Loại</th>
            <th>Cha/Con</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.category_type}</td>
              <td>{cat.parent_id ? `Con của ${cat.parent_id}` : "Cha"}</td>
              <td>
                <button onClick={() => handleEdit(cat)}>✏️ Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Modal form thêm/sửa */}
      <CategoryFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editingData}
      />
    </div>
  );
}
