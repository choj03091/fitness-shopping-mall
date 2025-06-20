package com.cjt.shoppingmall.dtos.products;

import lombok.Data;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private int price;
    private int stockQuantity;
    private String imageUrl;
    private String category;
    private String subcategory;
    private String option;
    private int discountRate;
    private String createdAt;
}
