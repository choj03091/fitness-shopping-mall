import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/OrderPage.scss";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.get("/users/me");
        const userId = res.data.id;
        fetchOrders(userId);
      } catch (err) {
        alert("로그인 후 이용 가능합니다!");
        navigate("/login", { replace: true });
      }
    };

    const fetchOrders = async (userId) => {
      try {
        const res = await api.get(`/orders/user/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error("주문 목록 조회 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, [navigate]);

  if (isLoading) return <div>로딩 중...</div>;

  // 주문별 총 결제 금액 계산 함수
  const getOrderTotal = (order) =>
    (order.orderItems || []).reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

  return (
    <div className="order-page">
      <h1>주문 내역</h1>
      {orders.length === 0 ? (
        <p className="empty-message">주문 내역이 없습니다.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-info">
              <strong>주문번호:</strong> {order.id}
            </div>
            <div className="order-info">
              <strong>주문일자:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </div>
            <div className="order-info">
              <strong>주문상태:</strong> {order.status}
            </div>
            <div className="order-info">
              <strong>배송지:</strong> {order.address} {order.addressDetail} (
              {order.zipcode})
            </div>
            <div className="order-total">
              총 결제 금액: {getOrderTotal(order).toLocaleString()}원
            </div>
            {order.orderItems && order.orderItems.length > 0 ? (
              <ul>
                {order.orderItems.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img
                      src={`http://localhost:8080${
                        item.imageUrl || "/default.png"
                      }`}
                      alt={item.productName}
                    />
                    <div className="product-info">
                      <div className="product-name">{item.productName}</div>
                      <div>옵션: {item.option || "선택 없음"}</div>
                      <div>수량: {item.quantity}개</div>
                      <div className="product-price">
                        가격: {item.price.toLocaleString()}원
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-message">주문 상세가 없습니다.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderPage;
