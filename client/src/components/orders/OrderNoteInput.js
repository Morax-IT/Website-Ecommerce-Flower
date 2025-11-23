// components/orders/OrderNoteInput.jsx
import { TextField } from "@mui/material";

export default function OrderNoteInput({ note, onChange }) {
  return (
    <TextField
      label="Ghi chú cho đơn hàng"
      multiline
      rows={3}
      fullWidth
      value={note}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mt: 2 }}
    />
  );
}
