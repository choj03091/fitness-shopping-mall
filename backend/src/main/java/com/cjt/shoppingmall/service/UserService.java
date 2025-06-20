package com.cjt.shoppingmall.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.cjt.shoppingmall.command.User;
import com.cjt.shoppingmall.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    
	public List<User> getAllUsers(){
		return userMapper.findAll();
	}
	
	public User getUserByEmail(String email) {
		return userMapper.findByEmail(email);
	}
	
	public User getUserById(Long id) {
		return userMapper.findById(id);
	}
	
    public User login(String email, String password) {
        User user = userMapper.findByEmail(email);

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }

        return null;
    }
    
    public void createUser(User user) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        
        // title이 null 또는 빈 문자열이면 USER로 설정
        if (user.getTitle() == null || user.getTitle().trim().isEmpty()) {
            user.setTitle("USER");
        }
        
        userMapper.insert(user);
    }

    public void updateUser(User user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
        }
        userMapper.update(user);
    }

    public void deleteUser(Long id) {
        userMapper.delete(id);
    }
    
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
