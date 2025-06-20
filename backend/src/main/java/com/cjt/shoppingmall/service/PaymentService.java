package com.cjt.shoppingmall.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.cjt.shoppingmall.command.Payment;
import com.cjt.shoppingmall.mapper.PaymentMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentMapper paymentMapper;

    public void insertPayment(Payment payment) {
        paymentMapper.insertPayment(payment);
    }

    public Payment getPaymentById(Long id) {
        return paymentMapper.getPaymentById(id);
    }

    public List<Payment> getPaymentsByOrderId(Long orderId) {
        return paymentMapper.getPaymentsByOrderId(orderId);
    }

    public void updatePaymentStatus(Long id, String status) {
        paymentMapper.updatePaymentStatus(id, status);
    }
}