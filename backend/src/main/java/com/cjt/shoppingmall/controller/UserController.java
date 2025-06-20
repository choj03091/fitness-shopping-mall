package com.cjt.shoppingmall.controller;

import com.cjt.shoppingmall.command.Address;
import com.cjt.shoppingmall.command.User;
import com.cjt.shoppingmall.mapper.UserMapper;
import com.cjt.shoppingmall.service.AddressService;
import com.cjt.shoppingmall.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AddressService addressService;
    
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> loginData, HttpSession session) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        User loginUser = userService.login(email, password);

        if (loginUser != null) {
            session.setAttribute("loginUser", loginUser.getId());
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }


    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "로그아웃 성공";
    }
    
    @PutMapping("/mypage")
    public ResponseEntity<String> updateMyPage(@RequestBody Map<String, Object> myPageData, HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUser");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }

        // 사용자 정보 업데이트
        User user = new User();
        user.setId(userId);
        user.setUsername((String) myPageData.get("username"));
        user.setEmail((String) myPageData.get("email"));
        user.setPhone((String) myPageData.get("phone"));

        // 비밀번호 변경이 요청되었을 경우
        String newPassword = (String) myPageData.get("password");
        if (newPassword != null && !newPassword.isEmpty()) {
            user.setPassword(newPassword);
        }

        userService.updateUser(user);

        // 주소 정보 업데이트
        List<Map<String, Object>> addresses = (List<Map<String, Object>>) myPageData.get("addresses");
        if (addresses != null) {
            for (Map<String, Object> addrData : addresses) {
                Long addrId = addrData.get("id") != null ? Long.valueOf(addrData.get("id").toString()) : null;
                String address = (String) addrData.get("address");
                String addressDetail = (String) addrData.get("addressDetail");
                String zipcode = (String) addrData.get("zipcode");

                Address addr = new Address();
                addr.setUserId(userId);
                addr.setAddress(address);
                addr.setAddressDetail(addressDetail);
                addr.setZipcode(zipcode);

                if (addrId != null) {
                    addr.setId(addrId);
                    addressService.updateAddress(addr);
                } else {
                    addressService.createAddress(addr);
                }
            }
        }

        return ResponseEntity.ok("마이페이지 업데이트 완료");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("loginUser");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }


    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public void createUser(@RequestBody User user) {
        userService.createUser(user);
    }

    @PutMapping("/{id}")
    public void updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        userService.updateUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
