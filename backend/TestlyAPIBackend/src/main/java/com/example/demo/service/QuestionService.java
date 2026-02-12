package com.example.demo.service;

import com.example.demo.dto.QuestionDTO;
import com.example.demo.model.document.Question;
import com.example.demo.model.document.Question.QuestionType;
import com.example.demo.repository.mongo.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Servicio para gestionar las preguntas de quiz. Proporciona operaciones CRUD y
 * búsqueda avanzada, ahora con logs.
 */
@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private LogService logService;

    private static final int PAGE_SIZE = 5;

    // ==================== CRUD ====================

    public Page<Question> getAllQuestionsPaged(int page) {
        logService.log("SYSTEM", "LIST_QUESTIONS", "Listado de preguntas en la página " + page, "INFO");
        return questionRepository.findAll(PageRequest.of(page, PAGE_SIZE));
    }

    public Optional<Question> getQuestionById(String id) {
        Optional<Question> question = questionRepository.findById(id);
        question.ifPresent(q -> logService.log("SYSTEM", "VIEW_QUESTION", "Visualizó la pregunta: " + q.getQuestion(), "INFO"));
        return question;
    }

    public Question saveQuestion(Question question) {
        Question saved = questionRepository.save(question);
        logService.log("SYSTEM", "CREATE_QUESTION", "Creada la pregunta: " + saved.getQuestion(), "INFO");
        return saved;
    }

    public Question updateQuestion(String id, Question updated) {
        Question existing = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        existing.setQuestion(updated.getQuestion());
        existing.setType(updated.getType());
        existing.setOptions(updated.getOptions());
        existing.setAnswer(updated.getAnswer());
        existing.setCategory(updated.getCategory());
        existing.setDifficulty(updated.getDifficulty());
        existing.setExplanation(updated.getExplanation());
        existing.setActive(updated.isActive());

        Question saved = questionRepository.save(existing);
        logService.log("SYSTEM", "UPDATE_QUESTION", "Actualizada la pregunta: " + saved.getQuestion(), "INFO");
        return saved;
    }

    public void deleteQuestion(String id) {
        Optional<Question> question = questionRepository.findById(id);
        question.ifPresent(q -> logService.log("SYSTEM", "DELETE_QUESTION", "Eliminada la pregunta: " + q.getQuestion(), "WARNING"));
        questionRepository.deleteById(id);
    }

    // ==================== FILTRADO GENERAL ====================

    public Page<Question> getFilteredQuestions(
            QuestionType type,
            String search,
            String category,
            Pageable pageable) {

        Page<Question> result = questionRepository.findFiltered(
                type,
                search == null ? "" : search,
                category == null ? "" : category,
                pageable
        );
        logService.log("SYSTEM", "FILTER_QUESTIONS", "Filtrado de preguntas con search='" + search + "', category='" + category + "'", "INFO");
        return result;
    }
}
