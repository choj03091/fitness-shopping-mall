import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "../styles/ProductManagementPage.scss";
const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("상품 목록 불러오기 실패:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="product-management-page">
      <h1>상품 리스트</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li className="product-card" key={product.id}>
            <img
              src={`http://localhost:8080${product.imageUrl}`}
              alt={product.name}
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>가격: {product.price}원</p>
            </div>
            <button
              className="edit-button"
              onClick={() => navigate(`/product/edit/${product.id}`)}
            >
              수정
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagementPage;
