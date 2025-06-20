package com.cjt.shoppingmall.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.cjt.shoppingmall.command.Product;

@Mapper
public interface ProductMapper {
	List<Product> findAll();
	Product findById(Long id);
	void insert(Product product);
	void update(Product product);
	void delete(Long id);
    // 별점 평균 & 리뷰 개수 업데이트
    void updateProductRating(Long productId);
    void decreaseStock(@Param("productId") Long productId, @Param("quantity") Integer quantity);
    void updateProductStock(@Param("id") Long id, @Param("stockQuantity") int stockQuantity);
    // ⭐ 카테고리별 상품 조회 추가
    List<Product> findByCategoryId(Long categoryId);

    // ⭐ 부모 카테고리 id로 하위 상품 조회 (여러 자식 categoryId)
    List<Product> findByCategoryIds(@Param("categoryIds") List<Long> categoryIds);
}
