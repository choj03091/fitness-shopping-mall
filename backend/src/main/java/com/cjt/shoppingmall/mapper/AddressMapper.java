package com.cjt.shoppingmall.mapper;

import com.cjt.shoppingmall.command.Address;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AddressMapper {
	List<Address> findByUserId(Long userId);
	Address findById(Long id);
	void insert(Address address);
	void update(Address address);
	void delete(Long id);
}
