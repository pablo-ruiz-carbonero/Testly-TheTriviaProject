package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		// ⚠️ IMPORTANTE: http (no https) y puerto 5173
		configuration.setAllowedOrigins(List.of("http://localhost:5173"));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@SuppressWarnings("removal")
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(corsConfigurationSource())).csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth
						// Público: Landing page y Auth
						.requestMatchers("/", "/home", "/css/**", "/js/**", "/assets/**", "/bootstrap/**").permitAll()
						.requestMatchers("/auth/**").permitAll()
						// Privado: Solo las preguntas
						.requestMatchers("/api/questions/**").authenticated().anyRequest().authenticated())
				.exceptionHandling(ex -> ex
						// Si React pide algo de la API sin loguearse -> 401 Unauthorized
						.authenticationEntryPoint(
								new org.springframework.security.web.authentication.HttpStatusEntryPoint(
										HttpStatus.UNAUTHORIZED)))
				.formLogin(form -> form.loginProcessingUrl("/auth/login") // <--- LOGIN EN /auth/login
						.successHandler((req, res, auth) -> {
							res.setStatus(200);
							res.setContentType("application/json");
							res.getWriter().write("{\"success\": true}");
						}).failureHandler((req, res, ex) -> {
							res.setStatus(401);
							res.setContentType("application/json");
							res.getWriter().write("{\"success\": false}");
						}))
				.logout(logout -> logout
					    .logoutUrl("/auth/logout") 
					    // Esto permite que el logout funcione tanto por GET como por POST
					    .logoutRequestMatcher(new AntPathRequestMatcher("/auth/logout")) 
					    .logoutSuccessHandler((req, res, auth) -> {
					        String origin = req.getHeader("Origin");
					        if (origin != null && origin.contains("5173")) {
					            // Si es React, mandamos 200 para que el JS no de error
					            res.setStatus(200);
					            res.getWriter().write("{\"success\": true}");
					        } else {
					            // Si es Thymeleaf o directo, al HOME de Spring
					            res.sendRedirect("http://localhost:8081/");
					        }
					    })
					    .invalidateHttpSession(true)
					    .clearAuthentication(true)
					    .deleteCookies("JSESSIONID")
					);

		return http.build();
	}

	@Bean
	public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
		return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
	}
}