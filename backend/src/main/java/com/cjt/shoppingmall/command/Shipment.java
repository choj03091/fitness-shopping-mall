package com.cjt.shoppingmall.command;

import lombok.Data;

@Data
public class Shipment {
	private Long id;
	private Long orderId;
	private String trackingNumber;
	private String carrier;
	private String shippedAt;
	private String deliveredAt;
}
