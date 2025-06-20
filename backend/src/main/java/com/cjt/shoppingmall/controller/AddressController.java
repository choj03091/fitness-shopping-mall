package com.cjt.shoppingmall.controller;

import com.cjt.shoppingmall.command.Address;
import com.cjt.shoppingmall.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/user/{userId}")
    public List<Address> getAddressesByUserId(@PathVariable("userId") Long userId) {
        return addressService.getAddressesByUserId(userId);
    }

    @GetMapping("/{id}")
    public Address getAddressById(@PathVariable Long id) {
        return addressService.getAddressById(id);
    }

    @PostMapping
    public void createAddress(@RequestBody Address address) {
        addressService.createAddress(address);
    }

    @PutMapping("/{id}")
    public void updateAddress(@PathVariable Long id, @RequestBody Address address) {
        address.setId(id);
        addressService.updateAddress(address);
    }

    @DeleteMapping("/{id}")
    public void deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
    }
}
