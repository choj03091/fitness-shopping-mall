package com.cjt.shoppingmall.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.cjt.shoppingmall.command.Wishlist;

@Mapper
public interface WishlistMapper {


	List<Wishlist> findByUserIdWithProductInfo(@Param("userId") Long userId);

	List<Wishlist> findByUserId(@Param("userId") Long userId);

	void insert(Wishlist wishlist);

	void deleteByUserIdAndProductId(@Param("userId") Long userId,
			@Param("productId") Long productId);

	void deleteByUserIdAndProductIdAndOptionId(@Param("userId") Long userId,
			@Param("productId") Long productId,
			@Param("productOptionId") Long productOptionId);
}
