import { useEffect, useState, useRef } from "react";
import { QuestionType } from "../../types/Question";
import type { Question } from "../../types/Question";
import { getQuestionsByType } from "../../api/questions.api";
import "./QuestionsList.css";

export default function SingleChoiceList({
  currentUser,
}: {
  currentUser: { username: string } | null;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // --- ESTADOS JUEGO / TEST ---
  const [playQuestion, setPlayQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
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
        QuestionType.SINGLE_CHOICE,
        page,
      );

      const { content, totalPages: total } = response.data;

      setQuestions(content);
      setTotalPages(total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error cargando preguntas de Selección Única:", error);
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

  // --- LÓGICA DE JUEGO ---
  const handleOpenJugar = (q: Question) => {
    setIsTestMode(false);
    setPlayQuestion(q);
    setUserAnswer(null);
    setFeedback(null);
    refJugar.current?.showModal();
  };

  const startTest = async () => {
    try {
      // Traemos todas las preguntas de todas las páginas
      let allQuestions: Question[] = [];
      for (let page = 0; page < totalPages; page++) {
        const res = await getQuestionsByType(QuestionType.SINGLE_CHOICE, page);
        allQuestions = allQuestions.concat(res.data.content);
      }

      if (allQuestions.length < 5) {
        alert("No hay suficientes preguntas para un test.");
        return;
      }

      // Mezclamos todas las preguntas y tomamos 5
      const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

      setTestQueue(shuffled);
      setCurrentTestIndex(0);
      setScore(0);
      setTestFinished(false);
      setIsTestMode(true);
      setPlayQuestion(shuffled[0]);
      setUserAnswer(null);
      setFeedback(null);
      refJugar.current?.showModal();
    } catch (err) {
      console.error("Error al iniciar el test:", err);
      alert("Error al iniciar el test.");
    }
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
    } else if (currentUser) {
      const storageKey = `quiz_history_${currentUser.username}`;

      const newResult = {
        id: Date.now(),
        category:
          filterCategory === "Todas" ? "Mezcla Opción Única" : filterCategory,
        score: score,
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

      {/* MODAL JUEGO */}
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
                    className={`btn-card game-option-btn ${userAnswer === opt ? "primary" : ""}`}
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
