package com.cjt.shoppingmall.controller;

import com.cjt.shoppingmall.command.Product;
import com.cjt.shoppingmall.command.Review;
import com.cjt.shoppingmall.service.OrderService;
import com.cjt.shoppingmall.service.ProductService;
import com.cjt.shoppingmall.service.ReviewService;
import com.cjt.shoppingmall.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;
	private final OrderService orderService;
	private final UserService userService;

	// ✅ GET /api/products => 전체 조회 + 카테고리별 조회
	@GetMapping
	public ResponseEntity<List<Product>> getProducts(
			@RequestParam(name = "categoryId", required = false) Long categoryId,
			@RequestParam(name = "parentCategoryId", required = false) Long parentCategoryId
			) {
		List<Product> products;
		if (categoryId != null) {
			products = productService.getProductsByCategoryId(categoryId);
		} else if (parentCategoryId != null) {
			products = productService.getProductsByParentCategoryId(parentCategoryId);
		} else {
			products = productService.getAllProducts();
		}
		return ResponseEntity.ok(products);
	}

	@GetMapping("/{id}")
	public Product getProductById(@PathVariable("id") Long id) {
		return productService.getProductById(id);
	}

	@PostMapping
	public ResponseEntity<String> createProduct(@RequestBody Product product, HttpSession session) {
		Long userId = (Long) session.getAttribute("loginUser");
		if (userId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
		}

		// 사용자 정보 가져오기
		var user = userService.getUserById(userId);
		if (!"ADMIN".equalsIgnoreCase(user.getTitle())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자만 상품 등록이 가능합니다.");
		}

		productService.createProduct(product);
		return ResponseEntity.ok("상품 등록 완료");
	}

	@PutMapping("/{id}")
	public ResponseEntity<String> updateProduct(
			@PathVariable("id") Long id,
			@RequestBody Product product,
			HttpSession session) {

		Long userId = (Long) session.getAttribute("loginUser");
		if (userId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
		}

		var user = userService.getUserById(userId);
		if (!"ADMIN".equalsIgnoreCase(user.getTitle())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자만 상품 수정이 가능합니다.");
		}

		product.setId(id);
		productService.updateProduct(product);

		return ResponseEntity.ok("상품 수정 완료");
	}

	@PostMapping("/upload")
	public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
		try {
			// 실제로는 S3, 서버의 특정 디렉토리 등으로 저장
			String uploadDir = "uploadedImages/";
			String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
			Path filePath = Paths.get(uploadDir + fileName);
			Files.createDirectories(filePath.getParent());
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

			// 이미지 URL을 반환 (로컬 테스트라면 서버에 static 폴더 등 활용)
			String imageUrl = "/uploadedImages/" + fileName;  // 실제로는 CDN URL로 매핑되도록 작업해야 함

			Map<String, String> response = new HashMap<>();
			response.put("url", imageUrl);
			return ResponseEntity.ok(response);
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/{productId}/review/eligibility")
	public ResponseEntity<Boolean> checkReviewEligibility(
			@PathVariable("productId") Long productId,
			HttpSession session
			) {
		Long userId = (Long) session.getAttribute("loginUser");
		if (userId == null) {
			// 비로그인 상태일 때는 false 반환
			return ResponseEntity.ok(false);
		}

		boolean hasPurchased = orderService.hasPurchasedProduct(userId, productId);
		return ResponseEntity.ok(hasPurchased);
	}

	@DeleteMapping("/{id}")
	public void deleteProduct(@PathVariable Long id) {
		productService.deleteProduct(id);
	}
}
