DROP DATABASE IF EXISTS gift_selling;
CREATE DATABASE gift_selling CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gift_selling;

-- Danh mục // có 3 loại: occasion | type | addon
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_type ENUM('occasion', 'type', 'addon') NOT NULL,
    description TEXT,
    parent_id BIGINT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Sản phẩm // Mỗi sản phẩm có ảnh chính, mô tả, giá, khuyến mãi
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar VARCHAR(500), -- ảnh đại diện
    base_price DECIMAL(12,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ảnh chi tiết sản phẩm - 1 sản phẩm có nhiều ảnh
CREATE TABLE product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Nhiều sản phẩm ↔ Nhiều danh mục
CREATE TABLE product_category (
    product_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    category_type VARCHAR(50) NOT NULL DEFAULT 'occasion',
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Màu sắc, mùi hương… Ví dụ: Hoa → màu đỏ/hồng | Nước hoa → mùi biển/ngọt
CREATE TABLE product_variants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    variant_type ENUM('color','scent') NOT NULL,
    variant_value VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Phụ kiện mua kèm Ví dụ: Gấu bông nhỏ +50k, Thiệp +20k
CREATE TABLE product_addons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    addon_name VARCHAR(255) NOT NULL,
    extra_price DECIMAL(12,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Khu vực giao hàng Dùng để tính phí ship
CREATE TABLE regions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,   -- HCM_inner, HCM_outer
    name VARCHAR(255) NOT NULL,         -- Nội thành TP.HCM
    shipping_fee DECIMAL(12,2) NOT NULL,
    note VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Khách hàng + Admin
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    role ENUM('admin','customer') DEFAULT 'customer',
    status ENUM('active','blocked') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Một user có thể có nhiều địa chỉ
CREATE TABLE user_addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    address TEXT NOT NULL,
    region_id BIGINT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- Đánh giá sản phẩm
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ảnh/video kèm đánh giá
CREATE TABLE review_media (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT NOT NULL,
    media_url VARCHAR(500),
    media_type ENUM('image','video') NOT NULL,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- Mã giảm giá
CREATE TABLE promotions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percent','fixed') NOT NULL,
    discount_value DECIMAL(12,2) NOT NULL,
    min_order_value DECIMAL(12,2) DEFAULT 0,
    max_usage INT DEFAULT 0,
    used_count INT DEFAULT 0,
    valid_from DATETIME,
    valid_to DATETIME,
    status ENUM('active','expired') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Đơn hàng
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    region_id BIGINT NOT NULL,
    promotion_id BIGINT NULL,
    shipping_fee DECIMAL(12,2) DEFAULT 0,
    total_price DECIMAL(12,2) NOT NULL,
    payment_method ENUM('COD','Momo','VNPay') NOT NULL,
    status ENUM('pending','delivering','completed','cancelled') DEFAULT 'pending',
    delivery_time DATETIME,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);

-- Chi tiết sản phẩm trong đơn hàng
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    selected_variants JSON,  -- {"color":"Đỏ","scent":"Biển"}
    selected_addons JSON,    -- [{"name":"Gấu bông","extra":50000}]
    price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Danh sách yêu thích
CREATE TABLE favorites (
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
