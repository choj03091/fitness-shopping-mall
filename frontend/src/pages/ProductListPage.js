// src/pages/ProductListPage.js

import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { WishlistContext } from "../context/WishlistContext";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import "../styles/ProductListPage.scss";

const ProductListPage = () => {
  const { parentCategoryName, subCategoryName } = useParams();
  const decodedParent = decodeURIComponent(parentCategoryName);
  const decodedSub = subCategoryName
    ? decodeURIComponent(subCategoryName)
    : null;

  const [products, setProducts] = useState([]);
  const { addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `/products`;
        if (decodedSub) {
          // 작은 카테고리로 필터링
          const categoryRes = await api.get("/categories");
          const subCategory = categoryRes.data.find(
            (cat) => cat.name === decodedSub
          );
          if (subCategory) {
            url += `?categoryId=${subCategory.id}`;
          }
        } else if (decodedParent) {
          // 부모 카테고리로 필터링
          const categoryRes = await api.get("/categories");
          const parentCategory = categoryRes.data.find(
            (cat) => cat.name === decodedParent
          );
          if (parentCategory) {
            url += `?parentCategoryId=${parentCategory.id}`;
          }
        }
        const productRes = await api.get(url);

        // (찜 상태 처리) 생략 가능
        const updatedProducts = productRes.data.map((product) => ({
          ...product,
          isWishlisted: false, // 기본값 (로그인 상태라면 서버에서 받아오도록 수정 가능)
        }));

        setProducts(updatedProducts);
      } catch (err) {
        console.error("상품 목록 불러오기 실패:", err);
      }
    };

    fetchProducts();
  }, [decodedParent, decodedSub]);

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

  return (
    <div className="product-list-page">
      <h1>
        {decodedParent}
        {decodedSub && ` > ${decodedSub}`}
      </h1>
      <ul className="product-list">
        {products.map((product) => (
          <li className="product-card" key={product.id}>
            <Link to={`/product/${product.id}`}>
              <img
                src={`http://localhost:8080${product.imageUrl}`}
                alt={product.name}
              />
              <div className="product-info">
                <h3>{product.name}</h3>
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
            <button
              className={`wishlist-button ${
                product.isWishlisted ? "active" : ""
              }`}
              onClick={() => handleWishlistToggle(product)}
            >
              {product.isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductListPage;
