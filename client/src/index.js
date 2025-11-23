import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./redux/store"; // ✅ IMPORT store
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <AuthProvider>
      <CartProvider>
        <Router>
          <App />
        </Router>
      </CartProvider>
    </AuthProvider>
    {/* </Provider> */}
  </React.StrictMode>
);

reportWebVitals();
