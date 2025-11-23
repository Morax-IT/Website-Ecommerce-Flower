import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useMemo, useEffect, useState } from "react";
import { createOrder, getPromotionByCode } from "../../services/orderService";
import { getAllRegion } from "../../services/regionService";
import { useAuth } from "../../contexts/AuthContext";

import ProductList from "../../components/orders/ProductList";
import RegionSelector from "../../components/orders/RegionSelector";
import PaymentSelector from "../../components/orders/PaymentSelector";
import PromotionInput from "../../components/orders/PromotionInput";
import OrderNoteInput from "../../components/orders/OrderNoteInput";
import OrderSummary from "../../components/orders/OrderSummary";
import { useCart } from "../../contexts/CartContext";
import api from "../../api/axios";

export default function CreateOrderPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [, setSelectAll] = useState(false);
  const [promotionCode, setPromotionCode] = useState("");
  const [promotion, setPromotion] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promotionError, setPromotionError] = useState("");
  const [regions, setRegions] = useState([]);
  const [regionId, setRegionId] = useState(1);
  const [shippingFee, setShippingFee] = useState(30000);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");
  const { removeFromCart } = useCart();

  const userId = user?.id;
  const products = useMemo(() => state?.products || [], [state]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!userId || products.length === 0) {
      alert("Không có sản phẩm để đặt hàng.");
      navigate("/");
    }
  }, [userId, products, navigate, isAuthLoading]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await getAllRegion();
        setRegions(data);
      } catch (error) {
        console.error("Lỗi khi load khu vực giao hàng:", error);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    const selected = regions.find((r) => r.id === regionId);
    if (selected) {
      setShippingFee(Number(selected.shipping_fee));
    }
  }, [regionId, regions]);

  const toMySQLDatetime = (date) =>
    new Date(date).toISOString().slice(0, 19).replace("T", " ");

  const handleSelectProduct = (index) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleToggleAll = () => {
    if (selectedIndexes.length === products.length) {
      setSelectedIndexes([]);
      setSelectAll(false);
    } else {
      setSelectedIndexes(products.map((_, i) => i));
      setSelectAll(true);
    }
  };

  const selectedProducts = selectedIndexes.map((i) => products[i]);

  const calculateSubtotal = (items) =>
    items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculateTotalPrice = (items) => {
    const subtotal = calculateSubtotal(items);
    return subtotal - discountAmount + shippingFee;
  };

  const handleCreateOrder = async () => {
    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để đặt hàng.");
      return;
    }

    const orderData = {
      user_id: userId,
      region_id: regionId,
      promotion_id: promotion?.id || null,
      shipping_fee: shippingFee,
      total_price: calculateTotalPrice(selectedProducts),
      payment_method: paymentMethod,
      delivery_time: toMySQLDatetime(new Date()),
      note,
      items: selectedProducts.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        selected_variants: item.selected_variants || {},
        selected_addons: item.selected_addons || [],
        price: item.price,
      })),
    };

    // VNPAY
    if (paymentMethod === "VNPay") {
      try {
        localStorage.setItem("pendingCart", JSON.stringify(selectedProducts));
        const res = await api.post("/create-vnpay-url", {
          amount: calculateTotalPrice(selectedProducts),
          info: orderData,
        });
        window.location.href = res.data.paymentUrl;
      } catch (err) {
        console.error("Lỗi tạo thanh toán VNPay:", err);
        alert("Không thể khởi tạo thanh toán VNPay.");
      }
      return;
    }
    console.log("======toi log");

    // Các phương thức thanh toán còn lại
    try {
      await createOrder(orderData);
      alert("Đặt hàng thành công!");
      selectedProducts.forEach((item) => {
        removeFromCart(item.product_id);
      });
      navigate("/my-orders");
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      alert("Đặt hàng thất bại.");
    }
  };

  const validatePromotionCode = async () => {
    try {
      const data = await getPromotionByCode(promotionCode.trim());
      if (!data || data.length === 0) {
        setPromotionError("Mã không tồn tại.");
        setPromotion(null);
        setDiscountAmount(0);
        return;
      }
      const promo = data[0];
      const now = new Date();
      const validFrom = new Date(promo.valid_from);
      const validTo = new Date(promo.valid_to);

      if (
        promo.status !== "active" ||
        promo.used_count >= promo.max_usage ||
        now < validFrom ||
        now > validTo
      ) {
        setPromotionError("Mã đã hết hạn hoặc vượt quá lượt sử dụng.");
        setPromotion(null);
        setDiscountAmount(0);
        return;
      }

      const total = calculateSubtotal(selectedProducts);
      if (total < promo.min_order_value) {
        setPromotionError(
          `Đơn hàng phải từ ${promo.min_order_value.toLocaleString()}đ để dùng mã.`
        );
        setPromotion(null);
        setDiscountAmount(0);
        return;
      }

      let discount = 0;
      if (promo.discount_type === "percent") {
        discount = (total * promo.discount_value) / 100;
      } else {
        discount = promo.discount_value;
      }

      setPromotion(promo);
      setDiscountAmount(discount);
      setPromotionError("");
    } catch (err) {
      console.error("Lỗi kiểm tra mã:", err);
      setPromotionError("Không thể kiểm tra mã.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ProductList
        products={products}
        selectedIndexes={selectedIndexes}
        onToggleProduct={handleSelectProduct}
        onToggleAll={handleToggleAll}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <RegionSelector
          regions={regions}
          regionId={regionId}
          onChange={setRegionId}
        />

        <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
      </Box>

      <PromotionInput
        value={promotionCode}
        onChange={setPromotionCode}
        onApply={validatePromotionCode}
        error={promotionError}
        promotion={promotion}
        discountAmount={discountAmount}
      />

      <OrderNoteInput note={note} onChange={setNote} />

      <OrderSummary
        items={selectedProducts}
        discountAmount={discountAmount}
        shippingFee={shippingFee}
        calculateSubtotal={calculateSubtotal}
      />

      {selectedProducts.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateOrder}
          sx={{ mt: 2 }}
        >
          Đặt hàng các sản phẩm đã chọn ({selectedProducts.length})
        </Button>
      )}
    </Box>
  );
}
