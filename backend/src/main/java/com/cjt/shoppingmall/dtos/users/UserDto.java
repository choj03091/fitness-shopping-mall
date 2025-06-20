package com.cjt.shoppingmall.dtos.users;

import lombok.Data;

@Data
public class UserDto {
	private Long id;
	private String username;
	private String password;
	private String email;
	private String title;
	private String phone;
	private String createdAt;
	private boolean isActive;
	
}
