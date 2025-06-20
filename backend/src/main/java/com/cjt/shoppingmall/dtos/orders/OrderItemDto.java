package com.cjt.shoppingmall.dtos.orders;

import lombok.Data;

@Data
public class OrderItemDto {
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName; // 주문 시점 상품 이름 스냅샷
    private String option;      // 주문 시점 옵션 스냅샷
    private Integer quantity;
    private Integer price;      // 주문 시점 가격 스냅샷
    private String createdAt;
    private String updatedAt;
}
