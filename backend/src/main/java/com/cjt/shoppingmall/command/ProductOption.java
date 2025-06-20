package com.cjt.shoppingmall.command;

import lombok.Data;

@Data
public class ProductOption {
	private Long id;
	private Long productId;
	private String optionName;
	private String optionValue;
	private int extraPrice;
	private int stockQuantity;
}
