package com.cjt.shoppingmall.service;

import com.cjt.shoppingmall.command.OrderItem;
import com.cjt.shoppingmall.command.Product;
import com.cjt.shoppingmall.command.Review;
import com.cjt.shoppingmall.mapper.CategoryMapper;
import com.cjt.shoppingmall.mapper.OrderItemMapper;
import com.cjt.shoppingmall.mapper.ProductMapper;
import com.cjt.shoppingmall.mapper.ReviewMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductMapper productMapper;
	private final OrderItemMapper orderItemMapper;
	private final CategoryMapper categoryMapper;


	public List<Product> getAllProducts() {
		return productMapper.findAll();
	}

	public Product getProductById(Long id) {
		return productMapper.findById(id);
	}

	public void createProduct(Product product) {
		productMapper.insert(product);
	}

	public void updateProduct(Product product) {
		productMapper.update(product);
	}

	public void deleteProduct(Long id) {
		productMapper.delete(id);
	}
	public void decreaseStockByOrder(Long orderId) {
		List<OrderItem> orderItems = orderItemMapper.findByOrderId(orderId);
		for (OrderItem item : orderItems) {
			productMapper.decreaseStock(item.getProductId(), item.getQuantity());
		}
	}

	public List<Product> getProductsByCategoryId(Long categoryId) {
		return productMapper.findByCategoryId(categoryId);
	}

	public List<Product> getProductsByParentCategoryId(Long parentCategoryId) {
		// 부모 id로 자식 categoryId 리스트 조회
		List<Long> subCategoryIds = categoryMapper.findSubCategoryIdsByParentId(parentCategoryId);
		return productMapper.findByCategoryIds(subCategoryIds);
	}

}
