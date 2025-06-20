package com.cjt.shoppingmall.command;

import lombok.Data;

@Data
public class Category {
	private Long id;
	private String name;
	private Long parentId;
}
