import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Header.scss";

const Header = ({ isLoggedIn, isAdmin, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);

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

  // 부모 카테고리와 자식 카테고리를 나누어 보기 좋게 변환
  const parentCategories = categories.filter((cat) => cat.parentId === null);
  const getChildCategories = (parentId) =>
    categories.filter((cat) => cat.parentId === parentId);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      alert("로그아웃 성공!");
      setIsLoggedIn(false);
      navigate("/");
    } catch (err) {
      alert("로그아웃 실패");
      console.error(err);
    }
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-links">
          {!isLoggedIn && (
            <>
              <Link to="/signup">회원가입</Link>
              <Link to="/login">로그인</Link>
            </>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="logo" onClick={() => navigate("/")}>
          <span>FitnessShop</span>
        </div>
        <div className="icons">
          <Link to="/cart">장바구니</Link>
          <Link to="/wishlist">찜목록</Link>
          <Link to="/order">주문조회</Link>
          {isLoggedIn && (
            <>
              <Link to="/mypage">마이페이지</Link>
              {isAdmin && (
                <>
                  <Link to="/product/register">상품등록</Link>
                  <Link to="/product/manage">상품관리</Link>
                </>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav">
        {parentCategories.map((parent) => (
          <div
            key={parent.id}
            className="nav-item"
            onMouseEnter={() => setHoveredCategory(parent.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link to={`/category/${parent.name}`}>{parent.name}</Link>
            {hoveredCategory === parent.id && (
              <div className="dropdown">
                {getChildCategories(parent.id).map((child) => (
                  <Link
                    key={child.id}
                    to={`/category/${parent.name}/${child.name}`}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Header;
