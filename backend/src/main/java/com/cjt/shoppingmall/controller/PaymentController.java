package com.cjt.shoppingmall.controller;

import com.cjt.shoppingmall.command.Payment;
import com.cjt.shoppingmall.config.TossProperties;
import com.cjt.shoppingmall.dtos.payments.*;
import com.cjt.shoppingmall.service.*;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/payments/toss")
@RequiredArgsConstructor
public class PaymentController {

    private final TossProperties tossProperties;
    private final OrderService orderService;
    private final PaymentService paymentService;
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/ready")
    public ResponseEntity<?> readyPayment(@RequestBody PaymentReadyRequestDto requestDto) {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("clientKey", tossProperties.getClientKey());
            response.put("orderId", requestDto.getOrderId());  // "ORDER_27" 형태 String 그대로
            response.put("amount", requestDto.getAmount());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 준비 중 오류 발생");
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody PaymentConfirmRequestDto requestDto) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBasicAuth(tossProperties.getSecretKey(), "");
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("paymentKey", requestDto.getPaymentKey());
            body.put("orderId", requestDto.getOrderId());  // "ORDER_23" 형태 그대로
            body.put("amount", requestDto.getAmount());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> tossResponse = restTemplate.postForEntity(
                "https://api.tosspayments.com/v1/payments/confirm",
                entity,
                String.class
            );

            if (tossResponse.getStatusCode().is2xxSuccessful()) {
                // ✅ 여기서만 Long으로 변환해서 서비스/DB에 전달
                Long orderId = Long.parseLong(requestDto.getOrderId().replace("ORDER_", ""));

                // 주문 상태 업데이트
                orderService.updateOrderStatus(orderId, "PAID");

                // 결제 테이블 insert
                Payment payment = Payment.builder()
                    .orderId(orderId)
                    .paymentKey(requestDto.getPaymentKey())
                    .amount(requestDto.getAmount())
                    .method("카드")
                    .status("SUCCESS")
                    .build();
                paymentService.insertPayment(payment);

                return ResponseEntity.ok("결제 승인 완료");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 승인 실패");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 승인 처리 중 오류 발생");
        }
    }
}
