package com.example.demo.repository.mongo;

import com.example.demo.model.document.Question;
import com.example.demo.model.document.Question.QuestionType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para el documento Question en MongoDB. Maneja las operaciones de
 * base de datos para las preguntas de quiz.
 */
@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {

	/**
	 * Busca preguntas filtradas por tipo, categoría opcional y texto de la
	 * pregunta. Si category es null o vacío, se ignora ese filtro.
	 */
	@Query("""
			    {
			      'type': ?0,
			      'question': { $regex: ?1, $options: 'i' },
			      $expr: { $or: [ { $eq: [ ?2, '' ] }, { $eq: [ '$category', ?2 ] } ] }
			    }
			""")
	Page<Question> findFiltered(QuestionType type, String search, String category, Pageable pageable);
}