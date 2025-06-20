import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { WishlistContext } from "../context/WishlistContext";
import "../styles/WishlistPage.scss";
import { FaHeart, FaStar } from "react-icons/fa";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await api.get("/users/me");
        fetchWishlist();
      } catch (err) {
        alert("로그인 후 이용 가능합니다!");
        navigate("/login", { replace: true });
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await api.get("/wishlist");
        setWishlistItems(res.data);
      } catch (err) {
        console.error("찜 목록 불러오기 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, [navigate]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      alert("찜 목록에서 삭제되었습니다!");
    } catch (err) {
      console.error("찜 삭제 실패:", err);
      alert("찜 삭제 실패");
    }
  };

  if (isLoading) {
    return (
      <div className="wishlist-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1>찜 목록</h1>
      {wishlistItems.length === 0 ? (
        <p>찜 목록이 비어있습니다.</p>
      ) : (
        <div
          className={`wishlist-grid ${
            wishlistItems.length === 1 ? "single-item" : ""
          }`}
        >
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-card">
              <Link to={`/product/${item.productId}`}>
                <img
                  src={`http://localhost:8080${item.imageUrl}`}
                  alt={item.productName}
                />
                <div className="wishlist-info">
                  <h3>{item.productName}</h3>
                  <p className="price">{item.price.toLocaleString()}원</p>
                  <p className="reviews">
                    <FaStar color="gold" /> 리뷰 {item.reviewCount || 0}개
                  </p>
                </div>
              </Link>
              <button
                className="wishlist-button active" // ← HomePage와 동일한 스타일 클래스
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove(item.productId);
                }}
              >
                <FaHeart />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
