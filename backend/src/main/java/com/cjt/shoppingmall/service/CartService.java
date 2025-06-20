package com.cjt.shoppingmall.service;

import com.cjt.shoppingmall.command.Cart;
import com.cjt.shoppingmall.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

	private final CartMapper cartMapper;
	public List<Cart> getCartByUserId(Long userId) {
		return cartMapper.findByUserId(userId);
	}

	public void addCart(Cart cart) {
		cartMapper.insert(cart);
	}

	public void deleteCart(Long id) {
		cartMapper.delete(id);
	}

	public boolean isCartItemExists(Long userId, Long productId) {
		return cartMapper.existsCartItem(userId, productId) > 0;
	}

	public boolean deleteCartByUserIdAndCartId(Long userId, Long id) {
		return cartMapper.deleteByUserIdAndId(userId, id) > 0;
	}

	public boolean updateQuantity(Long userId, Long id, int quantity) {
		Cart cartItem = cartMapper.findById(id);

		if (cartItem == null || !cartItem.getUserId().equals(userId)) {
			System.out.println("장바구니 아이템 없음 또는 권한 없음");
			return false;
		}

		int stockQuantity = cartMapper.findStockQuantity(cartItem.getProductId());
		System.out.println("DB에서 가져온 stockQuantity = " + stockQuantity);

		if (quantity > stockQuantity) {
			System.out.println("수량 초과! 요청수량=" + quantity + ", 재고=" + stockQuantity);
			throw new IllegalArgumentException("요청하신 수량이 재고를 초과합니다.");
		}

		return cartMapper.updateQuantity(userId, id, quantity) > 0;
	}

	public void clearCart(Long userId) {
		cartMapper.deleteAllByUserId(userId);
	}


}
