package com.example.demo.model.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "questions")
public class Question {

	public enum QuestionType {
		TRUE_FALSE, SINGLE_CHOICE, MULTIPLE_CHOICE
	}

	@Id
	private String id;
	private String question;
	private QuestionType type;
	private List<String> options;
	private List<String> answer;
	@Indexed
	private String category;
	@Indexed
	private int difficulty;

	// Constructor vacío
	public Question() {
	}

	// Constructor completo
	public Question(String id, String question, QuestionType type, List<String> options, List<String> answer,
			String category, int difficulty) {
		this.id = id;
		this.question = question;
		this.type = type;
		this.options = options;
		this.answer = answer;
		this.category = category;
		this.difficulty = difficulty;
	}

	// Getters y Setters
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
}