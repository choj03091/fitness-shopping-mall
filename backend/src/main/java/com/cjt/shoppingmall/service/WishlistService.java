package com.cjt.shoppingmall.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cjt.shoppingmall.command.Wishlist;
import com.cjt.shoppingmall.mapper.WishlistMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishlistService {
	private final WishlistMapper wishlistMapper;

	public List<Wishlist> getWishlistByUserId(Long userId) {
		return wishlistMapper.findByUserIdWithProductInfo(userId);
	}


	public void addWishlist(Wishlist wishlist) {
		wishlistMapper.insert(wishlist);
	}


	public void deleteWishlist(Long userId, Long productId) {
		wishlistMapper.deleteByUserIdAndProductId(userId, productId);
	}
}
