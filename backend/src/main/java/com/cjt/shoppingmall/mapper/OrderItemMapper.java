package com.cjt.shoppingmall.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cjt.shoppingmall.command.OrderItem;

@Mapper
public interface OrderItemMapper {
	void insertOrderItem(OrderItem orderItem);
	List<OrderItem> findByOrderId(Long orderId);
	void deleteOrderItemsByOrderId(Long orderId);
}
