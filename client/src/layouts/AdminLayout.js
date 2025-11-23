import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "200px",
          background: "#222",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <Link to="/admin/dashboard" style={{ color: "#fff" }}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" style={{ color: "#fff" }}>
                Quản lý danh mục
              </Link>
            </li>
            <li>
              <Link to="/admin/products" style={{ color: "#fff" }}>
                Quản lý sản phẩm
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Nội dung chính */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet /> {/* Render trang con */}
      </main>
    </div>
  );
}
