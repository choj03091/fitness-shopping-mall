package com.cjt.shoppingmall.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cjt.shoppingmall.command.Product;
import com.cjt.shoppingmall.command.Wishlist;
import com.cjt.shoppingmall.service.ProductService;
import com.cjt.shoppingmall.service.WishlistService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<String> addWishlist(@RequestBody Wishlist wishlist, HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUser");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        wishlist.setUserId(userId);

        // 🔥 productName 설정하기
        Product product = productService.getProductById(wishlist.getProductId());
        if (product == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("상품이 존재하지 않습니다.");
        }
        wishlist.setProductName(product.getName());

        wishlistService.addWishlist(wishlist);
        return ResponseEntity.ok("찜 추가 완료");
    }

    @GetMapping
    public ResponseEntity<List<Wishlist>> getWishlist(HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUser");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(wishlistService.getWishlistByUserId(userId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteWishlist(@PathVariable("productId") Long productId, HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUser");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        wishlistService.deleteWishlist(userId, productId);
        return ResponseEntity.ok("찜 삭제 완료");
    }



}
