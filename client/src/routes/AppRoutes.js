import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ContactPage from "../pages/ContactPage";
import CategoryPage from "../pages/CategoryPage";
import LoginPage from "../pages/users/LoginPage";
import RegisterPage from "../pages/users/RegisterPage";
import ProfilePage from "../pages/users/ProfilePage";
import ChangePasswordPage from "../pages/users/ChangePasswordPage";
import MyAddressesPage from "../pages/users/MyAddressesPage";
import ProductListPage from "../pages/products/ProductListPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";
import MainLayout from "../layouts/MainLayout";
import ROUTES from "../resources/routes";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCategoryPage from "../pages/admin/AdminCategoryPage";
import AdminProductPage from "../pages/admin/AdminProductPage";
import AdminLayout from "../layouts/AdminLayout";
import ProductCreatePage from "../pages/admin/ProductCreatePage";
import ProductEditPage from "../pages/admin/ProductEditPage";
import UserManagerPage from "../pages/admin/UserManagerPage";
import CreateOrderPage from "../pages/orders/CreateOrderPage";
import MyOrderPage from "../pages/orders/MyOrderPage";
import VNPayReturn from "../pages/orders/VNPayReturn";
import VnpayCallbackPage from "../pages/VnpayCallbackPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.PRODUCT} element={<ProductListPage />} />
        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
        <Route path={ROUTES.VNPAY_CALLBACK} element={<VnpayCallbackPage />} />
        <Route
          path={ROUTES.CREATE_ORDER}
          element={
            <ProtectedRoute>
              <CreateOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VNPAY_PAYMENT}
          element={
            <ProtectedRoute>
              <VNPayReturn />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MY_ORDER}
          element={
            <ProtectedRoute>
              <MyOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MY_ADDRESSES}
          element={
            <ProtectedRoute>
              <MyAddressesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHANGE_PASSWORD}
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Route ADMIN - chỉ admin mới vào được */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN_CATEGORIES} element={<AdminCategoryPage />} />
        <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminProductPage />} />
        <Route
          path={ROUTES.ADMIN_PRODUCT_CREATE}
          element={<ProductCreatePage />}
        />
        <Route path={ROUTES.ADMIN_PRODUCT_EDIT} element={<ProductEditPage />} />
        <Route path={ROUTES.USER_MANAGER} element={<UserManagerPage />} />
        {/* <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrders />} /> */}
      </Route>
    </Routes>
  );
}
