// components/orders/OrderSummary.jsx
import { Box, Typography } from "@mui/material";

export default function OrderSummary({
  items,
  discountAmount,
  shippingFee,
  calculateSubtotal,
}) {
  const subtotal = calculateSubtotal(items);
  const total = subtotal - discountAmount + shippingFee;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography>Tạm tính: {subtotal.toLocaleString()} đ</Typography>
      <Typography>Giảm giá: {discountAmount.toLocaleString()} đ</Typography>
      <Typography>Phí giao hàng: {shippingFee.toLocaleString()} đ</Typography>
      <Typography variant="h6" sx={{ mt: 1 }}>
        Tổng cộng: {total.toLocaleString()} đ
      </Typography>
    </Box>
  );
}
