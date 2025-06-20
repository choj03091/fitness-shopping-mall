import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/MyPage.scss";

const MyPage = () => {
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState([]);

  // 새로고침 시 로그인 상태 확인 및 초기화
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await api.get("/users/me");
        setIsLoggedIn(true);
        setUser(res.data);

        setUserInfo({
          username: res.data.username || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });

        const addressRes = await api.get(`/addresses/user/${res.data.id}`);
        setAddresses(addressRes.data);
      } catch (err) {
        console.error("사용자 정보 가져오기 실패:", err);
        setIsLoggedIn(false);
        setUser(null);
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    };

    checkLoginStatus();
  }, [setIsLoggedIn, setUser, navigate]);

  return (
    <div className="mypage">
      <h1>마이페이지</h1>
      <section className="user-info">
        <h2>내 정보</h2>
        <p>
          <strong>이름:</strong> {userInfo.username}
        </p>
        <p>
          <strong>이메일:</strong> {userInfo.email}
        </p>
        <p>
          <strong>전화번호:</strong> {userInfo.phone}
        </p>
      </section>
      <section className="addresses">
        <h2>내 배송지</h2>
        {addresses.length === 0 ? (
          <p>등록된 배송지가 없습니다.</p>
        ) : (
          <ul>
            {addresses.map((addr) => (
              <li key={addr.id}>
                <p>
                  {addr.address} {addr.addressDetail} ({addr.zipcode})
                </p>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => navigate("/mypage/address/add")}>
          배송지 추가
        </button>
      </section>
    </div>
  );
};

export default MyPage;
