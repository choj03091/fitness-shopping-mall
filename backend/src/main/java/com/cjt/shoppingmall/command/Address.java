package com.cjt.shoppingmall.command;

import lombok.Data;

@Data
public class Address {
    private Long id;
    private Long userId;
    private String address;
    private String addressDetail;
    private String zipcode;
}
