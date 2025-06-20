package com.cjt.shoppingmall.controller;

import java.util.List;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cjt.shoppingmall.command.Review;
import com.cjt.shoppingmall.service.ReviewService;
import com.cjt.shoppingmall.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable("productId") Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<String> addReview(@PathVariable("productId") Long productId,
                                            @RequestBody Review review,
                                            HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUser");
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        var user = userService.getUserById(userId);
        review.setUserId(userId);
        review.setProductId(productId);
        reviewService.addReview(review);
        return ResponseEntity.ok("리뷰가 등록되었습니다.");
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId, null); // productId는 필요 없으면 null
        return ResponseEntity.ok("리뷰 삭제 완료!");
    }

    @PatchMapping("/{reviewId}")
    public ResponseEntity<String> updateReview(@PathVariable Long reviewId,
                                               @RequestBody Review review) {
        review.setId(reviewId);
        reviewService.updateReview(review);
        return ResponseEntity.ok("리뷰 수정 완료!");
    }
    
    @PatchMapping("/{reviewId}/like")
    public ResponseEntity<String> likeReview(
            @PathVariable("reviewId") Long reviewId,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUser");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            reviewService.likeReview(userId, reviewId);
            return ResponseEntity.ok("리뷰에 좋아요를 눌렀습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{reviewId}/dislike")
    public ResponseEntity<String> dislikeReview(
            @PathVariable("reviewId") Long reviewId,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUser");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            reviewService.dislikeReview(userId, reviewId);
            return ResponseEntity.ok("리뷰에 싫어요를 눌렀습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
