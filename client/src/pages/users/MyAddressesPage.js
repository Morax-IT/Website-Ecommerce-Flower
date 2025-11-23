import { useEffect, useState } from "react";
import {
  getUserAddresses,
  deleteUserAddress,
} from "../../services/user.service";
import { useNavigate } from "react-router-dom";

export default function MyAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      const data = await getUserAddresses();
      setAddresses(data);
    };
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá địa chỉ này?")) {
      await deleteUserAddress(id);
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  return (
    <div>
      <h2>Địa chỉ giao hàng</h2>
      <ul>
        {addresses.map((addr) => (
          <li key={addr.id}>
            {addr.address} - {addr.ward}, {addr.district}, {addr.province}
            <button onClick={() => handleDelete(addr.id)}>Xóa</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/add-address")}>Thêm địa chỉ</button>
    </div>
  );
}
