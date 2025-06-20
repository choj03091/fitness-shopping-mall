package com.cjt.shoppingmall.controller;

import com.cjt.shoppingmall.command.OrderItem;
import com.cjt.shoppingmall.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

    // 특정 주문의 상세 조회
    @GetMapping("/{orderId}")
    public ResponseEntity<List<OrderItem>> getOrderItemsByOrderId(@PathVariable Long orderId) {
        List<OrderItem> items = orderItemService.findByOrderId(orderId);
        return ResponseEntity.ok(items);
    }

    // (선택) 주문 상세 삭제
    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrderItemsByOrderId(@PathVariable Long orderId) {
        orderItemService.deleteOrderItemsByOrderId(orderId);
        return ResponseEntity.ok("주문 상세 삭제 완료");
    }
}
