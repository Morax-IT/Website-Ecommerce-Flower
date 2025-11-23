import { useEffect, useState } from "react";
import { getOrdersByUserId, updateOrder } from "../../services/orderService";
import { useAuth } from "../../contexts/AuthContext";

function MyOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user.id;
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersByUserId(userId);
        setOrders(data);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Bạn có chắc muốn hủy đơn này? ");
    if (!confirmCancel) return;

    try {
      await updateOrder(id, { status: "cancelled" });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: "cancelled" } : order
        )
      );
      alert("Đã hủy đơn hàng.");
    } catch (err) {
      console.error("Lỗi khi hủy đơn:", err);
      alert("Không thể hủy đơn hàng.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Đơn hàng của tôi</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Thời gian đặt hàng</th>
            <th>Tổng giá</th>
            <th>Ghi chú</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.created_at}</td>
              <td>{order.total_price.toLocaleString()} VND</td>
              <td>{order.note || "-"}</td>
              <td>{order.status}</td>
              <td>
                {order.status === "pending" && (
                  <button onClick={() => handleCancel(order.id)}>
                    Huỷ đơn
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyOrderPage;
