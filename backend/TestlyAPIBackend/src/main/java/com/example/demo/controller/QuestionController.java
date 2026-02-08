package com.example.demo.controller;

import com.example.demo.model.document.Question;
import com.example.demo.model.document.Question.QuestionType;
import com.example.demo.service.QuestionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

	@Autowired
	private QuestionService questionService;

	// GET: Obtener todas las preguntas paginadas
	@GetMapping
	public ResponseEntity<Page<Question>> getAllQuestions(
			@RequestParam(defaultValue = "0") int page) {
		Page<Question> questions = questionService.getAllQuestions(page);
		return ResponseEntity.ok(questions);
	}

	// GET: Obtener pregunta por ID
	@GetMapping("/{id}")
	public ResponseEntity<Question> getQuestionById(@PathVariable String id) {
		Optional<Question> question = questionService.getQuestionById(id);
		return question.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	// POST: Crear nueva pregunta
	@PostMapping
	public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
		Question savedQuestion = questionService.saveQuestion(question);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedQuestion);
	}

	// PUT: Actualizar pregunta existente
	@PutMapping("/{id}")
	public ResponseEntity<Question> updateQuestion(@PathVariable String id, @RequestBody Question question) {
		try {
			Question updatedQuestion = questionService.updateQuestion(id, question);
			return ResponseEntity.ok(updatedQuestion);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// DELETE: Eliminar pregunta
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteQuestion(@PathVariable String id) {
		questionService.deleteQuestion(id);
		return ResponseEntity.noContent().build();
	}

	// GET: Buscar por categoría (Paginado)
	@GetMapping("/category/{category}")
	public ResponseEntity<Page<Question>> getQuestionsByCategory(
			@PathVariable String category,
			@RequestParam(defaultValue = "0") int page) {
		Page<Question> questions = questionService.getQuestionsByCategory(category, page);
		return ResponseEntity.ok(questions);
	}

	// GET: Buscar por dificultad (Paginado)
	@GetMapping("/difficulty/{difficulty}")
	public ResponseEntity<Page<Question>> getQuestionsByDifficulty(
			@PathVariable int difficulty,
			@RequestParam(defaultValue = "0") int page) {
		Page<Question> questions = questionService.getQuestionsByDifficulty(difficulty, page);
		return ResponseEntity.ok(questions);
	}

	// GET: Buscar por categoría y dificultad (Paginado)
	@GetMapping("/category/{category}/difficulty/{difficulty}")
	public ResponseEntity<Page<Question>> getQuestionsByCategoryAndDifficulty(
			@PathVariable String category,
			@PathVariable int difficulty,
			@RequestParam(defaultValue = "0") int page) {
		Page<Question> questions = questionService.getQuestionsByCategoryAndDifficulty(category, difficulty, page);
		return ResponseEntity.ok(questions);
	}

	// GET: Obtener preguntas aleatorias por categoría
	@GetMapping("/random/category/{category}")
	public ResponseEntity<Page<Question>> getRandomQuestionsByCategory(
			@PathVariable String category,
			@RequestParam(defaultValue = "5") int count) {
		Page<Question> questions = questionService.getRandomQuestionsByCategory(category, count);
		return ResponseEntity.ok(questions);
	}

	// GET: Obtener preguntas aleatorias por dificultad
	@GetMapping("/random/difficulty/{difficulty}")
	public ResponseEntity<Page<Question>> getRandomQuestionsByDifficulty(
			@PathVariable int difficulty,
			@RequestParam(defaultValue = "5") int count) {
		Page<Question> questions = questionService.getRandomQuestionsByDifficulty(difficulty, count);
		return ResponseEntity.ok(questions);
	}

	// POST: Guardar múltiples preguntas (carga masiva)
	@PostMapping("/batch")
	public ResponseEntity<List<Question>> saveAllQuestions(@RequestBody List<Question> questions) {
		List<Question> savedQuestions = questionService.saveAllQuestions(questions);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedQuestions);
	}
	
	@GetMapping("/type/{type}")
	public Page<Question> getByType(
	        @PathVariable Question.QuestionType type,
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "") String search,
	        @RequestParam(defaultValue = "") String category) {
	    
	    // Tamaño de página 10 (o el que prefieras)
	    return questionService.getFilteredQuestions(type, search, category, PageRequest.of(page, 10));
	}
	
}