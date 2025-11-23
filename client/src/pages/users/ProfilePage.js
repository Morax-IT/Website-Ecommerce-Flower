// ProfilePage.jsx
import { useEffect, useState } from "react";
import { getProfile, updateUser } from "../../services/user.service";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await updateUser(profile);
    alert("Cập nhật thông tin thành công");
  };

  return (
    <div>
      <h2>Hồ sơ cá nhân</h2>
      <input
        name="name"
        value={profile.name}
        onChange={handleChange}
        placeholder="Họ tên"
      />
      <input
        name="email"
        value={profile.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="phone"
        value={profile.phone}
        onChange={handleChange}
        placeholder="Số điện thoại"
      />
      <button onClick={handleSubmit}>Lưu thay đổi</button>
    </div>
  );
}
