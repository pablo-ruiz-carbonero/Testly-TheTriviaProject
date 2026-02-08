// src/pages/MyScore.tsx
import "./Auth.css";

export default function MyScore() {
  // Datos de ejemplo (luego vendrán de tu API)
  const stats = {
    totalGames: 12,
    correctAnswers: 45,
    wrongAnswers: 15,
    rank: "Maestro",
  };

  return (
    <div className="container mt-5 text-center">
      <div
        className="testly-card modal-center"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "4rem", color: "var(--accent)" }}
        >
          emoji_events
        </span>
        <h2 className="logo-text">Mi Progreso</h2>

        <div className="game-results mt-4">
          <div className="game-score success">{stats.correctAnswers}</div>
          <p className="text-dim">Preguntas acertadas en total</p>
        </div>

        <div className="mt-4" style={{ textAlign: "left" }}>
          <p className="form-label">
            Rango actual:{" "}
            <span style={{ color: "var(--accent)" }}>{stats.rank}</span>
          </p>
          <p className="form-label">Partidas jugadas: {stats.totalGames}</p>
          <p className="form-label">
            Precisión:{" "}
            {(
              (stats.correctAnswers /
                (stats.correctAnswers + stats.wrongAnswers)) *
              100
            ).toFixed(0)}
            %
          </p>
        </div>

        <button className="btn-testly mt-4" style={{ marginBottom: "198px" }}>
          Compartir Logros
        </button>
      </div>
    </div>
  );
}
