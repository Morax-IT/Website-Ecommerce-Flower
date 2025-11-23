# 🌸 Nhu Y Fresh Flowers

Dự án **Nhu Y Fresh Flowers** là backend API viết bằng **Node.js + Express** hỗ trợ website bán hoa tươi. Hệ thống cung cấp REST API, quản lý kết nối cơ sở dữ liệu MySQL, hỗ trợ xác thực người dùng bằng JWT, và tích hợp CORS để kết nối với frontend.

---

## 🚀 Công nghệ sử dụng

- **Node.js** – môi trường chạy JavaScript phía server
- **Express.js** – framework xây dựng REST API
- **MySQL** – hệ quản trị cơ sở dữ liệu quan hệ
- **dotenv** – quản lý biến môi trường
- **cors** – cấu hình CORS cho frontend
- **jsonwebtoken** – xác thực người dùng với JWT
- **Nodemon** (dev) – tự động reload server khi thay đổi code

---

## 📂 Cấu trúc thư mục

```
nhu-y-fresh-flowers/
│
├── server/
│   ├── src/
│   │   ├── index.js              # File khởi chạy server
│   │   ├── routes/               # Định nghĩa API router
│   │   ├── controllers/          # Xử lý logic nghiệp vụ
│   │   ├── models/               # Định nghĩa model (MySQL)
│   │   └── config/
│   │       └── database.config.js # Kết nối cơ sở dữ liệu
│   │
│   ├── .env.example              # Mẫu biến môi trường
│   ├── .gitignore                # Bỏ qua file không cần commit
│   ├── package.json
│   └── README.md
│
└── ...
```

---

## ⚙️ Cài đặt & Chạy dự án

### 1️⃣ Clone dự án

```bash
git clone https://github.com/<username>/nhu-y-fresh-flowers.git
cd nhu-y-fresh-flowers/server
```

### 2️⃣ Cài đặt dependencies

```bash
npm install
```

### 3️⃣ Tạo file `.env`

Sao chép từ `.env.example` và cập nhật cấu hình:

```ini
PORT=8080
CLIENT_URL=http://localhost:3000

DB_NAME=gift_selling
DB_USER=root
DB_PORT=3306
DB_HOST=localhost
DB_PASSWORD=123456

JTW_SECRET=eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMTI1NjM3MSwiaWF0IjoxNzAxMjU2MzcxfQ.TrBKsx9Dhwy-dcaji2iBPjBhFusq1LvZp8hjfYSs0vQ
```

> ⚠️ **Lưu ý bảo mật:** Không commit file `.env` lên GitHub.

---

### 4️⃣ Chạy server

- **Development mode (hot reload)**

```bash
npm run dev
```

Server mặc định chạy tại **http://localhost:8080**

---

## 🌐 API Endpoint

| Method | Endpoint        | Mô tả                       |
| ------ | --------------- | --------------------------- |
| GET    | /api/products   | Lấy danh sách sản phẩm hoa  |
| POST   | /api/orders     | Tạo đơn hàng mới            |
| PUT    | /api/orders/:id | Cập nhật đơn hàng           |
| DELETE | /api/orders/:id | Xóa đơn hàng                |
| POST   | /api/auth/login | Đăng nhập, trả về JWT token |

---

## 🔒 CORS

Chỉ cho phép frontend có **origin** nằm trong biến `CLIENT_URL` (mặc định `http://localhost:3000`). Nếu request từ domain khác sẽ bị chặn với lỗi `Not allowed by CORS`.

---

## 🗄️ Cấu hình cơ sở dữ liệu

Dự án sử dụng **MySQL**. Đảm bảo bạn đã tạo sẵn database `gift_selling` hoặc thay đổi biến môi trường:

```sql
CREATE DATABASE gift_selling;
```

---

## 🛡️ Xác thực với JWT

- **JTW_SECRET** trong `.env` dùng để ký & xác minh token.
- Sau khi login thành công, server sẽ trả về `accessToken`, client gửi token qua `Authorization: Bearer <token>` để truy cập API bảo mật.

---

## 🗑️ `.gitignore`

Dự án đã cấu hình `.gitignore` để **bỏ qua các file không cần commit**, bao gồm:

✅ **Log & cache** (`logs`, `*.log`, `.cache`, `.eslintcache`)
✅ **Thư viện cài đặt** (`node_modules/`)
✅ **Build output** (`dist/`, `.next/`, `.nuxt/`)
✅ **Test coverage** (`coverage/`, `.nyc_output/`)
✅ **Env file** (`.env`, `.env.*` nhưng vẫn giữ `.env.example`)

---

## 📝 Scripts trong `package.json`

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

- `npm start` → Chạy server ở chế độ production
- `npm run dev` → Chạy server kèm **nodemon** (hot reload khi sửa code)

---

## 💡 Gợi ý phát triển

✅ Tích hợp **Swagger** để tự động sinh tài liệu API  
✅ Dùng **Sequelize ORM** để dễ quản lý MySQL  
✅ Triển khai **Role-based Authorization (RBAC)** cho Admin & User  
✅ Deploy lên **Render / Railway / AWS**

---

## 📜 License

MinhDuc © 2025 – Nhu Y Fresh Flowers
