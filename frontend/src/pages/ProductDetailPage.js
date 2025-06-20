import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import "../styles/ProductDetailPage.scss";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { isLoggedIn } = useContext(AuthContext);

  const [product, setProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    imageUrl: "",
    option: "",
    isWishlisted: false,
    reviews: [],
    averageRating: 0,
    reviewCount: 0,
  });

  const [cartItems, setCartItems] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);

  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewOption, setReviewOption] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // 상품 상세, 리뷰, 리뷰 작성 권한 가져오기
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productRes, reviewRes, eligibleRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/product/${id}`),
          api.get(`/products/${id}/review/eligibility`),
        ]);
        let isWishlisted = false;
        if (isLoggedIn) {
          try {
            const wishlistRes = await api.get("/wishlist");
            isWishlisted = wishlistRes.data.some(
              (item) => item.productId === productRes.data.id
            );
          } catch {
            // ignore
          }
        }
        setProduct({
          ...productRes.data,
          reviews: reviewRes.data,
          isWishlisted,
        });
        setIsEligibleToReview(eligibleRes.data);
      } catch (err) {
        alert("상품 정보를 불러오지 못했습니다.");
        navigate("/");
      }
    };
    fetchAll();
  }, [id, navigate, isLoggedIn]);

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

  const isProductInCart = cartItems.some(
    (item) => item.productId === product.id
  );

  const handleQuantityChange = (delta) => {
    const newQuantity = productQuantity + delta;
    if (newQuantity < 1) {
      alert("수량은 1개 이상이어야 합니다.");
      return;
    }
    if (newQuantity > product.stockQuantity) {
      alert(
        `재고가 부족합니다. 최대 ${product.stockQuantity}개까지 구매 가능합니다.`
      );
      return;
    }
    setProductQuantity(newQuantity);
  };

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
        quantity: productQuantity,
        price: product.price,
      });
      alert("장바구니에 추가되었습니다!");
      setCartItems((prev) => [...prev, { productId: product.id }]);
    } catch (err) {
      console.error("장바구니 추가 실패:", err);
      alert("장바구니 추가 실패");
    }
  };

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

  const handleOrderPage = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다!");
      navigate("/login");
      return;
    }
    if (product.price === 0) {
      alert("상품 정보를 불러오는 중입니다. 잠시 후 시도해주세요.");
      return;
    }
    const selectedItem = {
      productId: product.id,
      productName: product.name,
      option: product.option || "",
      quantity: productQuantity,
      price: product.price,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
    };
    navigate("/ordercheck", { state: { selectedItems: [selectedItem] } });
  };

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

  const handleLike = async (reviewId) => {
    try {
      const res = await api.patch(`/reviews/${reviewId}/like`);
      alert(res.data); // 서버 응답 메시지를 alert로 띄우기
      const refreshed = await api.get(`/reviews/product/${id}`);
      setProduct((prev) => ({
        ...prev,
        reviews: refreshed.data,
      }));
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data); // 서버에서 보낸 오류 메시지를 alert로 띄우기
      } else {
        alert("좋아요 처리 중 오류가 발생했습니다.");
      }
      console.error("좋아요 오류:", error);
    }
  };

  const handleDislike = async (reviewId) => {
    try {
      const res = await api.patch(`/reviews/${reviewId}/dislike`);
      alert(res.data); // 서버 응답 메시지를 alert로 띄우기
      const refreshed = await api.get(`/reviews/product/${id}`);
      setProduct((prev) => ({
        ...prev,
        reviews: refreshed.data,
      }));
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data); // 서버에서 보낸 오류 메시지를 alert로 띄우기
      } else {
        alert("싫어요 처리 중 오류가 발생했습니다.");
      }
      console.error("싫어요 오류:", error);
    }
  };

  return (
    <div className="product-detail">
      <div className="product-header">
        <div className="product-image">
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
          />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="price">{product.price.toLocaleString()}원</p>
          <p>재고: {product.stockQuantity}개</p>
          <p>
            ⭐ {product.averageRating?.toFixed(1) || 0}점 (
            {product.reviewCount || 0}개 리뷰)
          </p>

          <div className="quantity-controls">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={productQuantity <= 1}
            >
              -
            </button>
            <span>{productQuantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={productQuantity >= product.stockQuantity}
            >
              +
            </button>
          </div>

          <p className="total-price">
            총 결제 금액: {(product.price * productQuantity).toLocaleString()}원
          </p>

          <div className="action-buttons">
            <button onClick={handleAddToCart} disabled={isProductInCart}>
              {isProductInCart ? "이미 담음" : "장바구니 담기"}
            </button>
            <button onClick={handleAddToWishlist}>
              {product.isWishlisted ? "❤️ 찜 해제" : "🤍 찜하기"}
            </button>
            <button onClick={handleOrderPage}>바로 결제</button>
          </div>
        </div>
      </div>

      <div className="review-form">
        <h2>리뷰 작성</h2>
        {isEligibleToReview ? (
          <form onSubmit={handleAddReview}>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="리뷰를 작성해주세요"
              required
            ></textarea>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              required
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{`${r}점`}</option>
              ))}
            </select>
            <button type="submit">리뷰 작성</button>
          </form>
        ) : (
          <p>구매한 사용자만 리뷰 작성이 가능합니다.</p>
        )}
      </div>

      <div className="review-list">
        <h2>리뷰</h2>
        {product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <strong>{review.username}</strong>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
              <h4>{review.title}</h4>
              <p>{review.content}</p>
              <p>평점: {review.rating}점</p>
              <div className="review-actions">
                <button onClick={() => handleLike(review.id)}>
                  👍 {review.likes || 0}
                </button>
                <button onClick={() => handleDislike(review.id)}>
                  👎 {review.dislikes || 0}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
