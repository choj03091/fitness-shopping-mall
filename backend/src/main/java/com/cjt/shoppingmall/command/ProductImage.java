package com.cjt.shoppingmall.command;

import lombok.Data;

@Data
public class ProductImage {
    private Long id;
    private Long productId;
    private String imageUrl;
    private boolean isThumbnail;
}
