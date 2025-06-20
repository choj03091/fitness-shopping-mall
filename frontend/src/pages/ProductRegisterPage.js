import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "../styles/ProductRegisterPage.scss";

const ProductRegisterPage = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrl: "",
    categoryId: "",
    option: "",
    discountRate: "",
  });

  const [categories, setCategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [filteredChildCategories, setFilteredChildCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("카테고리 불러오기 실패:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParentCategoryChange = (e) => {
    const parentId = e.target.value;
    setSelectedParentCategory(parentId);
    const childCategories = categories.filter(
      (cat) => cat.parentId === Number(parentId)
    );
    setFilteredChildCategories(childCategories);
    setProduct((prev) => ({
      ...prev,
      categoryId: "", // 작은 카테고리 초기화
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProduct((prev) => ({
        ...prev,
        imageUrl: res.data.url,
      }));
      alert("이미지 업로드 성공!");
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert("이미지 업로드 실패");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", {
        ...product,
        price: Number(product.price),
        stockQuantity: Number(product.stockQuantity),
        discountRate: Number(product.discountRate),
        categoryId: Number(product.categoryId),
      });
      alert("상품 등록 완료");
      navigate("/");
    } catch (err) {
      alert("상품 등록 실패");
      console.error(err);
    }
  };

  return (
    <div className="product-register-page">
      <h1>상품 등록</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="상품명"
          value={product.name}
          onChange={handleChange}
        />
        <br />
        <textarea
          name="description"
          placeholder="상품 설명"
          value={product.description}
          onChange={handleChange}
        ></textarea>
        <br />
        <input
          name="price"
          type="number"
          placeholder="가격"
          value={product.price}
          onChange={handleChange}
        />
        <br />
        <input
          name="stockQuantity"
          type="number"
          placeholder="재고수량"
          value={product.stockQuantity}
          onChange={handleChange}
        />
        <br />
        <input type="file" onChange={handleImageUpload} />
        <br />
        {product.imageUrl && (
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt="업로드된 이미지"
            width="100"
          />
        )}
        <br />
        <label>큰 카테고리</label>
        <select
          value={selectedParentCategory}
          onChange={handleParentCategoryChange}
        >
          <option value="">선택하세요</option>
          {categories
            .filter((cat) => cat.parentId === null)
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
        <br />
        <label>작은 카테고리</label>
        <select
          name="categoryId"
          value={product.categoryId}
          onChange={handleChange}
          disabled={!selectedParentCategory}
        >
          <option value="">선택하세요</option>
          {filteredChildCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <br />
        <input
          name="option"
          placeholder="옵션"
          value={product.option}
          onChange={handleChange}
        />
        <br />
        <input
          name="discountRate"
          type="number"
          placeholder="할인율"
          value={product.discountRate}
          onChange={handleChange}
        />
        <br />
        <button type="submit">상품 등록</button>
      </form>
    </div>
  );
};

export default ProductRegisterPage;
