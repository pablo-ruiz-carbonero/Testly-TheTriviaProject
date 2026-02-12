package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

	// ==================== CORS ====================

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(List.of("http://localhost:5173"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

	// ==================== SECURITY ====================

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http.cors(cors -> cors.configurationSource(corsConfigurationSource())).csrf(csrf -> csrf.disable())

				.authorizeHttpRequests(auth -> auth
						// Públicos
						.requestMatchers("/", "/home", "/css/**", "/js/**", "/assets/**", "/bootstrap/**", "/auth/**")
						.permitAll()

						// Admin
						.requestMatchers("/api/admin/**").hasRole("ADMIN")

						// API autenticada
						.requestMatchers("/api/questions/**", "/api/scores/**").authenticated()

						// Todo lo demás
						.anyRequest().authenticated())

				.exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))

				.formLogin(form -> form.loginProcessingUrl("/auth/login").successHandler((req, res, auth) -> {
					res.setStatus(HttpStatus.OK.value());
					res.setContentType("application/json");
					res.getWriter().write("{\"success\": true}");
				}).failureHandler((req, res, ex) -> {
					res.setStatus(HttpStatus.UNAUTHORIZED.value());
					res.setContentType("application/json");
					res.getWriter().write("{\"success\": false}");
				}))

				.logout(logout -> logout.logoutRequestMatcher(new AntPathRequestMatcher("/auth/logout"))
						.logoutSuccessHandler((req, res, auth) -> {
							String origin = req.getHeader("Origin");
							res.setContentType("application/json");

							if (origin != null && origin.contains("5173")) {
								res.setStatus(HttpStatus.OK.value());
								res.getWriter().write("{\"success\": true}");
							} else {
								res.sendRedirect("http://localhost:8081/");
							}
						}).invalidateHttpSession(true).clearAuthentication(true).deleteCookies("JSESSIONID"));

		return http.build();
	}

	// ==================== PASSWORD ====================

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
