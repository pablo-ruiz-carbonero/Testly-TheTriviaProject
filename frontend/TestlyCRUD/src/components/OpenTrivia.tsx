import { useState } from "react";
import { openTriviaApi, type TriviaQuestion } from "../api/open.trivia";
import "./OpenTrivia.css";

export default function OpenTriviaPage() {
  const [gameState, setGameState] = useState<"start" | "playing" | "finished">(
    "start",
  );
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  // Iniciar juego
  const startGame = async (difficulty: "easy" | "medium" | "hard") => {
    setLoading(true);
    const data = await openTriviaApi.getQuestions(10, difficulty);
    setQuestions(data);
    setCurrentIndex(0);
    setScore(0);
    setGameState("playing");
    setLoading(false);
  };

  // Manejar respuesta
  const handleAnswer = (selectedAnswer: string) => {
    const currentQuestion = questions[currentIndex];
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameState("finished");
    }
  };

  // --- VISTAS ---

  // 1. Pantalla de Inicio
  if (gameState === "start") {
    return (
      <div className="arcade-wrapper">
        <div className="arcade-glass-panel text-center">
          <h1 className="arcade-title">
            🌐 Open Trivia <span className="text-gradient">Arcade</span>
          </h1>
          <p className="arcade-subtitle">Selecciona tu nivel de desafío</p>

          {loading ? (
            <div className="arcade-loader">
              <div className="spinner"></div>
              <span>Conectando...</span>
            </div>
          ) : (
            <div className="arcade-difficulty-grid">
              <button
                className="arcade-btn diff-easy"
                onClick={() => startGame("easy")}
              >
                <span className="icon">🟢</span> Fácil
              </button>
              <button
                className="arcade-btn diff-medium"
                onClick={() => startGame("medium")}
              >
                <span className="icon">🟡</span> Medio
              </button>
              <button
                className="arcade-btn diff-hard"
                onClick={() => startGame("hard")}
              >
                <span className="icon">🔴</span> Difícil
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Pantalla de Resultados
  if (gameState === "finished") {
    return (
      <div className="arcade-wrapper">
        <div className="arcade-glass-panel">
          <h2 className="arcade-title">
            ¡Test <span className="text-gradient">Finalizado!</span>
          </h2>

          <div className="arcade-score-circle">
            <span className="score-value">{score}</span>
          </div>

          <p
            className="arcade-feedback"
            style={{
              color: "var(--text-dim)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            {score > 7
              ? "🏆 Nivel Experto"
              : score > 4
                ? "👍 Buen trabajo"
                : "📚 Sigue practicando"}
          </p>

          <button
            className="arcade-btn"
            style={{
              width: "100%",
              background: "var(--accent)",
              color: "var(--bg-dark)",
            }}
            onClick={() => setGameState("start")}
          >
            REINTENTAR DESAFÍO
          </button>
        </div>
      </div>
    );
  }

  // 3. Pantalla de Juego
  const currentQ = questions[currentIndex];

  return (
    <div className="arcade-wrapper">
      {/* Barra superior de estado */}
      <div className="arcade-hud">
        <div className="hud-item">
          <span className="label">Pregunta</span>
          <span className="value">
            {currentIndex + 1}
            <small>/{questions.length}</small>
          </span>
        </div>
        <div className="hud-item">
          <span className="label">Score</span>
          <span className="value score-highlight">{score}</span>
        </div>
      </div>

      <div className="arcade-glass-panel game-panel">
        <span className="arcade-badge">{currentQ.category}</span>

        {/* Usamos dangerouslySetInnerHTML si la API devuelve entidades HTML (ej: &quot;) 
            o simplemente renderizamos el texto si ya lo limpiaste en el api service */}
        <h3 className="arcade-question">{currentQ.question}</h3>

        <div className="arcade-options-grid">
          {currentQ.all_answers?.map((ans, idx) => (
            <button
              key={idx}
              className="arcade-option"
              onClick={() => handleAnswer(ans)}
            >
              <span className="opt-letter">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="opt-text">{ans}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
