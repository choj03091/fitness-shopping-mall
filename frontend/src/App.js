import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import api from "./api/axiosConfig";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Mypage from "./pages/MyPage";
import ProductRegisterPage from "./pages/ProductRegisterPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import WishlistPage from "./pages/WishlistPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import AddressPage from "./pages/AddressPage";
import OrderCheckPage from "./pages/OrderCheckPage";
import ProductListPage from "./pages/ProductListPage"; // 꼭 import 해주세요!

import { WishlistProvider } from "./context/WishlistContext";
import { AuthContext } from "./context/AuthContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setIsLoggedIn(true);
        setIsAdmin(res.data.title?.toUpperCase() === "ADMIN");
        setUser(res.data);
      } catch (err) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, user, setUser }}
    >
      <WishlistProvider>
        <Router>
          <Header
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            setIsLoggedIn={setIsLoggedIn}
          />
          <Routes>
            <Route
              path="/"
              element={<HomePage isAdmin={isAdmin} isLoggedIn={isLoggedIn} />}
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route
              path="/login"
              element={
                <LoginPage
                  setIsLoggedIn={setIsLoggedIn}
                  setIsAdmin={setIsAdmin}
                />
              }
            />
            <Route path="/signup" element={<SignupPage />} />{" "}
            {isAdmin && (
              <Route
                path="/product/register"
                element={<ProductRegisterPage />}
              />
            )}
            <Route path="/product/manage" element={<ProductManagementPage />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/product/edit/:id" element={<ProductEditPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/ordercheck" element={<OrderCheckPage />} />
            <Route path="/mypage/address/add" element={<AddressPage />} />
            <Route
              path="/category/:parentCategoryName"
              element={<ProductListPage />}
            />
            <Route
              path="/category/:parentCategoryName/:subCategoryName"
              element={<ProductListPage />}
            />
          </Routes>
        </Router>
      </WishlistProvider>
    </AuthContext.Provider>
  );
}

export default App;
