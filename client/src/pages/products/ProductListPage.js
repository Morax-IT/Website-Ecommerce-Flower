import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getAllProduct } from "../../services/productService";
import ProductCard from "../../components/products/ProductCard";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProduct();
        setProducts(res);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sản phẩm
      </Typography>

      {/* Hiển thị card dạng grid */}
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </Box>
    </Box>
  );
}
