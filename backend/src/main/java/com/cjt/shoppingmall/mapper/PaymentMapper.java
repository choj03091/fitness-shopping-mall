package com.cjt.shoppingmall.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cjt.shoppingmall.command.Payment;

@Mapper
public interface PaymentMapper {
	void insertPayment(Payment payment);
	Payment getPaymentById(Long id);
	List<Payment> getPaymentsByOrderId(Long orderId);
	void updatePaymentStatus(Long id, String status);
}
