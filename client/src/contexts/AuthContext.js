import { createContext, useContext, useState, useEffect } from "react";
import { login as loginService } from "../services/user.service"; // Dùng login từ service
import { toast } from "react-toastify";

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsAuthLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginService(email, password); // gọi từ service

      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error(res.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      toast.error("Lỗi đăng nhập hoặc kết nối!");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Đã đăng xuất");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthLoading }}>
      {isAuthLoading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
