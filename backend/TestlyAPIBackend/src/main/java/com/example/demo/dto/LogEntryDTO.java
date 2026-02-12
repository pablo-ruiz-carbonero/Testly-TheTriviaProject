package com.example.demo.dto;

import java.time.LocalDateTime;

/**
 * DTO para representar una entrada de log formateada.
 */
public class LogEntryDTO {

	private Long id;
	private String username;
	private String action;
	private LocalDateTime timestamp;
	private String details;
	private String level;
	private String ipAddress;
	private String formattedEntry; // Log formateado para visualización

	/**
	 * Constructor vacío.
	 */
	public LogEntryDTO() {
	}

	/**
	 * Constructor con todos los campos.
	 */
	public LogEntryDTO(Long id, String username, String action, LocalDateTime timestamp, String details, String level,
			String ipAddress) {
		this.id = id;
		this.username = username;
		this.action = action;
		this.timestamp = timestamp;
		this.details = details;
		this.level = level;
		this.ipAddress = ipAddress;
		this.formattedEntry = formatEntry();
	}

	/**
	 * Formatea la entrada de log en formato estándar. Formato: [TIMESTAMP] [NIVEL]
	 * [USUARIO] - ACCIÓN: Detalles
	 * 
	 * @return String formateado de la entrada de log
	 */
	private String formatEntry() {
		return String.format("[%s] [%s] %s - %s: %s", timestamp != null ? timestamp.toString() : "N/A",
				level != null ? level : "INFO", username != null ? username : "SYSTEM",
				action != null ? action : "UNKNOWN", details != null ? details : "");
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

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getFormattedEntry() {
		return formattedEntry;
	}

	public void setFormattedEntry(String formattedEntry) {
		this.formattedEntry = formattedEntry;
	}
}