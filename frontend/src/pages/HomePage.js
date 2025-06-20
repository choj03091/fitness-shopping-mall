import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import api from "../api/axiosConfig";
import { WishlistContext } from "../context/WishlistContext";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HomePage.scss";

const HomePage = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const { addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProductsAndWishlist = async () => {
      try {
        const productRes = await api.get("/products");
        let wishlistIds = [];

        if (isLoggedIn) {
          try {
            const wishlistRes = await api.get("/wishlist");
            wishlistIds = wishlistRes.data.map((item) => item.productId);
          } catch (wishlistError) {
            if (
              wishlistError.response &&
              wishlistError.response.status !== 401
            ) {
              console.error("찜 목록 불러오기 실패:", wishlistError);
            }
          }
        }

        const updatedProducts = productRes.data.map((product) => ({
          ...product,
          isWishlisted: wishlistIds.includes(product.id),
        }));

        setProducts(updatedProducts);
      } catch (err) {
        console.error("상품 목록 불러오기 실패:", err);
      }
    };

    fetchProductsAndWishlist();
  }, [isLoggedIn]);

  const handleWishlistToggle = async (product) => {
    try {
      if (product.isWishlisted) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist({
          productId: product.id,
          productName: product.name,
          option: product.option || "",
        });
      }
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id
            ? { ...p, isWishlisted: !product.isWishlisted }
            : p
        )
      );
    } catch (err) {
      console.error("찜 상태 변경 실패:", err);
    }
  };

  const bannerImages = [
    "/images/banner1.png",
    "/images/banner2.png",
    "/images/banner3.png",
    "/images/banner4.png",
    "/images/banner5.png",
  ];

  // 🔥 slick 설정
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const newProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8); // 신상품 8개만

  const discountProducts = products.filter(
    (product) => product.discountRate > 0
  );

  const recommendedProducts = [...products]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 8); // 평점순 8개만

  return (
    <div className="home-page">
      {/* 🔥 메인 배너 */}
      <div className="banner">
        <Slider {...sliderSettings}>
          {bannerImages.map((src, index) => (
            <div key={index}>
              <img src={src} alt={`배너 ${index + 1}`} />
            </div>
          ))}
        </Slider>
        <div className="banner-text">
          <h1>당신의 운동을 더 가치 있게</h1>
          <p>프리웨이트부터 재활운동까지 한눈에!</p>
        </div>
      </div>

      {/* 🔥 신상품 섹션 */}
      <section className="product-section">
        <h2>신상품</h2>
        <ul className="product-list">
          {newProducts.map((product) => (
            <li className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`}>
                <img
                  src={`http://localhost:8080${product.imageUrl}`}
                  alt={product.name}
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  {/* <p>옵션: {product.option}</p> */}
                  <p className="price">{product.price.toLocaleString()}원</p>
                  <div className="rating">
                    <FaStar />
                    {product.averageRating
                      ? product.averageRating.toFixed(1)
                      : "0.0"}
                    점 ({product.reviewCount || 0}개)
                  </div>
                </div>
              </Link>
              {isLoggedIn && (
                <button
                  className={`wishlist-button ${
                    product.isWishlisted ? "active" : ""
                  }`}
                  onClick={() => handleWishlistToggle(product)}
                >
                  {product.isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 🔥 할인상품 섹션 */}
      <section className="product-section">
        <h2>할인상품</h2>
        <ul className="product-list">
          {discountProducts.map((product) => (
            <li className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`}>
                <img
                  src={`http://localhost:8080${product.imageUrl}`}
                  alt={product.name}
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  {/* <p>옵션: {product.option}</p> */}
                  <p className="price">{product.price.toLocaleString()}원</p>
                  <div className="rating">
                    <FaStar />
                    {product.averageRating
                      ? product.averageRating.toFixed(1)
                      : "0.0"}
                    점 ({product.reviewCount || 0}개)
                  </div>
                </div>
              </Link>
              {isLoggedIn && (
                <button
                  className={`wishlist-button ${
                    product.isWishlisted ? "active" : ""
                  }`}
                  onClick={() => handleWishlistToggle(product)}
                >
                  {product.isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 🔥 추천상품 섹션 */}
      <section className="product-section">
        <h2>추천상품</h2>
        <ul className="product-list">
          {recommendedProducts.map((product) => (
            <li className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`}>
                <img
                  src={`http://localhost:8080${product.imageUrl}`}
                  alt={product.name}
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  {/* <p>옵션: {product.option}</p> */}
                  <p className="price">{product.price.toLocaleString()}원</p>
                  <div className="rating">
                    <FaStar />
                    {product.averageRating
                      ? product.averageRating.toFixed(1)
                      : "0.0"}
                    점 ({product.reviewCount || 0}개)
                  </div>
                </div>
              </Link>
              {isLoggedIn && (
                <button
                  className={`wishlist-button ${
                    product.isWishlisted ? "active" : ""
                  }`}
                  onClick={() => handleWishlistToggle(product)}
                >
                  {product.isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
