import { useEffect, useState, useRef } from "react";
import { QuestionType } from "../../types/Question";
import type { Question } from "../../types/Question";
import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestionsByType,
} from "../../api/questions.api";
import "./QuestionsList.css";

export default function TrueFalseList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- ESTADOS JUEGO / TEST ---
  const [playQuestion, setPlayQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );

  // Estados para el Modo Test (Secuencia)
  const [isTestMode, setIsTestMode] = useState(false);
  const [testQueue, setTestQueue] = useState<Question[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  // --- FILTROS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");

  // --- REFS ---
  const refCrear = useRef<HTMLDialogElement>(null);
  const refEliminar = useRef<HTMLDialogElement>(null);
  const refEditar = useRef<HTMLDialogElement>(null);
  const refJugar = useRef<HTMLDialogElement>(null);

  // --- FORMS ---
  const [formData, setFormData] = useState({
    question: "",
    category: "General",
    difficulty: 1,
    answer: "true",
  });
  const [editData, setEditData] = useState({
    question: "",
    category: "",
    difficulty: 1,
    answer: "true",
  });

  // --- CARGA Y FILTRADO ---
  const loadQuestions = async (
    page = 0,
    search = searchTerm,
    category = filterCategory,
  ) => {
    setLoading(true);
    setError(null);

    try {
      // ⚠️ Debes actualizar tu API (questions.api.ts) para que acepte estos params
      const response = await getQuestionsByType(
        QuestionType.TRUE_FALSE,
        page,
        search,
        category === "Todas" ? "" : category,
      );

      const { content, totalPages: total } = response.data;

      setQuestions(content);
      setTotalPages(total);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("Error cargando preguntas de V/F:", err);

      if (err.response?.status === 401) {
        setError("No estás autenticado. Por favor, inicia sesión.");
      } else if (err.response?.status === 403) {
        setError("No tienes permisos para ver estas preguntas.");
      } else {
        setError(
          "Error al cargar las preguntas. Verifica que el servidor esté corriendo.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadQuestions(0, searchTerm, filterCategory);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterCategory]);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "Todas" || q.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [
    "Todas",
    ...new Set(questions.map((q) => q.category)),
  ];

  // --- CRUD ---
  const handleCreate = async () => {
    if (!formData.question.trim()) {
      alert("El enunciado no puede estar vacío");
      return;
    }

    try {
      await createQuestion({
        ...formData,
        type: QuestionType.TRUE_FALSE,
        answer: [formData.answer],
      });

      setFormData({
        question: "",
        category: "General",
        difficulty: 1,
        answer: "true",
      });

      await loadQuestions(currentPage);
      refCrear.current?.close();
    } catch (err: any) {
      console.error("Error creando pregunta:", err);
      alert(
        "Error al crear la pregunta: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  const confirmDelete = async () => {
    if (!selectedQuestion?.id) return;

    try {
      await deleteQuestion(selectedQuestion.id);
      await loadQuestions(currentPage);
      refEliminar.current?.close();
    } catch (err: any) {
      console.error("Error eliminando pregunta:", err);
      alert(
        "Error al eliminar la pregunta: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  const confirmEdit = async () => {
    if (!selectedQuestion?.id) return;

    if (!editData.question.trim()) {
      alert("El enunciado no puede estar vacío");
      return;
    }

    try {
      await updateQuestion(selectedQuestion.id, {
        ...selectedQuestion,
        ...editData,
        answer: [editData.answer],
      });

      await loadQuestions(currentPage);
      refEditar.current?.close();
    } catch (err: any) {
      console.error("Error editando pregunta:", err);
      alert(
        "Error al editar la pregunta: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  // --- LÓGICA DE JUEGO Y TEST ---
  const handleOpenJugar = (q: Question) => {
    setIsTestMode(false);
    setPlayQuestion(q);
    setUserAnswer(null);
    setFeedback(null);
    refJugar.current?.showModal();
  };

  const startTest = () => {
    if (questions.length < 5) {
      alert("Se necesitan al menos 5 preguntas para un test.");
      return;
    }

    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 5);

    setTestQueue(shuffled);
    setCurrentTestIndex(0);
    setScore(0);
    setTestFinished(false);
    setIsTestMode(true);
    setPlayQuestion(shuffled[0]);
    setUserAnswer(null);
    setFeedback(null);
    refJugar.current?.showModal();
  };

  const checkAnswer = (selected: string) => {
    setUserAnswer(selected);
    const isCorrect = playQuestion?.answer.includes(selected);
    setFeedback(isCorrect ? "correct" : "incorrect");
    if (isTestMode && isCorrect) setScore((s) => s + 1);
  };

  const nextTestQuestion = () => {
    const nextIdx = currentTestIndex + 1;
    if (nextIdx < testQueue.length) {
      setCurrentTestIndex(nextIdx);
      setPlayQuestion(testQueue[nextIdx]);
      setUserAnswer(null);
      setFeedback(null);
    } else {
      setTestFinished(true);
    }
  };

  return (
    <section className="container mt-4">
      <header className="page-header">
        <h2 className="page-title">Listado de preguntas (V/F)</h2>
      </header>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* FILTROS Y BOTONES */}
      <div className="filters-bar testly-card" style={{ padding: "1.5rem" }}>
        <input
          type="text"
          placeholder="Buscar..."
          className="form-control"
          style={{ width: "250px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-control"
          style={{ width: "150px" }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          className="btn-confirmation"
          onClick={() => refCrear.current?.showModal()}
          disabled={loading}
        >
          + Crear
        </button>
        <button
          className="btn-card primary"
          onClick={startTest}
          disabled={loading || questions.length < 5}
        >
          🎲 Jugar Test (5)
        </button>
      </div>

      {/* LOADER */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {/* GRID DE PREGUNTAS */}
      {!loading && (
        <div className="questions-grid">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              No hay preguntas disponibles
            </div>
          ) : (
            questions.map((q) => (
              <article key={q.id} className="testly-card question-card">
                <div className="card-header">
                  <span className="badge-category">{q.category}</span>
                </div>
                <h5 className="card-title">{q.question}</h5>
                <div className="card-actions">
                  <button
                    className="btn-card icon"
                    onClick={() => {
                      setSelectedQuestion(q);
                      setEditData({
                        question: q.question,
                        category: q.category,
                        difficulty: q.difficulty,
                        answer: q.answer[0],
                      });
                      refEditar.current?.showModal();
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-card danger"
                    onClick={() => {
                      setSelectedQuestion(q);
                      refEliminar.current?.showModal();
                    }}
                  >
                    🗑️
                  </button>
                  <button
                    className="btn-card primary"
                    onClick={() => handleOpenJugar(q)}
                  >
                    Responder
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* CONTROLES DE PAGINACIÓN */}
      {!loading && totalPages > 1 && (
        <div className="pagination-container mt-4 d-flex justify-center align-center gap-3">
          <button
            className="btn-card icon"
            disabled={currentPage === 0}
            onClick={() => loadQuestions(currentPage - 1)}
          >
            ⬅ Anterior
          </button>

          <span className="text-dim">
            Página{" "}
            <strong style={{ color: "var(--accent)" }}>
              {currentPage + 1}
            </strong>{" "}
            de {totalPages}
          </span>

          <button
            className="btn-card icon"
            disabled={currentPage >= totalPages - 1}
            onClick={() => loadQuestions(currentPage + 1)}
          >
            Siguiente ➡
          </button>
        </div>
      )}

      {/* MODALES CRUD */}
      <dialog ref={refCrear} className="testly-card modal-center">
        <h3 className="game-title">Nueva Pregunta V/F</h3>
        <textarea
          className="form-control mb-3"
          placeholder="Enunciado"
          value={formData.question}
          onChange={(e) =>
            setFormData({ ...formData, question: e.target.value })
          }
        />
        <div className="form-row">
          <input
            className="form-control"
            placeholder="Categoría"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
          <select
            className="form-control"
            value={formData.difficulty}
            onChange={(e) =>
              setFormData({ ...formData, difficulty: Number(e.target.value) })
            }
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                Dificultad {n}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex gap-4 justify-center mb-4">
          <label>
            <input
              type="radio"
              checked={formData.answer === "true"}
              onChange={() => setFormData({ ...formData, answer: "true" })}
            />{" "}
            Verdadero
          </label>
          <label>
            <input
              type="radio"
              checked={formData.answer === "false"}
              onChange={() => setFormData({ ...formData, answer: "false" })}
            />{" "}
            Falso
          </label>
        </div>
        <div className="dialog-actions">
          <button
            className="btn-dialog-cancel"
            onClick={() => refCrear.current?.close()}
          >
            Cancelar
          </button>
          <button className="btn-confirmation" onClick={handleCreate}>
            Guardar
          </button>
        </div>
      </dialog>

      <dialog ref={refEditar} className="testly-card modal-center">
        <h3 className="game-title">Editar Pregunta</h3>
        <textarea
          className="form-control mb-3"
          value={editData.question}
          onChange={(e) =>
            setEditData({ ...editData, question: e.target.value })
          }
        />
        <div className="d-flex gap-4 justify-center mb-4">
          <label>
            <input
              type="radio"
              checked={editData.answer === "true"}
              onChange={() => setEditData({ ...editData, answer: "true" })}
            />{" "}
            Verdadero
          </label>
          <label>
            <input
              type="radio"
              checked={editData.answer === "false"}
              onChange={() => setEditData({ ...editData, answer: "false" })}
            />{" "}
            Falso
          </label>
        </div>
        <div className="dialog-actions">
          <button
            className="btn-dialog-cancel"
            onClick={() => refEditar.current?.close()}
          >
            Cancelar
          </button>
          <button className="btn-confirmation" onClick={confirmEdit}>
            Guardar
          </button>
        </div>
      </dialog>

      <dialog ref={refEliminar} className="testly-card modal-center">
        <h3 className="game-title">¿Borrar pregunta?</h3>
        <p className="text-center text-secondary">
          Esta acción no se puede deshacer
        </p>
        <div className="dialog-actions">
          <button
            className="btn-dialog-cancel"
            onClick={() => refEliminar.current?.close()}
          >
            No
          </button>
          <button className="btn-card danger" onClick={confirmDelete}>
            Sí, borrar
          </button>
        </div>
      </dialog>

      {/* --- MODAL JUEGO --- */}
      <dialog
        ref={refJugar}
        className="testly-card modal-center"
        style={{ textAlign: "center" }}
      >
        {!testFinished ? (
          playQuestion && (
            <>
              <h3 className="game-title">
                {isTestMode
                  ? `Pregunta ${currentTestIndex + 1} de ${testQueue.length}`
                  : "Modo Práctica"}
              </h3>
              <p className="game-question">{playQuestion.question}</p>
              <div className="d-flex gap-2 justify-center mb-3">
                <button
                  className={`btn-card ${userAnswer === "true" ? "primary" : ""}`}
                  onClick={() => checkAnswer("true")}
                  disabled={!!feedback}
                >
                  Verdadero
                </button>
                <button
                  className={`btn-card ${userAnswer === "false" ? "primary" : ""}`}
                  onClick={() => checkAnswer("false")}
                  disabled={!!feedback}
                >
                  Falso
                </button>
              </div>
              {feedback === "correct" && (
                <div className="game-feedback correct">¡CORRECTO!</div>
              )}
              {feedback === "incorrect" && (
                <div className="game-feedback incorrect">INCORRECTO</div>
              )}

              <div
                className="dialog-actions mt-4"
                style={{ justifyContent: "center" }}
              >
                {!isTestMode && (
                  <button
                    className="btn-dialog-cancel"
                    onClick={() => refJugar.current?.close()}
                  >
                    Salir
                  </button>
                )}
                {isTestMode && feedback && (
                  <button
                    className="btn-confirmation"
                    onClick={nextTestQuestion}
                  >
                    {currentTestIndex < testQueue.length - 1
                      ? "Siguiente ➡"
                      : "Ver Resultados 🏁"}
                  </button>
                )}
              </div>
            </>
          )
        ) : (
          /* PANTALLA DE RESULTADOS */
          <div className="game-results">
            <h2 className="game-title">Resultados del Test</h2>
            <div className={`game-score ${score >= 3 ? "success" : "fail"}`}>
              {score} / {testQueue.length}
            </div>
            <p className="text-dim">Preguntas acertadas</p>
            <button
              className="btn-confirmation mt-4"
              onClick={() => refJugar.current?.close()}
            >
              Cerrar
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
