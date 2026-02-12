package com.example.demo.model.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

/**
 * Documento que representa una pregunta de quiz. Almacenado en MongoDB en la
 * colección 'questions'.
 */
@Document(collection = "questions")
public class Question {

	/**
	 * Enum que define los tipos de pregunta disponibles.
	 */
	public enum QuestionType {
		TRUE_FALSE, // Verdadero/Falso
		SINGLE_CHOICE, // Opción única
		MULTIPLE_CHOICE // Opción múltiple
	}

	@Id
	private String id;

	@Indexed
	private String question;

	private QuestionType type;

	private List<String> options; // Opciones de respuesta

	private List<String> answer; // Respuestas correctas

	@Indexed
	private String category; // Ej: Matemáticas, Historia, Ciencias

	@Indexed
	private int difficulty; // 1 (fácil), 2 (medio), 3 (difícil)

	private String explanation; // Explicación de la respuesta correcta

	private boolean active; // Si la pregunta está activa o no

	/**
	 * Constructor vacío requerido por Spring Data MongoDB.
	 */
	public Question() {
		this.active = true;
	}

	/**
	 * Constructor completo para crear una nueva pregunta.
	 * 
	 * @param question   Texto de la pregunta
	 * @param type       Tipo de pregunta
	 * @param options    Lista de opciones
	 * @param answer     Lista de respuestas correctas
	 * @param category   Categoría de la pregunta
	 * @param difficulty Nivel de dificultad (1-3)
	 */
	public Question(String question, QuestionType type, List<String> options, List<String> answer, String category,
			int difficulty) {
		this.question = question;
		this.type = type;
		this.options = options;
		this.answer = answer;
		this.category = category;
		this.difficulty = difficulty;
		this.active = true;
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

	@Override
	public String toString() {
		return "Question{" + "id='" + id + '\'' + ", question='" + question + '\'' + ", type=" + type + ", category='"
				+ category + '\'' + ", difficulty=" + difficulty + ", active=" + active + '}';
	}
}