import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.scss";

const LoginPage = ({ setIsLoggedIn, setIsAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      await api.post("/users/login", { email, password });
      alert("로그인 성공!");
      setIsLoggedIn(true);

      const userRes = await api.get("/users/me");
      setIsAdmin(userRes.data.title?.toUpperCase() === "ADMIN");

      navigate("/");
    } catch (err) {
      setErrorMessage("로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
      console.error("로그인 오류:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>로그인</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
