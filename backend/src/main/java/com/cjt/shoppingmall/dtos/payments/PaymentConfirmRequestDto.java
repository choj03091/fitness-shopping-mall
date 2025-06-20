package com.cjt.shoppingmall.dtos.payments;

import lombok.Data;

@Data
public class PaymentConfirmRequestDto {
    private String orderId;
    private String paymentKey;
    private int amount;
    
}