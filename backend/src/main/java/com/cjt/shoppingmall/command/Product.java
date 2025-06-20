package com.cjt.shoppingmall.command;

import lombok.Data;

@Data
public class Product {
	private Long id;
	private String name;
	private String description;
	private int price;
	private float averageRating;
	private int reviewCount;
	private int stockQuantity;
	private String imageUrl;
	private int discountRate;
	private String createdAt;
	private Long categoryId;
    private String option;
}
