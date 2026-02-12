package com.example.demo.dto;

import java.time.LocalDateTime;

/**
 * DTO (Data Transfer Object) para transferir datos de usuario. No incluye
 * información sensible como la contraseña.
 */
public class UserDTO {

	private Long id;
	private String username;
	private String role;
	private LocalDateTime createdAt;
	private LocalDateTime lastLogin;

	/**
	 * Constructor vacío.
	 */
	public UserDTO() {
	}

	/**
	 * Constructor con todos los campos.
	 */
	public UserDTO(Long id, String username, String role, LocalDateTime createdAt, LocalDateTime lastLogin) {
		this.id = id;
		this.username = username;
		this.role = role;
		this.createdAt = createdAt;
		this.lastLogin = lastLogin;
	}

	// ==================== Getters y Setters ====================

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(LocalDateTime lastLogin) {
		this.lastLogin = lastLogin;
	}
}