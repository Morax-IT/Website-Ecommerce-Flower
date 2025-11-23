const ROUTES = {
  HOME: "/",
  CATEGORY: "/category",
  CONTACT: "/contact",
  LOGIN: "/login",
  REGISTER: "/register",
  PRODUCT: "/product",
  PRODUCT_DETAIL: "/product/:id",
  CREATE_ORDER: "/create-order",
  VNPAY_PAYMENT: "/vnpay-return",
  VNPAY_CALLBACK: "/vnpay-callback",
  MY_ORDER: "my-orders",
  PROFILE: "profile",
  MY_ADDRESSES: "my-addresses",
  CHANGE_PASSWORD: "change-password",

  // Route admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_PRODUCT_CREATE: "/admin/product/create",
  ADMIN_PRODUCT_EDIT: "/admin/product/edit/:id",
  USER_MANAGER: "/admin/customer",
};

export default ROUTES;
