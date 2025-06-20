package com.cjt.shoppingmall.mapper;

import java.util.List;
import com.cjt.shoppingmall.command.Review;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReviewMapper {
    List<Review> findByProductId(Long productId);
    void insert(Review review);
    void update(Review review);
    void delete(Long id);
    void increaseLike(Long id);
    void decreaseLike(Long id); 
    void increaseDislike(Long id);
    void decreaseDislike(Long id);

    
 // 좋아요/싫어요 중복 체크 (review_likes 테이블)
    Boolean getUserReviewLikeStatus(@Param("userId") Long userId, @Param("reviewId") Long reviewId);
    void insertUserReviewLike(@Param("userId") Long userId, @Param("reviewId") Long reviewId, @Param("isLike") Boolean isLike);
    void updateUserReviewLike(@Param("userId") Long userId, @Param("reviewId") Long reviewId, @Param("isLike") Boolean isLike);  // 🔥 추가

}
