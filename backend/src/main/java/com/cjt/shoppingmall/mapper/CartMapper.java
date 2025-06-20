package com.cjt.shoppingmall.mapper;

import com.cjt.shoppingmall.command.Cart;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CartMapper {
	List<Cart> findByUserId(Long userId);
	Cart findById(Long id);
	int findStockQuantity(Long productId);
	void insert(Cart cart);
	void delete(Long id);
	int existsCartItem(@Param("userId") Long userId, @Param("productId") Long productId);
	int deleteByUserIdAndId(@Param("userId") Long userId, @Param("id") Long id);
	int updateQuantity(@Param("userId") Long userId, @Param("id") Long id, @Param("quantity") int quantity);
	void deleteAllByUserId(@Param("userId") Long userId);

}
