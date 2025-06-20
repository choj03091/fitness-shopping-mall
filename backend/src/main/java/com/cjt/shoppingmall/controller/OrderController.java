package com.cjt.shoppingmall.controller;

import com.cjt.shoppingmall.command.Order;
import com.cjt.shoppingmall.dtos.orders.OrderRequestDto;
import com.cjt.shoppingmall.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * 특정 사용자의 주문 내역 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable("userId") Long userId) {
        List<Order> orders = orderService.getOrdersWithItemsByUserId(userId);
        return ResponseEntity.ok(orders);
    }



    /**
     * 주문 상세 조회 (optional)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    /**
     * 주문 등록 (주문 + 주문 상세)
     */
//    @PostMapping
//    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
//        try {
//            Long orderId = orderService.createOrder(orderRequestDto.getOrder(), orderRequestDto.getOrderItems());
//            String tossOrderId = "ORDER_" + orderId;  // TossPayments용 orderId 생성
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("orderId", tossOrderId);
//            response.put("orderDbId", orderId);  // DB id도 내려주면 프론트에서 유용하게 사용 가능
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.badRequest().build();
//        }
//    }
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        try {
            Order order = orderRequestDto.getOrder();

            // 🚨 주소 정보가 null이면 Exception 처리하거나 기본값 세팅 가능
            if (order.getAddress() == null || order.getAddressDetail() == null || order.getZipcode() == null) {
                throw new IllegalArgumentException("배송지 정보가 누락되었습니다.");
            }

            // 주문 상태도 Service에서 처리하지만 혹시 모르니 여기도 초기화
            order.setStatus("PENDING");

            Long orderId = orderService.createOrder(order, orderRequestDto.getOrderItems());
            String tossOrderId = "ORDER_" + orderId;

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", tossOrderId);
            response.put("orderDbId", orderId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 주문 상태 변경 (선택)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        try {
            orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok("주문 상태가 업데이트되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("주문 상태 업데이트 실패");
        }
    }

}
