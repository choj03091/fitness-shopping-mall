package com.cjt.shoppingmall.dtos.users;

import lombok.Data;

@Data
public class AddressDto {
	private Long id;
	private Long userId;
	private String address;
	private String addressDetail;
	private String zipcode;
}
