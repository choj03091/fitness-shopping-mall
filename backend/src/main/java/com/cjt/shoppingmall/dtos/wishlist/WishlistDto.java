package com.cjt.shoppingmall.dtos.wishlist;

import lombok.Data;

@Data
public class WishlistDto {
    private Long id;
    private Long userId;
    private Long productId;
    private String productName;
    private String option;
    private String createdAt;
}
