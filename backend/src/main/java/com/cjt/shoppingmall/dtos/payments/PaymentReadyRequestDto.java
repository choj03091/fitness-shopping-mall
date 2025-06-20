package com.cjt.shoppingmall.dtos.payments;

import lombok.Data;

@Data
public class PaymentReadyRequestDto {
    private String orderId;  // TossPayments 결제 준비 단계에서는 String
    private int amount;
    private String orderName;
    private String customerName;
}
