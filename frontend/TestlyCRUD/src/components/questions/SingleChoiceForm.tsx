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

export default function SingleChoiceList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [totalPages, setTotalPages] = useState(0); // Total de páginas

  // --- ESTADOS JUEGO / TEST ---
  const [playQuestion, setPlayQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );

  // MODO TEST
  const [isTestMode, setIsTestMode] = useState(false);
  const [testQueue, setTestQueue] = useState<Question[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  // --- FILTROS Y REFS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");
  const refCrear = useRef<HTMLDialogElement>(null);
  const refEliminar = useRef<HTMLDialogElement>(null);
  const refEditar = useRef<HTMLDialogElement>(null);
  const refJugar = useRef<HTMLDialogElement>(null);

  const [formData, setFormData] = useState({
    question: "",
    category: "General",
    difficulty: 1,
    options: ["", "", "", ""],
    correctIndex: 0,
  });
  const [editData, setEditData] = useState({
    question: "",
    category: "",
    difficulty: 1,
    options: ["", "", "", ""],
    correctIndex: 0,
  });

  // --- CARGA ---
  const loadQuestions = async (page = 0) => {
    try {
      // 1. Pedimos explícitamente el tipo de esta vista
      const response = await getQuestionsByType(
        QuestionType.SINGLE_CHOICE,
        page,
      );

      // 2. Extraemos los datos del objeto Page de Spring
      // content = el array de 5 preguntas de ese tipo
      // totalPages = cuántas páginas de 5 existen para ESE tipo
      const { content, totalPages: total } = response.data;

      setQuestions(content);
      setTotalPages(total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error cargando preguntas de V/F:", error);
    }
  };

  useEffect(() => {
    loadQuestions(0); // Carga la página 1 al montar el componente
  }, []);

  const filteredQuestions = questions.filter((q) => {
    return (
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "Todas" || q.category === filterCategory)
    );
  });
  const uniqueCategories = [
    "Todas",
    ...new Set(questions.map((q) => q.category)),
  ];

  // --- CRUD HELPERS ---
  const handleCreate = async () => {
    await createQuestion({
      ...formData,
      type: QuestionType.SINGLE_CHOICE,
      answer: [formData.options[formData.correctIndex]],
    });
    setFormData({ ...formData, question: "", options: ["", "", "", ""] });
    await loadQuestions();
    refCrear.current?.close();
  };

  const confirmDelete = async () => {
    if (selectedQuestion?.id) await deleteQuestion(selectedQuestion.id);
    await loadQuestions();
    refEliminar.current?.close();
  };

  const handleOpenEditar = (q: Question) => {
    setSelectedQuestion(q);
    const idx = q.options?.findIndex((o) => o === q.answer[0]);
    setEditData({
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      options: q.options || [],
      correctIndex: typeof idx === "number" && idx !== -1 ? idx : 0,
    });
    refEditar.current?.showModal();
  };

  const confirmEdit = async () => {
    if (selectedQuestion?.id)
      await updateQuestion(selectedQuestion.id, {
        ...selectedQuestion,
        ...editData,
        answer: [editData.options[editData.correctIndex]],
      });
    await loadQuestions();
    refEditar.current?.close();
  };

  // --- LOGICA TEST ---
  const handleOpenJugar = (q: Question) => {
    setIsTestMode(false);
    setPlayQuestion(q);
    setUserAnswer(null);
    setFeedback(null);
    refJugar.current?.showModal();
  };

  const startTest = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 5);
    if (shuffled.length === 0) return alert("No hay preguntas suficientes.");
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
        <h2 className="page-title">Listado de preguntas (Selección Única)</h2>
      </header>
      <div className="filters-bar testly-card" style={{ padding: "1.5rem" }}>
        <input
          className="form-control"
          style={{ width: "250px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar..."
        />
        <select
          className="form-control"
          style={{ width: "150px" }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {uniqueCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          className="btn-confirmation"
          onClick={() => refCrear.current?.showModal()}
        >
          + Crear
        </button>
        <button className="btn-card primary" onClick={startTest}>
          🎲 Jugar Test (5)
        </button>
      </div>

      <div className="questions-grid">
        {filteredQuestions.map((q) => (
          <article key={q.id} className="testly-card question-card">
            <div className="card-header">
              <span className="badge-category">{q.category}</span>
            </div>
            <h5 className="card-title">{q.question}</h5>
            <div className="card-actions">
              <button
                className="btn-card icon"
                onClick={() => handleOpenEditar(q)}
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
        ))}
      </div>

      {/* CONTROLES DE PAGINACIÓN */}
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
          <strong style={{ color: "var(--accent)" }}>{currentPage + 1}</strong>{" "}
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

      {/* DIALOGOS CRUD */}
      <dialog ref={refCrear} className="testly-card modal-center modal-lg">
        <h3 className="game-title">Nueva Pregunta</h3>
        <textarea
          className="form-control mb-3"
          value={formData.question}
          onChange={(e) =>
            setFormData({ ...formData, question: e.target.value })
          }
        />
        {formData.options.map((opt, i) => (
          <div key={i} className="option-input">
            <input
              type="radio"
              checked={formData.correctIndex === i}
              onChange={() => setFormData({ ...formData, correctIndex: i })}
            />
            <input
              className="form-control"
              value={opt}
              onChange={(e) => {
                const n = [...formData.options];
                n[i] = e.target.value;
                setFormData({ ...formData, options: n });
              }}
              placeholder={`Opción ${i + 1}`}
            />
          </div>
        ))}
        <div className="form-row mt-3">
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
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="dialog-actions mt-3">
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

      <dialog ref={refEditar} className="testly-card modal-center modal-lg">
        <h3 className="game-title">Editar Pregunta</h3>
        <textarea
          className="form-control mb-3"
          value={editData.question}
          onChange={(e) =>
            setEditData({ ...editData, question: e.target.value })
          }
        />
        {editData.options.map((opt, i) => (
          <div key={i} className="option-input">
            <input
              type="radio"
              checked={editData.correctIndex === i}
              onChange={() => setEditData({ ...editData, correctIndex: i })}
            />
            <input
              className="form-control"
              value={opt}
              onChange={(e) => {
                const n = [...editData.options];
                n[i] = e.target.value;
                setEditData({ ...editData, options: n });
              }}
            />
          </div>
        ))}
        <div className="form-row mt-3">
          <input
            className="form-control"
            value={editData.category}
            onChange={(e) =>
              setEditData({ ...editData, category: e.target.value })
            }
          />
          <select
            className="form-control"
            value={editData.difficulty}
            onChange={(e) =>
              setEditData({ ...editData, difficulty: Number(e.target.value) })
            }
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="dialog-actions mt-3">
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
        <h3 className="game-title">¿Eliminar?</h3>
        <div className="dialog-actions">
          <button
            className="btn-dialog-cancel"
            onClick={() => refEliminar.current?.close()}
          >
            No
          </button>
          <button className="btn-card danger" onClick={confirmDelete}>
            Si
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
              <div className="game-options">
                {playQuestion.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`btn-card game-option-btn ${
                      userAnswer === opt ? "primary" : ""
                    }`}
                    onClick={() => checkAnswer(opt)}
                    disabled={!!feedback}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback === "correct" && (
                <div className="game-feedback correct">¡CORRECTO!</div>
              )}
              {feedback === "incorrect" && (
                <div className="game-feedback incorrect">
                  INCORRECTO. Era: {playQuestion.answer[0]}
                </div>
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
          <div className="game-results">
            <h2 className="game-title">Resultados</h2>
            <div className={`game-score ${score >= 3 ? "success" : "fail"}`}>
              {score} / {testQueue.length}
            </div>
            <button
              className="btn-confirmation"
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
