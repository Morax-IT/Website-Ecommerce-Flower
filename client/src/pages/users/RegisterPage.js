import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/user.service";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await register(name, email, phone, password);
      setMessage(res.message);

      if (res.success) {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        navigate("/login");
      }
    } catch (err) {
      setMessage("Lỗi server hoặc kết nối!");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Đăng ký tài khoản</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Họ tên:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Số điện thoại:</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}
