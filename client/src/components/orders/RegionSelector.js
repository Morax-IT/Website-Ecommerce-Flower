// components/orders/RegionSelector.jsx
import { TextField, MenuItem } from "@mui/material";

export default function RegionSelector({ regions, regionId, onChange }) {
  return (
    <TextField
      select
      label="Khu vực giao hàng"
      value={regions.find((r) => r.id === regionId) ? regionId : ""}
      onChange={(e) => onChange(Number(e.target.value))}
      sx={{ mt: 2, width: "300px" }}
    >
      {regions.map((region) => (
        <MenuItem key={region.id} value={region.id}>
          {region.name} ({region.shipping_fee.toLocaleString()} đ)
        </MenuItem>
      ))}
    </TextField>
  );
}
