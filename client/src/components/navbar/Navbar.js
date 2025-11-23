import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  IconButton,
  Badge,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Popover,
  Box,
  Typography,
  InputBase,
  Button,
  Divider,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import ROUTES from "../../resources/routes";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  appBarStyle,
  toolbarStyle,
  tabsWrapperStyle,
  tabsStyle,
  tabIndicatorStyle,
  searchBoxStyle,
} from "./navbarStyles";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout, token, user } = useAuth();

  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const cartOpen = Boolean(cartAnchorEl);

  const handleCartOpen = (event) => setCartAnchorEl(event.currentTarget);
  const handleCartClose = () => setCartAnchorEl(null);

  const { cartItems, removeFromCart } = useCart();
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const getTabValue = () => {
    if (location.pathname === ROUTES.HOME) return 0;
    if (location.pathname === ROUTES.CATEGORY) return 1;
    if (location.pathname === ROUTES.PRODUCT) return 2;
    if (location.pathname === ROUTES.CONTACT) return 3;
    if (location.pathname === ROUTES.LOGIN) return 4;
    if (location.pathname === ROUTES.REGISTER) return 5;
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    window.location.reload();
  };

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const openProfileMenu = Boolean(profileAnchorEl);

  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  return (
    <AppBar position="sticky" sx={appBarStyle}>
      <Toolbar sx={toolbarStyle}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#344767", cursor: "pointer" }}
          onClick={() => navigate(ROUTES.HOME)}
        >
          NHU-Y FRESH FLOWERS
        </Typography>

        <Box sx={tabsWrapperStyle}>
          <Tabs
            value={getTabValue()}
            textColor="inherit"
            TabIndicatorProps={{ sx: tabIndicatorStyle }}
            sx={tabsStyle}
          >
            <Tab label="Home" component={NavLink} to={ROUTES.HOME} />
            <Tab label="Category" component={NavLink} to={ROUTES.CATEGORY} />
            <Tab label="Product" component={NavLink} to={ROUTES.PRODUCT} />
            <Tab label="Contact" component={NavLink} to={ROUTES.CONTACT} />
            {!token && (
              <Tab label="Login" component={NavLink} to={ROUTES.LOGIN} />
            )}
            {!token && (
              <Tab label="Register" component={NavLink} to={ROUTES.REGISTER} />
            )}
          </Tabs>
        </Box>

        <Box sx={searchBoxStyle}>
          <SearchIcon fontSize="small" sx={{ color: "#666" }} />
          <InputBase
            placeholder="Search…"
            sx={{ ml: 1, flex: 1, fontSize: "0.9rem" }}
          />
        </Box>

        {token && (
          <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
            <IconButton color="primary" onClick={handleCartOpen}>
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <Popover
              open={cartOpen}
              anchorEl={cartAnchorEl}
              onClose={handleCartClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{ sx: { width: 320, p: 2 } }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Giỏ hàng ({totalItems})
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {cartItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Giỏ hàng đang trống.
                </Typography>
              ) : (
                <>
                  {cartItems.map((item, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <img
                        src={`http://localhost:8080${item.image}`}
                        alt={item.name}
                        style={{ width: 40, height: 40, borderRadius: 4 }}
                      />
                      <Box sx={{ flex: 1, ml: 1 }}>
                        <Typography variant="body2" noWrap>
                          {item.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          x{item.quantity} •{" "}
                          {(item.price * item.quantity).toLocaleString()} đ
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}

                  <Divider sx={{ my: 1 }} />

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      handleCartClose();
                      navigate("/create-order", {
                        state: { products: cartItems },
                      });
                    }}
                  >
                    Đặt hàng
                  </Button>
                </>
              )}
            </Popover>

            {/* Profile Dropdown */}
            <IconButton color="primary" onClick={handleProfileClick}>
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={profileAnchorEl}
              open={openProfileMenu}
              onClose={handleProfileClose}
            >
              <MenuItem disabled>{user?.name || "User"}</MenuItem>
              <MenuItem
                onClick={() => {
                  handleProfileClose();
                  navigate("/profile");
                }}
              >
                Thông tin cá nhân
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleProfileClose();
                  navigate("/my-addresses");
                }}
              >
                Địa chỉ giao hàng
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleProfileClose();
                  navigate("/my-orders");
                }}
              >
                Lịch sử đơn hàng
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleProfileClose();
                  navigate("/change-password");
                }}
              >
                Đổi mật khẩu
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
