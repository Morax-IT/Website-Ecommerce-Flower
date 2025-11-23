import { useState, useEffect } from "react";

export default function CategoryFormModal({
  visible,
  onClose,
  onSave,
  initialData,
}) {
  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState("occasion");
  const [isChild, setIsChild] = useState(false);

  // mapping parent_id theo loại
  const PARENT_MAPPING = {
    occasion: 1,
    type: 2,
    addon: 3,
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCategoryType(initialData.category_type || "occasion");
      setIsChild(initialData.parent_id ? true : false);
    } else {
      setName("");
      setCategoryType("occasion");
      setIsChild(false);
    }
  }, [initialData]);

  if (!visible) return null;

  const handleSubmit = () => {
    let parent_id = null;
    if (isChild) {
      parent_id = PARENT_MAPPING[categoryType];
    }

    onSave({
      name,
      category_type: categoryType,
      parent_id,
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{initialData ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h2>

        <div>
          <label>Tên danh mục:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label>Loại danh mục:</label>
          <select
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
          >
            <option value="occasion">Occasion</option>
            <option value="type">Type</option>
            <option value="addon">Addon</option>
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isChild}
              onChange={(e) => setIsChild(e.target.checked)}
            />
            Là danh mục con?
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <button onClick={handleSubmit}>
            {initialData ? "Cập nhật" : "Thêm mới"}
          </button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
  },
};
