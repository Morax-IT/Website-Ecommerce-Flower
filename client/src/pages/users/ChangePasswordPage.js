import { useState } from "react";
import { changePassword } from "../../services/user.service";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword) return alert("Nhập đủ cả 2 mật khẩu");
    await changePassword(oldPassword, newPassword);
    alert("Đổi mật khẩu thành công");
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div>
      <h2>Đổi mật khẩu</h2>
      <input
        type="password"
        placeholder="Mật khẩu cũ"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Lưu thay đổi</button>
    </div>
  );
}
