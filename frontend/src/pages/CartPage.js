import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles/CartPage.scss";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await api.get("/users/me");
        fetchCartItems();
      } catch (err) {
        alert("로그인 후 이용 가능합니다!");
        navigate("/login", { replace: true });
        return;
      }
    };

    const fetchCartItems = async () => {
      try {
        const res = await api.get("/cart");
        setCartItems(res.data);
      } catch (err) {
        console.error("장바구니 불러오기 실패:", err);
        alert("장바구니를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, [navigate]);

  if (isLoading) return null;

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.delete(`/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      alert("상품이 삭제되었습니다!");
    } catch (err) {
      console.error("장바구니 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleQuantityChange = (item, delta) => {
    const updatedQuantity = item.quantity + delta;

    if (updatedQuantity < 1) {
      alert("수량은 1 이상이어야 합니다.");
      return;
    }

    if (updatedQuantity > item.stockQuantity) {
      alert(
        `재고가 부족합니다. 최대 수량은 ${item.stockQuantity}개까지 가능합니다.`
      );
      return;
    }

    // 프론트 업데이트
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: updatedQuantity }
          : cartItem
      )
    );

    // 백엔드 PATCH 요청
    updateCartQuantity(item.id, updatedQuantity);
  };

  const updateCartQuantity = async (cartId, quantity) => {
    try {
      await api.patch(`/cart/${cartId}`, { quantity });
      // 성공 시 추가 작업 X
    } catch (err) {
      console.error("수량 업데이트 실패:", err);
      alert("수량 변경 실패");
    }
  };
  // 선택 체크박스 토글
  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // const handleCartPayment = async () => {
  //   if (!isLoggedIn) {
  //     alert("로그인 후 이용 가능합니다!");
  //     navigate("/login");
  //     return;
  //   }
  //   const selectedCartItems = cartItems.filter((item) =>
  //     selectedItems.includes(item.id)
  //   );
  //   if (selectedCartItems.length === 0) {
  //     alert("결제할 상품을 선택하세요.");
  //     return;
  //   }
  //   if (cartItems.length === 0) {
  //     alert("장바구니가 비어 있습니다.");
  //     return;
  //   }
  //   const itemsToPay = cartItems.filter((item) =>
  //     selectedItems.includes(item.id)
  //   );
  //   if (itemsToPay.length === 0) {
  //     alert("선택된 상품이 없습니다.");
  //     return;
  //   }

  //   try {
  //     // 1️⃣ 주문 데이터
  //     const orderData = {
  //       order: {
  //         userId: user.id,
  //       },
  //       orderItems: cartItems.map((item) => ({
  //         productId: item.productId,
  //         productName: item.productName,
  //         option: item.option || "",
  //         quantity: item.quantity,
  //         price: item.price,
  //       })),
  //     };

  //     // 2️⃣ 주문 생성
  //     const orderRes = await api.post("/orders", orderData);
  //     const orderId = orderRes.data.orderId;

  //     // 3️⃣ 결제 준비
  //     const totalAmount = cartItems.reduce(
  //       (sum, item) => sum + item.price * item.quantity,
  //       0
  //     );

  //     const paymentData = {
  //       orderId: orderId, // TossPayments 규칙에 맞춘 String
  //       amount: totalAmount,
  //       orderName: "장바구니 상품",
  //       customerName: user.username,
  //     };

  //     const res = await api.post("/payments/toss/ready", paymentData);
  //     const { clientKey, amount } = res.data;
  //     const tossPayments = await loadTossPayments(clientKey);
  //     await tossPayments.requestPayment("카드", {
  //       amount,
  //       orderId: `ORDER_${orderId}`,
  //       orderName: "장바구니 상품",
  //       customerName: user.username,
  //       successUrl: `${window.location.origin}/payment/success`,
  //       failUrl: `${window.location.origin}/payment/fail`,
  //     });
  //   } catch (error) {
  //     console.error("장바구니 결제 준비 실패:", error);
  //     alert("장바구니 결제 준비 중 오류가 발생했습니다.");
  //   }
  // };
  const handleOrderPage = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다!");
      navigate("/login");
      return;
    }
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (selectedCartItems.length === 0) {
      alert("결제할 상품을 선택하세요.");
      return;
    }
    navigate("/ordercheck", { state: { selectedItems: selectedCartItems } });
  };
  return (
    <div className="cart-page">
      <h1>장바구니</h1>
      {cartItems.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                />
                <Link
                  to={`/product/${item.productId}`}
                  className="product-link"
                >
                  <img
                    src={`http://localhost:8080${item.imageUrl}`}
                    alt={item.productName}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3>{item.productName}</h3>
                    <p>가격: {item.price.toLocaleString()}원</p>
                    <p>재고: {item.stockQuantity}개</p>
                    {item.stockQuantity <= 10 && (
                      <p className="low-stock">
                        마감 임박! 재고가 얼마 안 남았어요! (
                        {item.stockQuantity}개 남음)
                      </p>
                    )}
                    <div className="quantity-controls">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuantityChange(item, -1);
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuantityChange(item, 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </Link>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>

          {/* ✅ 총 결제 금액 표시 */}
          <div className="total-amount">
            총 결제 금액:{" "}
            {cartItems
              .filter((item) => selectedItems.includes(item.id))
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toLocaleString()}
            원
          </div>

          {/* ✅ 주문/결제 페이지 이동 버튼 */}
          <div className="checkout-button">
            <button
              onClick={handleOrderPage}
              disabled={selectedItems.length === 0}
            >
              주문/결제 페이지로 이동
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
