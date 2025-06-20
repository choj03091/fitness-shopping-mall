import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductOptionRegisterPage.scss";
const ProductOptionRegisterPage = () => {
  const { productId } = useParams(); // 상품ID 가져오기
  const navigate = useNavigate();

  const [product, setProduct] = useState(null); // 상품 정보
  const [option, setOption] = useState({
    optionName: "",
    optionValue: "",
    extraPrice: "",
    stockQuantity: "",
  });

  useEffect(() => {
    // 상품 정보 불러오기 (뷰 표시)
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error("상품 정보 불러오기 실패:", err);
        alert("상품 정보를 불러오지 못했습니다.");
        navigate("/");
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOption((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${productId}/options`, {
        ...option,
        extraPrice: Number(option.extraPrice),
        stockQuantity: Number(option.stockQuantity),
      });
      alert("옵션 등록 완료");
      // 등록 후 옵션 등록 페이지 새로고침 or 옵션 리스트 페이지로 이동
      setOption({
        optionName: "",
        optionValue: "",
        extraPrice: "",
        stockQuantity: "",
      });
    } catch (err) {
      alert("옵션 등록 실패");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>상품 옵션 등록</h1>
      {product && (
        <div>
          <h3>상품명: {product.name}</h3>
          <p>기본 가격: {product.price}원</p>
          <p>카테고리: {product.categoryId}</p>
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt="상품 이미지"
            width="100"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          name="optionName"
          placeholder="옵션명 (예: 무게, 색상)"
          value={option.optionName}
          onChange={handleChange}
        />
        <br />
        <input
          name="optionValue"
          placeholder="옵션값 (예: 3kg, Red)"
          value={option.optionValue}
          onChange={handleChange}
        />
        <br />
        <input
          name="extraPrice"
          type="number"
          placeholder="추가금액"
          value={option.extraPrice}
          onChange={handleChange}
        />
        <br />
        <input
          name="stockQuantity"
          type="number"
          placeholder="재고수량"
          value={option.stockQuantity}
          onChange={handleChange}
        />
        <br />
        <button type="submit">옵션 등록</button>
      </form>
    </div>
  );
};

export default ProductOptionRegisterPage;
