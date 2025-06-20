package com.cjt.shoppingmall.dtos.payments;

import lombok.Data;

@Data
public class PaymentDto {
	private Long id;
	private Long orderId;
	private String paymentKey;
	private Integer amount;
	private String method;   // 카드, 계좌이체 등
	private String status;   // SUCCESS, FAILED, PENDING
	private String createdAt;
	private String updatedAt;
}
