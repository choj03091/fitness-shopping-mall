package com.cjt.shoppingmall.dtos.orders;

import java.util.List;

import com.cjt.shoppingmall.command.Order;
import com.cjt.shoppingmall.command.OrderItem;
import lombok.Data;

@Data
public class OrderRequestDto {
    private Order order;
    private List<OrderItem> orderItems;
}
