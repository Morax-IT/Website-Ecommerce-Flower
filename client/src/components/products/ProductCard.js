import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";
import ROUTES from "../../resources/routes";
import { useCart } from "../../contexts/CartContext";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleClick = () => {
    navigate(ROUTES.PRODUCT_DETAIL.replace(":id", product.id)); // điều hướng sang Product Detail
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // ngăn không trigger CardActionArea
    const finalPrice =
      product.base_price * (1 - product.discount_percent / 100);

    addToCart({
      product_id: product.id,
      name: product.name,
      image: product.avatar,
      price: finalPrice,
      quantity: 1,
      selected_variants: {},
      selected_addons: [],
    });

    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <Card sx={{ width: 250, m: 1, position: "relative" }}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="180"
          image={
            product.avatar
              ? `${IMAGE_URL}${product.avatar}`
              : "/default-product.jpg"
          }
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h6" noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {product.description}
          </Typography>

          <Box sx={{ mt: 1, mb: 1 }}>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {product.discount_percent > 0 ? (
                <>
                  {(
                    product.base_price *
                    (1 - product.discount_percent / 100)
                  ).toLocaleString()}{" "}
                  đ
                  <Typography
                    component="span"
                    sx={{
                      textDecoration: "line-through",
                      ml: 1,
                      fontSize: "0.85rem",
                      color: "gray",
                    }}
                  >
                    {product.base_price.toLocaleString()} đ
                  </Typography>
                </>
              ) : (
                `${product.base_price.toLocaleString()} đ`
              )}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            ⭐ {product.rating_avg} ({product.total_reviews} đánh giá)
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* IconButton thêm vào giỏ hàng */}
      <IconButton
        size="small"
        color="primary"
        onClick={handleAddToCart}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "background.paper",
        }}
      >
        <ShoppingCartIcon />
      </IconButton>
    </Card>
  );
}
