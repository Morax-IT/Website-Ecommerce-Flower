USE gift_selling;

-- ========== TYPE (cấp 1) ==========
INSERT INTO categories (name, category_type, description, parent_id)
VALUES 
('Loại dịp', 'occasion', 'Phân loại quà tặng', NULL); -- ID giả định = 1

-- ========== TYPE (cấp 1) ==========
INSERT INTO categories (name, category_type, description, parent_id)
VALUES 
('Loại quà', 'type', 'Phân loại quà tặng', NULL); -- ID giả định = 2

-- ========== TYPE (cấp 1) ==========
INSERT INTO categories (name, category_type, description, parent_id)
VALUES 
('Loại tặng kèm', 'addon', 'Phân loại quà tặng', NULL); -- ID giả định = 3

-- ========== OCCASION ==========
INSERT INTO categories (name, category_type, description, parent_id)
VALUES 
('Sinh nhật', 'occasion', 'Quà tặng dịp sinh nhật', 1),
('Kỷ niệm', 'occasion', 'Quà tặng ngày kỷ niệm', 1),
('Tỏ tình', 'occasion', 'Quà tặng tỏ tình lãng mạn', 1),
('Ngày của mẹ', 'occasion', 'Quà tặng tri ân mẹ', 1);

-- ========== TYPE (cấp 2, con của Loại quà) ==========
INSERT INTO categories (name, category_type, description, parent_id)
VALUES 
('Bó hoa', 'type', 'Các loại bó hoa', 2),
('Giỏ hoa', 'type', 'Các loại giỏ hoa', 2),
('Hộp quà', 'type', 'Hộp quà sang trọng', 2);

-- ========== ADDON ==========
INSERT INTO categories (name, category_type, description, parent_id)
VALUES 
('Gấu bông', 'addon', 'Gấu bông dễ thương kèm quà tặng', 3),
('Socola', 'addon', 'Socola ngọt ngào', 3),
('Nến thơm', 'addon', 'Nến thơm tạo không gian lãng mạn', 3),
('Thiệp chúc mừng', 'addon', 'Thiệp viết lời chúc yêu thương', 3);

-- ========== PRODUCTS ==========
INSERT INTO products (name, description, avatar, base_price, discount_percent, rating_avg, total_reviews)
VALUES
('Bó hoa Hồng đỏ', 'Bó hoa hồng đỏ sang trọng', 'https://example.com/images/hoa_hong.jpg', 500000, 10, 4.5, 12),
('Giỏ hoa Tulip', 'Giỏ hoa tulip nhiều màu', 'https://example.com/images/hoa_tulip.jpg', 650000, 15, 4.2, 8),
('Hộp quà Socola', 'Hộp quà gồm socola và thiệp', 'https://example.com/images/hop_qua.jpg', 400000, 5, 4.7, 20);

-- ========== PRODUCT_IMAGES ==========
INSERT INTO product_images (product_id, image_url, sort_order)
VALUES
(1, 'https://example.com/images/hoa_hong_1.jpg', 1),
(1, 'https://example.com/images/hoa_hong_2.jpg', 2),
(2, 'https://example.com/images/hoa_tulip_1.jpg', 1),
(3, 'https://example.com/images/hop_qua_1.jpg', 1);

-- ========== PRODUCT_CATEGORY ==========
INSERT INTO product_category (product_id, category_id, category_type)
VALUES
(1, 6, 'type'),  -- Bó hoa Hồng đỏ thuộc "Bó hoa"
(1, 4, 'occasion'),  -- Bó hoa Hồng đỏ thuộc "Sinh nhật"
(2, 7, 'type'),  -- Giỏ hoa Tulip thuộc "Giỏ hoa"
(2, 5, 'occasion'),  -- Giỏ hoa Tulip thuộc "Kỷ niệm"
(3, 8, 'type'),  -- Hộp quà Socola thuộc "Hộp quà"
(3, 6 , 'occasion');  -- Hộp quà Socola thuộc "Tỏ tình"

-- ========== PRODUCT_VARIANTS ==========
INSERT INTO product_variants (product_id, variant_type, variant_value)
VALUES
(1, 'color', 'Đỏ'),
(2, 'color', 'Nhiều màu'),
(3, 'scent', 'Ngọt ngào');

-- ========== PRODUCT_ADDONS ==========
INSERT INTO product_addons (product_id, addon_name, extra_price)
VALUES
(1, 'Gấu bông mini', 50000),
(2, 'Thiệp chúc mừng', 20000),
(3, 'Nến thơm', 80000);

-- ========== REGIONS ==========
INSERT INTO regions (code, name, shipping_fee, note)
VALUES
('HCM_inner', 'Nội thành TP.HCM', 30000, 'Giao nhanh trong ngày'),
('HCM_outer', 'Ngoại thành TP.HCM', 50000, 'Giao trong 1-2 ngày');

-- ========== USERS ==========
INSERT INTO users (name, email, phone, password_hash, role, status)
VALUES
('Nguyễn Văn A', 'a@example.com', '0909000111', 'hashed_password_a', 'customer', 'active'),
('Trần Thị B', 'b@example.com', '0909000222', 'hashed_password_b', 'customer', 'active'),
('Admin', 'admin@example.com', '0909000333', 'hashed_password_admin', 'admin', 'active');

-- ========== USER_ADDRESSES ==========
INSERT INTO user_addresses (user_id, address, region_id, is_default)
VALUES
(1, '123 Đường Lê Lợi, Q1, TP.HCM', 1, TRUE),
(2, '456 Đường Xô Viết Nghệ Tĩnh, Q.Bình Thạnh, TP.HCM', 2, TRUE);

-- ========== REVIEWS ==========
INSERT INTO reviews (product_id, user_id, rating, comment)
VALUES
(1, 1, 5, 'Bó hoa rất đẹp, giao đúng giờ!'),
(2, 2, 4, 'Giỏ hoa tươi và màu sắc hài hòa.');

-- ========== REVIEW_MEDIA ==========
INSERT INTO review_media (review_id, media_url, media_type)
VALUES
(1, 'https://example.com/reviews/review1_img1.jpg', 'image'),
(2, 'https://example.com/reviews/review2_img1.jpg', 'image');

-- ========== PROMOTIONS ==========
INSERT INTO promotions (code, discount_type, discount_value, min_order_value, max_usage, used_count, valid_from, valid_to, status)
VALUES
('SALE10', 'percent', 10, 300000, 100, 5, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'active'),
('FREESHIP', 'fixed', 30000, 500000, 50, 10, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 'active');

-- ========== ORDERS ==========
INSERT INTO orders (user_id, region_id, promotion_id, shipping_fee, total_price, payment_method, status, delivery_time, note)
VALUES
(1, 1, 1, 30000, 480000, 'COD', 'completed', NOW(), 'Giao trước 12h trưa'),
(2, 2, NULL, 50000, 700000, 'Momo', 'pending', NOW(), 'Giao sau giờ hành chính');

-- ========== ORDER_ITEMS ==========
INSERT INTO order_items (order_id, product_id, quantity, selected_variants, selected_addons, price)
VALUES
(1, 1, 1, '{"color":"Đỏ"}', '[{"name":"Gấu bông mini","extra":50000}]', 480000),
(2, 2, 2, '{"color":"Nhiều màu"}', '[]', 700000);

-- ========== FAVORITES ==========
INSERT INTO favorites (user_id, product_id)
VALUES
(1, 2),
(2, 1);
