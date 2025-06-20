package com.cjt.shoppingmall.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cjt.shoppingmall.command.ProductOption;

@Mapper
public interface ProductOptionMapper {
	void insert(ProductOption productOption);

	List<ProductOption> findByProductId(Long productId);
}
