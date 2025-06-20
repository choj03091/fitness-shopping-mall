package com.cjt.shoppingmall.controller;

import com.cjt.shoppingmall.command.ProductOption;
import com.cjt.shoppingmall.service.ProductOptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products/{productId}/options")
public class ProductOptionController {

    private final ProductOptionService productOptionService;

    @PostMapping
    public void addOption(@PathVariable Long productId,
                          @RequestBody ProductOption option) {
        option.setProductId(productId);
        productOptionService.addProductOption(option);
    }

    @GetMapping
    public List<ProductOption> getOptions(@PathVariable Long productId) {
        return productOptionService.getProductOptions(productId);
    }
}
