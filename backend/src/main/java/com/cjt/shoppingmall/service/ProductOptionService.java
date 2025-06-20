package com.cjt.shoppingmall.service;

import com.cjt.shoppingmall.command.ProductOption;
import com.cjt.shoppingmall.mapper.ProductOptionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductOptionService {

	private final ProductOptionMapper productOptionMapper;

	public void addProductOption(ProductOption option) {
		productOptionMapper.insert(option);
	}

	public List<ProductOption> getProductOptions(Long productId) {
		return productOptionMapper.findByProductId(productId);
	}
}
