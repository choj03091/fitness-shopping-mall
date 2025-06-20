package com.cjt.shoppingmall.command;

import lombok.Data;

@Data
public class User {
	 private Long id;
	    private String username;
	    private String password;
	    private String email;
	    private String title = "USER";
	    private String phone;
	    private String createdAt;
	    private Integer isActive;
}
