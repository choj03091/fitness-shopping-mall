package com.cjt.shoppingmall.controller;

import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.cjt.shoppingmall.command.Cart;
import com.cjt.shoppingmall.command.User;
import com.cjt.shoppingmall.service.CartService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

	private final CartService cartService;

	@GetMapping
	public ResponseEntity<List<Cart>> getCart(HttpSession session) {
		Long userId = (Long) session.getAttribute("loginUser");
		if (userId == null) {
			return ResponseEntity.status(401).build();
		}
		List<Cart> cartItems = cartService.getCartByUserId(userId);
		return ResponseEntity.ok(cartItems);
	}

	@PostMapping
	public ResponseEntity<String> addCart(@RequestBody Cart cart, HttpSession session) {
		Long userId = (Long) session.getAttribute("loginUser");
		if (userId == null) {
			return ResponseEntity.status(401).body("로그인이 필요합니다.");
		}

		if (cartService.isCartItemExists(userId, cart.getProductId())) {
			return ResponseEntity.status(409).body("이미 장바구니에 담긴 상품입니다.");
		}

		cart.setUserId(userId);
		cartService.addCart(cart);
		return ResponseEntity.ok("장바구니에 담았습니다!");
	}


	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteCart(@PathVariable("id") Long id, HttpSession session) {
		Long userId = (Long) session.getAttribute("loginUser");
		if (userId == null) {
			return ResponseEntity.status(401).body("로그인이 필요합니다.");
		}

		// 서비스에 userId와 cartId 넘겨서 검증 후 삭제
		boolean deleted = cartService.deleteCartByUserIdAndCartId(userId, id);
		if (deleted) {
			return ResponseEntity.ok("장바구니에서 삭제되었습니다!");
		} else {
			return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
		}
	}

	@PatchMapping("/{id}")
	public ResponseEntity<String> updateCartQuantity(
			@PathVariable("id") Long id,
			@RequestBody Map<String, Integer> body,
			HttpSession session
			) {
		Long userId = (Long) session.getAttribute("loginUser");
		if (userId == null) {
			return ResponseEntity.status(401).body("로그인이 필요합니다.");
		}

		int quantity = body.getOrDefault("quantity", 1);
		if (quantity < 1) {
			return ResponseEntity.badRequest().body("수량은 1 이상이어야 합니다.");
		}

		try {
			boolean updated = cartService.updateQuantity(userId, id, quantity);
			if (updated) {
				return ResponseEntity.ok("수량이 변경되었습니다.");
			} else {
				return ResponseEntity.status(403).body("수량 변경 권한이 없습니다.");
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/all")
	public ResponseEntity<?> clearCart(HttpSession session) {
	    Long userId = (Long) session.getAttribute("loginUser");
	    if (userId == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
	    }
	    cartService.clearCart(userId);
	    return ResponseEntity.ok().build();
	}

}
