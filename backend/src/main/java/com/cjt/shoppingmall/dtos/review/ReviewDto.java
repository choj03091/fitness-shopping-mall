package com.cjt.shoppingmall.dtos.review;

import lombok.Data;

@Data
public class ReviewDto {
    private Long id;
    private Long productId;
    private Long userId;
    private Long orderId;
    private String username;
    private String option;
    private String title;
    private String content;
    private int rating;
    private int likes;
    private int dislikes;
    private String createdAt;
}
