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


@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

	@Autowired
	private QuestionService questionService;

	// ===== CRUD =====

	@GetMapping
	public ResponseEntity<Page<Question>> getAllQuestions(@RequestParam(defaultValue = "0") int page) {
		return ResponseEntity.ok(questionService.getAllQuestionsPaged(page));
	}

	@GetMapping("/{id}")
	public ResponseEntity<Question> getQuestionById(@PathVariable String id) {
		return questionService.getQuestionById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
		return ResponseEntity.status(HttpStatus.CREATED).body(questionService.saveQuestion(question));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Question> updateQuestion(@PathVariable String id, @RequestBody Question question) {
		return ResponseEntity.ok(questionService.updateQuestion(id, question));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteQuestion(@PathVariable String id) {
		questionService.deleteQuestion(id);
		return ResponseEntity.noContent().build();
	}

	// ===== FILTRADO GENERAL =====

	@GetMapping("/type/{type}")
	public Page<Question> getFiltered(@PathVariable QuestionType type, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "") String search, @RequestParam(defaultValue = "") String category) {

		return questionService.getFilteredQuestions(type, search, category, PageRequest.of(page, 5));
	}
}