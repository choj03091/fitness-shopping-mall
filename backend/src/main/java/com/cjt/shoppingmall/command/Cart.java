package com.cjt.shoppingmall.command;

import lombok.Data;

@Data
public class Cart {
	 private Long id;
	    private Long userId;
	    private Long productId;
	    private String option;
	    private int quantity;
	    private int price;

	    // JOIN해서 가져온 데이터
	    private String productName;
	    private String imageUrl;
	    private int stockQuantity;
}