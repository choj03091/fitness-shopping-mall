package com.cjt.shoppingmall.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cjt.shoppingmall.command.User;

@Mapper
public interface UserMapper {
	List<User> findAll();
    User findByEmail(String email);
	User findById(Long id);
	void insert(User user);
	void update(User user);
	void delete(Long id);
	
}
