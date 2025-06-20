package com.cjt.shoppingmall.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor
@Builder
public class Payment {
    private Long id;
    private Long orderId;
    private String paymentKey;
    private int amount;
    private String method;
    private String status;
    private String createdAt;
    private String updatedAt;
}