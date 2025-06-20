package com.cjt.shoppingmall.service;

import com.cjt.shoppingmall.command.OrderItem;
import com.cjt.shoppingmall.mapper.OrderItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService {

	private final OrderItemMapper orderItemMapper;

	public void insertOrderItem(OrderItem orderItem) {
		orderItemMapper.insertOrderItem(orderItem);
	}

	public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
		return orderItemMapper.findByOrderId(orderId);
	}

	// 특정 주문의 상세 조회
	public List<OrderItem> findByOrderId(Long orderId) {
		return orderItemMapper.findByOrderId(orderId);
	}

	// 주문 상세 삭제
	public void deleteOrderItemsByOrderId(Long orderId) {
		orderItemMapper.deleteOrderItemsByOrderId(orderId);
	}
}
