import React, { createContext, useState } from "react";
import api from "../api/axiosConfig";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data);
    } catch (err) {
      console.error("찜 목록 불러오기 실패:", err);
    }
  };

  const addToWishlist = async (item) => {
    try {
      await api.post("/wishlist", item);
      setWishlist((prev) => [...prev, item]);
    } catch (err) {
      console.error("찜 추가 실패:", err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (err) {
      console.error("찜 삭제 실패:", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
