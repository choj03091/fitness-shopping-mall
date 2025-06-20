package com.cjt.shoppingmall.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.cjt.shoppingmall.command.Order;

@Mapper
public interface OrderMapper {
	void insertOrder(Order order);
	Order findById(Long id);
	List<Order> findByUserId(Long userId);
	void updateOrderStatus(@Param("orderId") Long orderId, @Param("status") String status);
	void deleteOrder(Long id);
	int countUserPurchasedProduct(@Param("userId") Long userId, @Param("productId") Long productId);

}
