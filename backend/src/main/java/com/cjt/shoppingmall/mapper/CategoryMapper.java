package com.cjt.shoppingmall.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.cjt.shoppingmall.command.Category;

@Mapper
public interface CategoryMapper {
    // 모든 카테고리 조회 (예: 상품 등록용)
    List<Category> findAll();

    // 부모 카테고리 id로 자식 카테고리 id 리스트 조회
    List<Long> findSubCategoryIdsByParentId(@Param("parentId") Long parentId);
}
