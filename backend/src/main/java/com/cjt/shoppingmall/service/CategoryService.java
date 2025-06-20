package com.cjt.shoppingmall.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cjt.shoppingmall.command.Category;
import com.cjt.shoppingmall.mapper.CategoryMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryMapper categoryMapper;

    // 모든 카테고리 가져오기
    public List<Category> getAllCategories() {
        return categoryMapper.findAll();
    }

    // 특정 부모 카테고리에 속한 자식 카테고리 ID 리스트 가져오기
    public List<Long> getSubCategoryIdsByParentId(Long parentId) {
        return categoryMapper.findSubCategoryIdsByParentId(parentId);
    }
}
