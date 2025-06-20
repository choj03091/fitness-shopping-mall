import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/AddressPage.scss";

const AddressPage = () => {
  const { user, setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [newAddressDetail, setNewAddressDetail] = useState("");
  const [newZipcode, setNewZipcode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/users/me");
        setIsLoggedIn(true);
        setUser(res.data);
        const addressRes = await api.get(`/addresses/user/${res.data.id}`);
        setAddresses(addressRes.data);
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate, setIsLoggedIn, setUser]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress || !newZipcode) {
      alert("주소와 우편번호를 입력해주세요.");
      return;
    }
    try {
      await api.post("/addresses", {
        userId: user.id,
        address: newAddress,
        addressDetail: newAddressDetail,
        zipcode: newZipcode,
      });
      alert("주소가 등록되었습니다!");
      setNewAddress("");
      setNewAddressDetail("");
      setNewZipcode("");
      // reload
      const res = await api.get(`/addresses/user/${user.id}`);
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
      alert("주소 등록 실패");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      alert("주소가 삭제되었습니다!");
    } catch (err) {
      console.error(err);
      alert("주소 삭제 실패");
    }
  };

  return (
    <div className="address-page">
      <h1>배송지 관리</h1>
      <section className="address-list">
        <h2>등록된 배송지</h2>
        {addresses.length === 0 ? (
          <p>등록된 배송지가 없습니다.</p>
        ) : (
          <ul>
            {addresses.map((addr) => (
              <li key={addr.id}>
                <p>
                  {addr.address} {addr.addressDetail} ({addr.zipcode})
                </p>
                <button onClick={() => handleDeleteAddress(addr.id)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="address-form">
        <h2>배송지 추가</h2>
        <form onSubmit={handleAddAddress}>
          <input
            type="text"
            placeholder="주소"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="상세주소"
            value={newAddressDetail}
            onChange={(e) => setNewAddressDetail(e.target.value)}
          />
          <input
            type="text"
            placeholder="우편번호"
            value={newZipcode}
            onChange={(e) => setNewZipcode(e.target.value)}
            required
          />
          <button type="submit">배송지 등록</button>
        </form>
      </section>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
};

export default AddressPage;
