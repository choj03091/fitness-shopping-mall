package com.cjt.shoppingmall.dtos.carts;

import lombok.Data;

@Data
public class CartDto {
    private Long id;
    private Long userId;
    private Long productId;
    private Long productOptionId;
    private String productName;
    private String option;
    private int quantity;
    private int price;
    private String imageUrl;
    private int stockQuantity;
}