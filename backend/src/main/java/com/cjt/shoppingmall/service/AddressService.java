package com.cjt.shoppingmall.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cjt.shoppingmall.command.Address;
import com.cjt.shoppingmall.mapper.AddressMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressService {
	private final AddressMapper addressMapper;
	public List<Address> getAddressesByUserId(Long userId) {
	    return addressMapper.findByUserId(userId);
	}
	public Address getAddressById(Long id) {
		return addressMapper.findById(id);
	}

	public void createAddress(Address address) {
		addressMapper.insert(address);
	}

	public void updateAddress(Address address) {
		addressMapper.update(address);
	}

	public void deleteAddress(Long id) {
		addressMapper.delete(id);
	}
}
