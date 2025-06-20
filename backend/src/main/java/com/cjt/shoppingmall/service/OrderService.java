package com.cjt.shoppingmall.service;

import com.cjt.shoppingmall.command.Order;
import com.cjt.shoppingmall.command.OrderItem;
import com.cjt.shoppingmall.command.Product;
import com.cjt.shoppingmall.mapper.OrderItemMapper;
import com.cjt.shoppingmall.mapper.OrderMapper;
import com.cjt.shoppingmall.mapper.ProductMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final ProductMapper productMapper;
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;

    @Transactional
    public Long createOrder(Order order, List<OrderItem> orderItems) {
        // 주문 상태는 항상 PENDING으로 초기화
        order.setStatus("PENDING");
        orderMapper.insertOrder(order);  // orders.id 자동 증가

        Long orderId = order.getId();
        for (OrderItem item : orderItems) {
            item.setOrderId(orderId);
            orderItemMapper.insertOrderItem(item);
            
            Product product = productMapper.findById(item.getProductId());
            if(product == null) {
            	throw new RuntimeException("상품이 존재하지 않습니다: " + item.getProductId());
            }
            int newStock = product.getStockQuantity() - item.getQuantity();
            if(newStock < 0 ) {
                throw new RuntimeException("재고가 부족합니다: " + product.getName());
            }
            product.setStockQuantity(newStock);
            productMapper.updateProductStock(product.getId(), newStock);
        }

        return orderId;
    }

    public Order getOrderById(Long id) {
        Order order = orderMapper.findById(id);
        if (order != null) {
            List<OrderItem> items = orderItemMapper.findByOrderId(order.getId());
            order.setOrderItems(items);
        }
        return order;
    }

    public List<Order> getOrdersWithItemsByUserId(Long userId) {
        List<Order> orders = orderMapper.findByUserId(userId);
        for (Order order : orders) {
            List<OrderItem> items = orderItemMapper.findByOrderId(order.getId());
            order.setOrderItems(items);
        }
        return orders;
    }

    public void updateOrderStatus(Long orderId, String status) {
        orderMapper.updateOrderStatus(orderId, status);
    }

    public void deleteOrder(Long id) {
        orderMapper.deleteOrder(id);
        orderItemMapper.deleteOrderItemsByOrderId(id);
    }

    public boolean hasPurchasedProduct(Long userId, Long productId) {
        int count = orderMapper.countUserPurchasedProduct(userId, productId);
        return count > 0;
    }
}
