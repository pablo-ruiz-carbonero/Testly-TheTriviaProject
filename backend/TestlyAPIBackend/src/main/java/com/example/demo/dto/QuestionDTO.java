package com.example.demo.dto;

import com.example.demo.model.document.Question.QuestionType;
import jakarta.validation.constraints.*;
import java.util.List;

/**
 * DTO para crear o actualizar preguntas. Incluye validaciones para garantizar
 * datos correctos.
 */
public class QuestionDTO {

	private String id; // Opcional para creación, requerido para actualización

	@NotBlank(message = "La pregunta no puede estar vacía")
	@Size(min = 10, max = 500, message = "La pregunta debe tener entre 10 y 500 caracteres")
	private String question;

	@NotNull(message = "El tipo de pregunta es obligatorio")
	private QuestionType type;

	@NotEmpty(message = "Debe haber al menos una opción")
	@Size(min = 2, max = 6, message = "Debe haber entre 2 y 6 opciones")
	private List<String> options;

	@NotEmpty(message = "Debe haber al menos una respuesta correcta")
	private List<String> answer;

	@NotBlank(message = "La categoría es obligatoria")
	@Size(max = 50, message = "La categoría no puede exceder 50 caracteres")
	private String category;

	@Min(value = 1, message = "La dificultad mínima es 1")
	@Max(value = 3, message = "La dificultad máxima es 3")
	private int difficulty;

	@Size(max = 1000, message = "La explicación no puede exceder 1000 caracteres")
	private String explanation;

	private boolean active = true;

	/**
	 * Constructor vacío.
	 */
	public QuestionDTO() {
	}

	/**
	 * Constructor completo.
	 */
	public QuestionDTO(String question, QuestionType type, List<String> options, List<String> answer, String category,
			int difficulty) {
		this.question = question;
		this.type = type;
		this.options = options;
		this.answer = answer;
		this.category = category;
		this.difficulty = difficulty;
	}

	// ==================== Getters y Setters ====================

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public QuestionType getType() {
		return type;
	}

	public void setType(QuestionType type) {
		this.type = type;
	}

	public List<String> getOptions() {
		return options;
	}

	public void setOptions(List<String> options) {
		this.options = options;
	}

	public List<String> getAnswer() {
		return answer;
	}

	public void setAnswer(List<String> answer) {
		this.answer = answer;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public int getDifficulty() {
		return difficulty;
	}

	public void setDifficulty(int difficulty) {
		this.difficulty = difficulty;
	}

	public String getExplanation() {
		return explanation;
	}

	public void setExplanation(String explanation) {
		this.explanation = explanation;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
}