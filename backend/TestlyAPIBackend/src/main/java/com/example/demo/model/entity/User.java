package com.example.demo.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa a un usuario del sistema. Almacenada en MySQL en la
 * tabla 'users'.
 */
@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; // Cambiado de int a Long para consistencia

	@Column(unique = true, nullable = false, length = 50)
	private String username;

	@Column(nullable = false)
	private String password; // Debe estar hasheada (BCrypt)

	@Column(nullable = false, length = 20)
	private String role; // "USER" o "ADMIN"

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "last_login")
	private LocalDateTime lastLogin;

	/**
	 * Constructor vacío requerido por JPA.
	 */
	public User() {
		this.createdAt = LocalDateTime.now();
	}

	/**
	 * Constructor para crear un nuevo usuario.
	 * 
	 * @param username Nombre de usuario único
	 * @param password Contraseña (debe ser hasheada antes de guardar)
	 * @param role     Rol del usuario ("USER" o "ADMIN")
	 */
	public User(String username, String password, String role) {
		this.username = username;
		this.password = password;
		this.role = role;
		this.createdAt = LocalDateTime.now();
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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	@Override
	public String toString() {
		return "User{" + "id=" + id + ", username='" + username + '\'' + ", role='" + role + '\'' + ", createdAt="
				+ createdAt + '}';
	}
}