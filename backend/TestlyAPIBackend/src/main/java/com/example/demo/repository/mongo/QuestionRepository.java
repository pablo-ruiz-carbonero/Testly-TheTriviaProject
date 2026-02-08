package com.example.demo.repository.mongo;

import com.example.demo.model.document.Question;
import com.example.demo.model.document.Question.QuestionType;
import org.springframework.data.domain.Page; // Importante: usar Spring Domain
import org.springframework.data.domain.Pageable; // Importante: usar Spring Domain
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {

    // 1. Métodos Paginados (Devuelven Page<Question>)
    // Estos son los que usará tu Service para el listado de 5 en 5

    Page<Question> findByCategory(String category, Pageable pageable);

    Page<Question> findByDifficulty(int difficulty, Pageable pageable);

    Page<Question> findByType(QuestionType type, Pageable pageable);

    Page<Question> findByCategoryAndDifficulty(String category, int difficulty, Pageable pageable);

    Page<Question> findByTypeAndCategory(QuestionType type, String category, Pageable pageable);

    Page<Question> findByCategoryAndDifficultyLessThanEqual(String category, int maxDifficulty, Pageable pageable);

    // 2. Métodos de Lista (Sin Pageable)
    // Estos los necesita tu Service para el método de "Random/Shuffle" 
    // porque primero trae todos y luego mezcla.
    
    List<Question> findByCategory(String category);
    
    List<Question> findByDifficulty(int difficulty);
    
    Page<Question> findByTypeAndQuestionContainingIgnoreCaseAndCategoryContaining(
    	    Question.QuestionType type, 
    	    String search, 
    	    String category, 
    	    Pageable pageable
    	);
}