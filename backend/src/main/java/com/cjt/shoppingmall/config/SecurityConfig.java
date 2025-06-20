package com.cjt.shoppingmall.config;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class SecurityConfig {

	/**
	 * 비밀번호 암호화용 BCryptPasswordEncoder 빈 등록
	 */
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	/**
	 * 시큐리티 설정 (개발 중 permitAll)
	 */
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
		.csrf(csrf -> csrf.disable())
		.authorizeHttpRequests(auth -> auth
				.requestMatchers("/**").permitAll()
				)
		.formLogin().disable()
		.logout().disable();

		return http.build();
	}


	/**
	 * CORS 설정
	 */
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
				.allowedOrigins("http://localhost:3000") // 프론트엔드 주소
				.allowedMethods("GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS")
				.allowCredentials(true);
			}
		};
	}
}
