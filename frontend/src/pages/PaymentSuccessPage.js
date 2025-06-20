import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/PaymentSuccessPage.scss";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const paymentKey = searchParams.get("paymentKey");
        const orderIdParam = searchParams.get("orderId");
        const amount = searchParams.get("amount");

        setOrderId(orderIdParam);

        if (!paymentKey || !orderIdParam || !amount) {
          alert("결제 정보가 올바르지 않습니다.");
          navigate("/");
          return;
        }

        // TossPayments 결제 승인 단계 호출
        await api.post("/payments/toss/confirm", {
          paymentKey,
          orderId: orderIdParam,
          amount: parseInt(amount, 10),
        });

        // 장바구니 비우기
        await api.delete("/cart/all");
      } catch (err) {
        console.error("결제 승인 실패:", err);
        alert("결제 승인 실패");
        navigate("/");
      }
    };

    confirmPayment();
    // eslint-disable-next-line
  }, [navigate, searchParams]);

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: 480,
        margin: "40px auto",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
        alt="success"
        width={80}
        style={{ marginBottom: 24 }}
      />
      <h1 style={{ color: "#1976d2", marginBottom: 12 }}>
        결제가 완료되었습니다!
      </h1>
      <p style={{ fontSize: 18, marginBottom: 8 }}>
        주문번호{" "}
        <b style={{ color: "#1976d2" }}>{orderId?.replace("ORDER_", "")}</b>
      </p>
      <p style={{ color: "#555", marginBottom: 24 }}>
        결제가 정상적으로 처리되었습니다.
        <br />
        주문 내역은 <b>마이페이지 &gt; 주문내역</b>에서 확인하실 수 있습니다.
      </p>
      <button
        style={{
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "12px 32px",
          fontSize: 16,
          cursor: "pointer",
          marginRight: 8,
        }}
        onClick={() => navigate("/order")}
      >
        주문내역 보기
      </button>
      <button
        style={{
          background: "#eee",
          color: "#333",
          border: "none",
          borderRadius: "8px",
          padding: "12px 32px",
          fontSize: 16,
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        홈으로
      </button>
    </div>
  );
};

export default PaymentSuccessPage;
