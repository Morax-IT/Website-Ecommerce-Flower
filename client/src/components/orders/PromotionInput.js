// components/orders/PromotionInput.jsx
import { Box, TextField, Button, Typography } from "@mui/material";

export default function PromotionInput({
  value,
  onChange,
  onApply,
  error,
  promotion,
  discountAmount,
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
      <TextField
        label="Mã giảm giá"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ mr: 2, width: 250 }}
        error={!!error}
        helperText={error || ""}
      />
      <Button variant="contained" onClick={onApply}>
        Áp dụng
      </Button>
      {promotion && (
        <Typography color="success.main" sx={{ ml: 2 }}>
          ✅ Mã {promotion.code} được áp dụng: giảm{" "}
          {discountAmount.toLocaleString()}đ
        </Typography>
      )}
    </Box>
  );
}
