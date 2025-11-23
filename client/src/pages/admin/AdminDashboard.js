export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <h1>Dashboard Admin</h1>
      <p>
        Xin chào {user?.name} ({user?.role})
      </p>
    </div>
  );
}
