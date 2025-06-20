import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { loadTossPayments } from "@tosspayments/payment-sdk";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    id: null,
    username: "",
  });

  const { addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { isLoggedIn } = useContext(AuthContext);

  // 상품, 장바구니, 리뷰 관련 상태
  const [product, setProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    imageUrl: "",
    option: "",
    isWishlisted: false,
    options: [],
    reviews: [],
    averageRating: 0,
    reviewCount: 0,
  });
  const [cartItems, setCartItems] = useState([]);
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);

  // 리뷰 입력 상태
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewOption, setReviewOption] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // 🔥 1️⃣ 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUserInfo({
          id: res.data.id,
          username: res.data.username,
        });
      } catch (err) {
        alert("로그인 후 이용 가능합니다!");
        navigate("/login", { replace: true });
      }
    };
    fetchUser();
  }, [navigate]);

  // 상품 상세, 리뷰, 장바구니, 리뷰작성권한 불러오기
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productRes, reviewRes, eligibleRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/product/${id}`),
          api.get(`/products/${id}/review/eligibility`),
        ]);
        setProduct((prev) => ({
          ...productRes.data,
          reviews: reviewRes.data,
        }));
        setIsEligibleToReview(eligibleRes.data);
      } catch (err) {
        alert("상품 정보를 불러오지 못했습니다.");
        navigate("/");
      }
    };
    fetchAll();
  }, [id, navigate]);

  // 🔥 3️⃣ 장바구니 정보 가져오기
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await api.get("/cart");
        setCartItems(res.data);
      } catch (err) {
        console.error("장바구니 불러오기 실패:", err);
      }
    };
    fetchCartItems();
  }, []);

  // 장바구니 중복 체크
  const isProductInCart = cartItems.some(
    (item) => item.productId === product.id
  );

  // 장바구니 담기
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다!");
      navigate("/login");
      return;
    }
    if (isProductInCart) {
      alert("이미 장바구니에 담긴 상품입니다!");
      return;
    }
    try {
      await api.post("/cart", {
        productId: product.id,
        productName: product.name,
        option: product.option || "",
        quantity: 1,
        price: product.price,
      });
      alert("장바구니에 추가되었습니다!");
      setCartItems((prev) => [...prev, { productId: product.id }]);
    } catch (err) {
      console.error("장바구니 추가 실패:", err);
      alert("장바구니 추가 실패");
    }
  };

  // 찜하기/찜 해제
  const handleAddToWishlist = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      if (product.isWishlisted) {
        await removeFromWishlist(product.id);
        alert("찜 해제되었습니다!");
      } else {
        await addToWishlist({
          productId: product.id,
          productName: product.name,
          option: product.option || "",
        });
        alert("찜 목록에 추가되었습니다!");
      }
      setProduct((prev) => ({
        ...prev,
        isWishlisted: !prev.isWishlisted,
      }));
    } catch (err) {
      console.error("찜 상태 변경 실패", err);
      alert("찜 상태 변경 실패");
    }
  };

  // 리뷰 작성
  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/reviews/product/${id}`, {
        title: reviewTitle,
        option: reviewOption,
        content: reviewContent,
        rating: reviewRating,
      });
      alert("리뷰가 등록되었습니다!");
      setReviewTitle("");
      setReviewOption("");
      setReviewContent("");
      setReviewRating(5);
      // 리뷰 목록 갱신
      const res = await api.get(`/reviews/product/${id}`);
      setProduct((prev) => ({
        ...prev,
        reviews: res.data,
      }));
    } catch (err) {
      console.error("리뷰 등록 실패", err);
      alert("리뷰 등록 실패");
    }
  };

  // 바로 결제
  const handlePayment = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다!");
      navigate("/login");
      return;
    }
    try {
      // 1. 주문 생성
      const orderData = {
        order: {
          userId: userInfo.id,
        },
        orderItems: [
          {
            productId: product.id,
            productName: product.name,
            option: product.option || "",
            quantity: 1,
            price: product.price,
          },
        ],
      };
      const orderRes = await api.post("/orders", orderData);
      const orderId = orderRes.data.orderId;

      // 2. 결제 준비
      const paymentData = {
        orderId: orderId, // TossPayments 규칙에 맞춘 String
        amount: product.price,
        orderName: product.name,
        customerName: userInfo.username,
      };
      const res = await api.post("/payments/toss/ready", paymentData);
      const { clientKey, amount } = res.data;

      // 3. 결제창 호출
      const tossPayments = await loadTossPayments(clientKey);
      await tossPayments.requestPayment("카드", {
        amount,
        orderId: `ORDER_${orderId}`,
        orderName: product.name,
        customerName: userInfo.username,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      alert("결제 준비 중 오류가 발생했습니다.", error);
      console.error("결제 준비 실패:", error);
    }
  };

  // 리뷰 추천/비추천
  const handleLike = async (reviewId) => {
    try {
      await api.patch(`/reviews/${reviewId}/like`);
      const res = await api.get(`/reviews/product/${id}`);
      setProduct((prev) => ({
        ...prev,
        reviews: res.data,
      }));
    } catch {}
  };
  const handleDislike = async (reviewId) => {
    try {
      await api.patch(`/reviews/${reviewId}/dislike`);
      const res = await api.get(`/reviews/product/${id}`);
      setProduct((prev) => ({
        ...prev,
        reviews: res.data,
      }));
    } catch {}
  };

  // 렌더링
  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>
      <div>
        <img
          src={`http://localhost:8080${product.imageUrl}`}
          alt={product.name}
          width="200"
          height="200"
          style={{
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        />
      </div>
      <p>설명: {product.description}</p>
      <p>옵션: {product.option}</p>
      <p>가격: {product.price}원</p>
      <p>재고: {product.stockQuantity}개</p>
      <p>
        별점: {product.averageRating?.toFixed(1) || 0}점 (
        {product.reviewCount || 0}개 리뷰)
      </p>

      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button onClick={handleAddToCart} disabled={isProductInCart}>
          {isProductInCart ? "이미 추가됨" : "장바구니 담기"}
        </button>
        <button onClick={handleAddToWishlist}>
          {product.isWishlisted ? "찜 해제" : "찜하기"}
        </button>
        <button onClick={handlePayment}>바로 결제</button>
      </div>

      {/* 리뷰 작성 폼 */}
      {isEligibleToReview ? (
        <div style={{ marginTop: "24px" }}>
          <h2>리뷰 작성</h2>
          <form onSubmit={handleAddReview}>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />
            <br />
            <input
              type="text"
              value={reviewOption}
              onChange={(e) => setReviewOption(e.target.value)}
              placeholder="구매한 옵션을 입력하세요"
              required
            />
            <br />
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="리뷰를 작성하세요"
              required
            />
            <br />
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              required
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{`${r}점`}</option>
              ))}
            </select>
            <br />
            <button type="submit">리뷰 작성</button>
          </form>
        </div>
      ) : (
        <div style={{ marginTop: "24px" }}>
          <h2>리뷰 작성</h2>
          <p>구매한 사용자만 리뷰 작성이 가능합니다.</p>
        </div>
      )}

      {/* 리뷰 목록 */}
      <div style={{ marginTop: "24px" }}>
        <h2>리뷰</h2>
        {(product.reviews || []).length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {product.reviews.map((review) => (
              <li
                key={review.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>{review.username}</strong>
                  <small>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <p style={{ margin: "4px 0" }}>구매 옵션: {review.option}</p>
                <h4 style={{ margin: "4px 0" }}>{review.title}</h4>
                <p>{review.content}</p>
                <p>평점: {review.rating}점</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleLike(review.id)}>
                    👍 {review.likes || 0}
                  </button>
                  <button onClick={() => handleDislike(review.id)}>
                    👎 {review.dislikes || 0}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
