import { useEffect, useState } from "react";
import { getAllProduct } from "../../services/productService";
import { useNavigate } from "react-router-dom";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const data = await getAllProduct();
      setProducts(data);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="admin-product-page">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>📦 Quản lý sản phẩm</h2>
        <button onClick={() => navigate("/admin/product/create")}>
          + Thêm sản phẩm
        </button>
      </div>

      <table
        border="1"
        cellPadding={8}
        style={{ width: "100%", marginTop: 16 }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Giảm</th>
            <th>Rating</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                Không có sản phẩm nào
              </td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {p.avatar ? (
                  <img
                    src={`http://localhost:8080${p.avatar}`}
                    alt=""
                    width={50}
                    height={50}
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.base_price.toLocaleString()} đ</td>
              <td>{p.discount_percent}%</td>
              <td>
                {p.rating_avg} ({p.total_reviews})
              </td>
              <td>
                <button onClick={() => navigate(`/admin/product/edit/${p.id}`)}>
                  Sửa
                </button>
                {/* Optional: Xoá */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductPage;
