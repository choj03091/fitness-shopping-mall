package com.cjt.shoppingmall.command;

import java.util.List;

import lombok.Data;

@Data
public class Order {
	private Long id;
	private Long userId;
	private String status; // PENDING, PAID, SHIPPED 등
	private String createdAt;
	private String updatedAt;

	// 추가
	private String productImageUrl;
	// 주문 상세(orderItems)를 담기 위해 List 추가 (필요시)
	private List<OrderItem> orderItems;
	
	private String address;
	private String addressDetail;
	private String zipcode;
}
