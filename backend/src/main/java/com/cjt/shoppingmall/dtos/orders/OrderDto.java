package com.cjt.shoppingmall.dtos.orders;

import java.util.List;

import com.cjt.shoppingmall.command.OrderItem;

import lombok.Data;

@Data
public class OrderDto {
	private Long id;
	private Long userId;
	private String status; // PENDING, PAID, SHIPPED 등
	private String createdAt;
	private String updatedAt;

	// 주문 상세(orderItems)를 담기 위해 List 추가 (필요시)
	private List<OrderItem> orderItems;
}
