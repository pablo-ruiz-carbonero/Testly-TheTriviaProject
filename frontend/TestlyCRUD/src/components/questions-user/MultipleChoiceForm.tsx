import { useEffect, useState, useRef } from "react";
import { QuestionType } from "../../types/Question";
import type { Question } from "../../types/Question";
import { getQuestionsByType } from "../../api/questions.api";
import "./QuestionsList.css";

export default function MultipleChoiceList({
  currentUser,
}: {
  currentUser: { username: string } | null;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // --- ESTADOS JUEGO / TEST ---
  const [playQuestion, setPlayQuestion] = useState<Question | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );

  const [isTestMode, setIsTestMode] = useState(false);
  const [testQueue, setTestQueue] = useState<Question[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  // --- FILTROS Y REFS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");
  const refJugar = useRef<HTMLDialogElement>(null);

  // --- CARGA ---
  const loadQuestions = async (page = 0) => {
    try {
      const response = await getQuestionsByType(
        QuestionType.MULTIPLE_CHOICE,
        page,
      );
      const { content, totalPages: total } = response.data;
      setQuestions(content);
      setTotalPages(total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error cargando preguntas de Opción Múltiple:", error);
    }
  };

  useEffect(() => {
    loadQuestions(0);
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

  // --- LÓGICA DE JUEGO / TEST ---
  const handleOpenJugar = (q: Question) => {
    setIsTestMode(false);
    setPlayQuestion(q);
    setUserAnswers([]);
    setFeedback(null);
    refJugar.current?.showModal();
  };

  const startTest = async () => {
    try {
      // 1️⃣ Traer todas las preguntas de todas las páginas
      let allQuestions: Question[] = [];
      for (let page = 0; page < totalPages; page++) {
        const res = await getQuestionsByType(
          QuestionType.MULTIPLE_CHOICE,
          page,
        );
        allQuestions = allQuestions.concat(res.data.content);
      }

      if (allQuestions.length < 5) {
        alert("No hay suficientes preguntas para un test.");
        return;
      }

      const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

      // 4️⃣ Inicializar el test
      setTestQueue(shuffled);
      setCurrentTestIndex(0);
      setScore(0);
      setTestFinished(false);
      setIsTestMode(true);
      setPlayQuestion(shuffled[0]);
      setUserAnswers([]);
      setFeedback(null);
      refJugar.current?.showModal();
    } catch (err) {
      console.error("Error al iniciar el test:", err);
      alert("Error al iniciar el test.");
    }
  };

  const toggleUserAnswer = (option: string) => {
    if (feedback) return;
    setUserAnswers((prev) =>
      prev.includes(option)
        ? prev.filter((a) => a !== option)
        : [...prev, option],
    );
  };

  const validateAnswer = () => {
    if (!playQuestion) return;
    const correctSorted = [...playQuestion.answer].sort().join("|");
    const userSorted = [...userAnswers].sort().join("|");
    const isCorrect = correctSorted === userSorted;

    setFeedback(isCorrect ? "correct" : "incorrect");
    if (isTestMode && isCorrect) setScore((s) => s + 1);
  };

  const nextTestQuestion = () => {
    const nextIdx = currentTestIndex + 1;
    if (nextIdx < testQueue.length) {
      setCurrentTestIndex(nextIdx);
      setPlayQuestion(testQueue[nextIdx]);
      setUserAnswers([]);
      setFeedback(null);
    } else if (currentUser) {
      const storageKey = `quiz_history_${currentUser.username}`;
      const newResult = {
        id: Date.now(),
        category:
          filterCategory === "Todas" ? "Mezcla Múltiple" : filterCategory,
        score,
        totalQuestions: testQueue.length,
        date: new Date().toISOString(),
      };
      const existingHistory = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      );
      localStorage.setItem(
        storageKey,
        JSON.stringify([newResult, ...existingHistory]),
      );
      setTestFinished(true);
    } else {
      setTestFinished(true);
    }
  };

  return (
    <section className="container mt-4">
      <header className="page-header">
        <h2 className="page-title">Listado de preguntas (Opción Múltiple)</h2>
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
        <button className="btn-card primary" onClick={startTest}>
          🎲 Jugar Test (5)
        </button>
      </div>

      <div className="questions-grid">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            No hay preguntas disponibles
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <article key={q.id} className="testly-card question-card">
              <div className="card-header">
                <span className="badge-category">{q.category}</span>
              </div>
              <h5 className="card-title">{q.question}</h5>
              <div className="card-actions">
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

      {/* --- MODAL JUEGO / TEST --- */}
      <dialog
        ref={refJugar}
        className="testly-card modal-center modal-lg"
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
              <p className="text-dim">Selecciona las correctas:</p>

              <div className="game-options">
                {playQuestion.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`btn-card game-option-btn ${
                      userAnswers.includes(opt) ? "primary" : ""
                    }`}
                    onClick={() => toggleUserAnswer(opt)}
                  >
                    {userAnswers.includes(opt) ? "✅ " : "⬜ "} {opt}
                  </button>
                ))}
              </div>

              {!feedback && (
                <button
                  className="btn-confirmation w-100 mb-3"
                  onClick={validateAnswer}
                  disabled={userAnswers.length === 0}
                >
                  Validar
                </button>
              )}

              {feedback === "correct" && (
                <div className="game-feedback correct">¡CORRECTO!</div>
              )}
              {feedback === "incorrect" && (
                <div className="game-feedback incorrect">
                  INCORRECTO. Correctas: {playQuestion.answer.join(", ")}
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
