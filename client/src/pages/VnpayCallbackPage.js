import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

function VnpayCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { removeFromCart } = useCart();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return; //  nếu đã xử lý thì thoát
    hasProcessed.current = true;
    const responseCode = searchParams.get("vnp_ResponseCode");

    if (responseCode === "00") {
      const pendingCart = JSON.parse(
        localStorage.getItem("pendingCart") || "[]"
      );
      pendingCart.forEach((item) => {
        removeFromCart(item.product_id);
      });
      localStorage.removeItem("pendingCart");

      alert("Đặt hàng thành công!");
      navigate("/my-orders");
    } else {
      alert("Thanh toán thất bại hoặc bị hủy.");
      navigate("/");
    }
  }, [searchParams, navigate, removeFromCart]);

  return <div>Đang xác minh thanh toán...</div>;
}

export default VnpayCallbackPage;
