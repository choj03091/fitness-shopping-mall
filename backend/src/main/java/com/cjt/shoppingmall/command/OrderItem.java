package com.cjt.shoppingmall.command;

import lombok.Data;

@Data
public class OrderItem {
	private Long id;
	private Long orderId;
	private Long productId;
	private String productName;
	private String option;
	private int quantity;
	private int price;
	private String createdAt;
	private String updatedAt;
    
    // 추가!
    private String imageUrl;
}
