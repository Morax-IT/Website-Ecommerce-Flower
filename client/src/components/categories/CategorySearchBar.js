import { useState } from "react";

export default function CategorySearchBar({ onSearch }) {
  const [searchType, setSearchType] = useState("");
  const [searchName, setSearchName] = useState("");

  const handleSearch = () => {
    onSearch(searchType, searchName);
  };

  const handleReset = () => {
    setSearchType("");
    setSearchName("");
    onSearch();
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Tìm kiếm danh mục</h3>
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      >
        <option value="">-- Tất cả loại --</option>
        <option value="occasion">Occasion</option>
        <option value="type">Type</option>
        <option value="addon">Addon</option>
      </select>
      <input
        type="text"
        placeholder="Nhập tên cần tìm..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <button onClick={handleSearch}>Tìm kiếm</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
