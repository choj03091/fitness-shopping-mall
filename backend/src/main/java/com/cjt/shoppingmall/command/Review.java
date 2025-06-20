package com.cjt.shoppingmall.command;

import lombok.Data;

@Data
public class Review {
    private Long id;
    private Long productId;
    private Long userId;
    private Long orderId;  // nullable
    private String title;
    private String content;
    private Integer rating;
    private String createdAt;  
    private Integer likes;     // 👈 추가
    private Integer dislikes;  // 👈 추가
}
