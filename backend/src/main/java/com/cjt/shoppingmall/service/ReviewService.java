package com.cjt.shoppingmall.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cjt.shoppingmall.command.Review;
import com.cjt.shoppingmall.mapper.ProductMapper;
import com.cjt.shoppingmall.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {
	private final ReviewMapper reviewMapper;
	private final ProductMapper productMapper;

	// 상품별 리뷰 조회
	public List<Review> getReviewsByProductId(Long productId) {
		return reviewMapper.findByProductId(productId);
	}

	@Transactional
	public void addReview(Review review) {
		reviewMapper.insert(review);
		productMapper.updateProductRating(review.getProductId());
	}

	@Transactional
	public void updateReview(Review review) {
		reviewMapper.update(review);
		productMapper.updateProductRating(review.getProductId());
	}

	@Transactional
	public void deleteReview(Long reviewId, Long productId) {
		reviewMapper.delete(reviewId);
		productMapper.updateProductRating(productId);
	}

	public void likeReview(Long userId, Long reviewId) {
	    Boolean currentStatus = reviewMapper.getUserReviewLikeStatus(userId, reviewId);
	    if (currentStatus == null) {
	        // 첫 좋아요
	        reviewMapper.insertUserReviewLike(userId, reviewId, true);
	        reviewMapper.increaseLike(reviewId);
	    } else if (!currentStatus) {
	        // 싫어요 상태 -> 좋아요 전환
	        reviewMapper.updateUserReviewLike(userId, reviewId, true);
	        reviewMapper.increaseLike(reviewId);
	        reviewMapper.decreaseDislike(reviewId);
	    } else {
	        throw new IllegalStateException("이미 좋아요를 누르셨습니다.");
	    }
	}

	public void dislikeReview(Long userId, Long reviewId) {
	    Boolean currentStatus = reviewMapper.getUserReviewLikeStatus(userId, reviewId);
	    if (currentStatus == null) {
	        // 첫 싫어요
	        reviewMapper.insertUserReviewLike(userId, reviewId, false);
	        reviewMapper.increaseDislike(reviewId);
	    } else if (currentStatus) {
	        // 좋아요 상태 -> 싫어요 전환
	        reviewMapper.updateUserReviewLike(userId, reviewId, false);
	        reviewMapper.increaseDislike(reviewId);
	        reviewMapper.decreaseLike(reviewId);
	    } else {
	        throw new IllegalStateException("이미 싫어요를 누르셨습니다.");
	    }
	}
}
