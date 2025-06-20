import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import "../styles/OrderCheckPage.scss";

const OrderCheckPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || []; // 선택한 상품

  const [userInfo, setUserInfo] = useState({});
  const [addresses, setAddresses] = useState([]); // 기존 주소 리스트
  const [selectedAddressId, setSelectedAddressId] = useState(null); // 선택된 주소 ID

  // 신규 주소 등록용
  const [newAddress, setNewAddress] = useState("");
  const [newAddressDetail, setNewAddressDetail] = useState("");
  const [newZipcode, setNewZipcode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/users/me");
        setUserInfo(userRes.data);
        const addrRes = await api.get(`/addresses/user/${userRes.data.id}`);
        setAddresses(addrRes.data);
        if (addrRes.data.length > 0) {
          setSelectedAddressId(addrRes.data[0].id);
        }
      } catch (err) {
        alert("주문 정보를 불러오지 못했습니다.");
        navigate("/cart");
      }
    };
    fetchData();
  }, [navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress || !newZipcode) {
      alert("주소와 우편번호를 입력해주세요.");
      return;
    }
    try {
      await api.post("/addresses", {
        userId: userInfo.id,
        address: newAddress,
        addressDetail: newAddressDetail,
        zipcode: newZipcode,
      });
      alert("주소가 등록되었습니다!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("주소 등록 실패");
    }
  };

  const handlePayment = async () => {
    const selectedAddress = addresses.find(
      (addr) => addr.id === selectedAddressId
    );
    if (!selectedAddress) {
      alert("배송지를 선택해주세요.");
      return;
    }

    const totalAmount = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      const orderData = {
        order: {
          userId: userInfo.id,
          address: selectedAddress.address,
          addressDetail: selectedAddress.addressDetail,
          zipcode: selectedAddress.zipcode,
        },
        orderItems: selectedItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          option: item.option || "",
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const orderRes = await api.post("/orders", orderData);
      const orderId = orderRes.data.orderId;

      const paymentData = {
        orderId: orderId,
        amount: totalAmount,
        orderName: "주문상품",
        customerName: userInfo.username,
      };

      const paymentRes = await api.post("/payments/toss/ready", paymentData);
      const { clientKey, amount } = paymentRes.data;

      const tossPayments = await loadTossPayments(clientKey);
      await tossPayments.requestPayment("카드", {
        amount,
        orderId: `ORDER_${orderId}`,
        orderName: "주문상품",
        customerName: userInfo.username,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      alert("결제 준비 실패");
      console.error(err);
    }
  };

  return (
    <div className="order-check-page">
      <h1>주문/결제</h1>

      {/* 배송지 선택 */}
      <section className="address-section">
        <h2>배송지</h2>
        {addresses.length > 0 ? (
          <>
            <ul>
              {addresses.map((addr) => (
                <li key={addr.id}>
                  <label>
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />
                    {addr.address} {addr.addressDetail} ({addr.zipcode})
                  </label>
                </li>
              ))}
            </ul>
            <p>휴대폰: {userInfo.phone}</p>
            <button onClick={() => navigate("/mypage/address/add")}>
              배송지 관리
            </button>
          </>
        ) : (
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
            <button type="submit">배송지 등록하기</button>
          </form>
        )}
      </section>

      {/* 주문상품 */}
      <section className="order-items">
        <h2>주문 상품</h2>
        <ul>
          {selectedItems.map((item) => (
            <li key={item.productId}>
              {item.productName} - {item.option} - {item.price.toLocaleString()}
              원 x {item.quantity}
            </li>
          ))}
        </ul>
      </section>

      {/* 결제 */}
      <section className="order-summary">
        <h2>결제 금액</h2>
        <p>
          총 결제 금액:{" "}
          {selectedItems
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toLocaleString()}
          원
        </p>
        <button onClick={handlePayment}>결제하기</button>
      </section>
    </div>
  );
};

export default OrderCheckPage;
