import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  CardMedia,
  Chip,
  ListItemButton,
} from "@mui/material";
import {
  getProductById,
  getProductImage,
  getProductVariant,
  getProductAddon,
} from "../../services/productService";
import {
  createReview,
  getReviewByProductId,
} from "../../services/reviewService";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMedia, setReviewMedia] = useState([]);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    const finalPrice =
      product.base_price * (1 - product.discount_percent / 100);

    const cartItem = {
      product_id: product.id,
      name: product.name,
      image: product.avatar,
      price: finalPrice,
      quantity: 1,
      selected_variants: {},
      selected_addons: [],
    };

    addToCart(cartItem);
    alert("Đã thêm vào giỏ hàng!");
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const detail = await getProductById(id);
        setProduct(detail[0]);

        const img = await getProductImage(id);
        setImages(img);

        const varList = await getProductVariant(id);
        setVariants(varList);

        const addonList = await getProductAddon(id);
        setAddons(addonList);

        const reviewList = await getReviewByProductId(id);
        setReviews(reviewList);
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
      }
      setLoading(false);
    };

    fetchDetail();
  }, [id]);

  const handleOrder = async () => {
    // Tạo dữ liệu cần chuyển sang
    const finalPrice =
      product.base_price * (1 - product.discount_percent / 100);

    const singleItem = {
      product_id: product.id,
      name: product.name,
      image: product.avatar,
      price: finalPrice,
      quantity: 1,
      selected_variants: {}, // sau này có thể chọn
      selected_addons: [],
    };

    // Điều hướng tới trang tạo đơn với 1 sản phẩm
    navigate("/create-order", {
      state: {
        products: [singleItem],
      },
    });
  };

  // handle submit review
  const handleReviewSubmit = async () => {
    try {
      await createReview({
        user_id: user.id,
        product_id: product.id,
        rating,
        comment,
        media: reviewMedia,
      });

      alert("Đã gửi đánh giá thành công!");

      // Tải lại danh sách đánh giá mới
      const updatedReviews = await getReviewByProductId(product.id);
      setReviews(updatedReviews);

      // reset form
      setRating(5);
      setComment("");
      setReviewMedia([]);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi gửi đánh giá");
    }
  };

  if (loading) return <CircularProgress />;

  if (!product) return <Typography>Không tìm thấy sản phẩm</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{product.name}</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        {product.description}
      </Typography>

      {/* Ảnh sản phẩm */}
      <Grid container spacing={2} size={{ mt: 2 }}>
        {images.map((img) => (
          <Grid key={img.id} size={3}>
            <CardMedia
              component="img"
              image={`http://localhost:8080${img.image_url}`}
              alt={product.name}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Giá */}
      <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
        {product.discount_percent > 0 ? (
          <>
            {(
              product.base_price *
              (1 - product.discount_percent / 100)
            ).toLocaleString()}{" "}
            đ{" "}
            <Typography
              component="span"
              sx={{
                textDecoration: "line-through",
                ml: 1,
                fontSize: "0.9rem",
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

      {/* Variant */}
      {variants.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Thuộc tính sản phẩm:</Typography>
          {variants.map((v) => (
            <Chip
              key={v.id}
              label={`${v.variant_type}: ${v.variant_value}`}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      )}

      {/* Addon */}
      {addons.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Sản phẩm kèm theo:</Typography>
          {addons.map((a) => (
            <Typography key={a.id}>
              ➕ {a.addon_name} (+{a.extra_price.toLocaleString()} đ)
            </Typography>
          ))}
        </Box>
      )}
      {/* Nút đặt hàng */}
      <ListItemButton
        onClick={handleOrder}
        sx={{
          mt: 4,
          bgcolor: "primary.main",
          color: "white",
          borderRadius: 2,
          "&:hover": { bgcolor: "primary.dark" },
          textAlign: "center",
        }}
      >
        <Typography sx={{ width: "100%", fontWeight: "bold" }}>
          Đặt hàng ngay
        </Typography>
      </ListItemButton>
      {/* Thêm vào giỏ hàng */}
      <ListItemButton
        onClick={handleAddToCart}
        sx={{
          mt: 2,
          bgcolor: "secondary.main",
          color: "white",
          borderRadius: 2,
          "&:hover": { bgcolor: "secondary.dark" },
          textAlign: "center",
        }}
      >
        <Typography sx={{ width: "100%", fontWeight: "bold" }}>
          Thêm vào giỏ hàng
        </Typography>
      </ListItemButton>

      <Box sx={{ mt: 5, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h6">Viết đánh giá của bạn:</Typography>

        {/* Đánh giá sao */}
        <Box sx={{ mt: 2 }}>
          <Typography>Điểm đánh giá:</Typography>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            style={{ padding: "8px", fontSize: "1rem", marginTop: "8px" }}
          >
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} sao
              </option>
            ))}
          </select>
        </Box>

        {/* Nội dung đánh giá */}
        <Box sx={{ mt: 2 }}>
          <Typography>Nội dung đánh giá:</Typography>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
        </Box>

        {/* Media upload - xử lý sau */}
        {/* Tạm thời input URL thủ công nếu chưa xử lý upload */}
        <Box sx={{ mt: 2 }}>
          <Typography>Ảnh/Video đánh giá (URL):</Typography>
          <input
            type="text"
            value={reviewMedia[0]?.url || ""}
            onChange={(e) =>
              setReviewMedia([{ url: e.target.value, type: "image" }])
            }
            placeholder="Nhập URL ảnh/video..."
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
        </Box>

        {/* Button gửi đánh giá */}
        <ListItemButton
          onClick={handleReviewSubmit}
          sx={{
            mt: 3,
            bgcolor: "success.main",
            color: "white",
            borderRadius: 2,
            "&:hover": { bgcolor: "success.dark" },
            textAlign: "center",
          }}
        >
          <Typography sx={{ width: "100%", fontWeight: "bold" }}>
            Gửi đánh giá
          </Typography>
        </ListItemButton>
      </Box>

      {/* đánh giá */}
      {reviews.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Đánh giá sản phẩm:</Typography>
          {reviews.map((review) => (
            <Box
              key={review.review_id}
              sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {review.user_name} - {review.rating}⭐
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {new Date(review.created_at).toLocaleDateString("vi-VN")}
              </Typography>
              <Typography variant="body1">{review.comment}</Typography>

              {/* Media nếu có */}
              {review.media.length > 0 && (
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {review.media.map((m, index) =>
                    m.type === "image" ? (
                      <Grid key={index}>
                        <CardMedia
                          component="img"
                          image={m.url}
                          alt="Review media"
                          sx={{ width: 120, height: 120, borderRadius: 1 }}
                        />
                      </Grid>
                    ) : (
                      <Grid item key={index}>
                        <video width="150" height="120" controls>
                          <source src={m.url} type="video/mp4" />
                          Trình duyệt không hỗ trợ video.
                        </video>
                      </Grid>
                    )
                  )}
                </Grid>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
