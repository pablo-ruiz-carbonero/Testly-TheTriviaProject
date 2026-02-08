package com.example.demo.service;

import com.example.demo.model.document.Question;
import com.example.demo.model.document.Question.QuestionType;
import com.example.demo.repository.mongo.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

	@Autowired
	private QuestionRepository questionRepository;

	private final int PAGE_SIZE = 5; // Requisito: 5 por página

	// Obtener todas las preguntas paginadas
	public Page<Question> getAllQuestions(int page) {
		Pageable pageable = PageRequest.of(page, PAGE_SIZE);
		return questionRepository.findAll(pageable);
	}

	// Obtener pregunta por ID
	public Optional<Question> getQuestionById(String id) {
		return questionRepository.findById(id);
	}

	// Guardar una nueva pregunta
	public Question saveQuestion(Question question) {
		return questionRepository.save(question);
	}

	// Actualizar pregunta existente
	public Question updateQuestion(String id, Question updatedQuestion) {
		if (questionRepository.existsById(id)) {
			updatedQuestion.setId(id);
			return questionRepository.save(updatedQuestion);
		}
		throw new RuntimeException("Pregunta no encontrada con id: " + id);
	}

	// Eliminar pregunta por ID
	public void deleteQuestion(String id) {
		questionRepository.deleteById(id);
	}

	// Buscar por categoría (Paginado)
	public Page<Question> getQuestionsByCategory(String category, int page) {
		Pageable pageable = PageRequest.of(page, PAGE_SIZE);
		return questionRepository.findByCategory(category, pageable);
	}

	// Buscar por dificultad (Paginado)
	public Page<Question> getQuestionsByDifficulty(int difficulty, int page) {
		Pageable pageable = PageRequest.of(page, PAGE_SIZE);
		return questionRepository.findByDifficulty(difficulty, pageable);
	}

	// Buscar por tipo (Paginado)
	public Page<Question> getQuestionsByType(QuestionType type, int page) {
		Pageable pageable = PageRequest.of(page, PAGE_SIZE);
		return questionRepository.findByType(type, pageable);
	}

	// Buscar por categoría y dificultad (Paginado)
	public Page<Question> getQuestionsByCategoryAndDifficulty(String category, int difficulty, int page) {
		Pageable pageable = PageRequest.of(page, PAGE_SIZE);
		return questionRepository.findByCategoryAndDifficulty(category, difficulty, pageable);
	}

	// Obtener preguntas aleatorias de una categoría (Convertido a Page para consistencia)
	public Page<Question> getRandomQuestionsByCategory(String category, int count) {
		List<Question> questions = questionRepository.findByCategory(category);
		Collections.shuffle(questions);
		List<Question> subList = questions.subList(0, Math.min(count, questions.size()));
		// Envolvemos la lista en un objeto Page
		return new PageImpl<>(subList, PageRequest.of(0, count), questions.size());
	}

	// Obtener preguntas aleatorias con dificultad específica (Convertido a Page)
	public Page<Question> getRandomQuestionsByDifficulty(int difficulty, int count) {
		List<Question> questions = questionRepository.findByDifficulty(difficulty);
		Collections.shuffle(questions);
		List<Question> subList = questions.subList(0, Math.min(count, questions.size()));
		return new PageImpl<>(subList, PageRequest.of(0, count), questions.size());
	}

	// Guardar múltiples preguntas
	public List<Question> saveAllQuestions(List<Question> questions) {
		return questionRepository.saveAll(questions);
	}
	
	public Page<Question> getFilteredQuestions(Question.QuestionType type, String search, String category, Pageable pageable) {
	    // Si la categoría es "Todas" o nula, mandamos un String vacío
	    // En Mongo, "Containing" con un String vacío coincide con todo (no filtra)
	    String categoryParam = (category == null || category.equalsIgnoreCase("Todas")) ? "" : category;
	    String searchParam = (search == null) ? "" : search;

	    return questionRepository.findByTypeAndQuestionContainingIgnoreCaseAndCategoryContaining(
	        type, 
	        searchParam, 
	        categoryParam, 
	        pageable
	    );
	}
}