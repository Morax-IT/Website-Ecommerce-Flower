// components/orders/ProductList.jsx
import {
  Box,
  Typography,
  Grid,
  CardMedia,
  Checkbox,
  Button,
} from "@mui/material";

export default function ProductList({
  products,
  selectedIndexes,
  onToggleProduct,
  onToggleAll,
}) {
  const allSelected = selectedIndexes.length === products.length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Danh sách sản phẩm cần đặt hàng
      </Typography>
      <Button variant="outlined" onClick={onToggleAll} sx={{ mb: 2 }}>
        {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
      </Button>

      {products.map((product, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid #eee",
            borderRadius: 2,
            p: 2,
            mb: 3,
            backgroundColor: "#fafafa",
          }}
        >
          <Grid container spacing={2} aligns="center">
            <Grid gap={1}>
              <Checkbox
                checked={selectedIndexes.includes(index)}
                onChange={() => onToggleProduct(index)}
              />
            </Grid>
            <Grid gap={3}>
              <CardMedia
                component="img"
                image={`http://localhost:8080${product.image}`}
                alt={product.name}
                sx={{ borderRadius: 2, height: 100, objectFit: "cover" }}
              />
            </Grid>
            <Grid gap={6}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
              <Typography sx={{ mt: 1 }} color="primary" fontWeight="bold">
                Giá: {product.price.toLocaleString()} đ
              </Typography>
              <Typography variant="caption">
                Số lượng: {product.quantity || 1}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
