// components/orders/PaymentSelector.jsx
import { TextField, MenuItem } from "@mui/material";

export default function PaymentSelector({ value, onChange }) {
  return (
    <TextField
      select
      label="Phương thức thanh toán"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mt: 2, mr: 2, width: "250px" }}
    >
      <MenuItem value="COD">COD</MenuItem>
      <MenuItem value="Momo">Momo</MenuItem>
      <MenuItem value="VNPay">VNPay</MenuItem>
    </TextField>
  );
}
