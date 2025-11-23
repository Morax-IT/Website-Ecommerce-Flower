import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VNPayReturn() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vnp_Response = Object.fromEntries(params.entries());

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/verify-vnpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vnp_Response),
        });
        const data = await res.json();

        if (data.success) {
          alert("Thanh toán thành công! Đơn hàng đã được tạo.");
          navigate("/my-orders");
        } else {
          alert("Thanh toán thất bại: " + data.message);
          navigate("/");
        }
      } catch (err) {
        console.error("Lỗi xác minh VNPay:", err);
        alert("Không thể xác minh kết quả thanh toán.");
        navigate("/");
      }
    };

    verifyPayment();
  }, [navigate]);

  return null;
}
