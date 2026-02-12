import { useEffect, useState } from "react";

interface MyScoreProps {
  currentUser: { username: string } | null;
}

export default function MyScore({ currentUser }: MyScoreProps) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser) {
      // Buscamos la caja fuerte de este usuario concreto
      const storageKey = `quiz_history_${currentUser.username}`;
      const savedHistory = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setHistory(savedHistory);
    }
  }, [currentUser]);

  if (!currentUser) return <p>Inicia sesión para ver tu puntuación.</p>;

  const totalScore = history.reduce(
    (acc: number, curr: any) => acc + curr.score,
    0,
  );

  return (
    <div className="container mt-4">
      <div
        className="testly-card"
        style={{
          padding: "2rem",
          textAlign: "center",
          border: "2px solid var(--accent)",
        }}
      >
        <h1 style={{ fontSize: "3rem", color: "var(--accent)", margin: 0 }}>
          {totalScore}
        </h1>
        <p className="text-dim">PUNTOS TOTALES (LOCAL)</p>
        <div
          className="badge-category"
          style={{ fontSize: "1rem", padding: "5px 15px" }}
        >
          {totalScore > 50 ? "🔥 Racha Imparable" : "🎯 En prácticas"}
        </div>
      </div>

      <h3 className="mt-4 mb-3">Tu historial guardado</h3>
      <div className="questions-grid">
        {history.length === 0 ? (
          <p>Aún no has completado ningún test.</p>
        ) : (
          history.map((item: any) => (
            <div
              key={item.id}
              className="testly-card"
              style={{
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong>{item.category}</strong>
                <div className="text-dim" style={{ fontSize: "0.8rem" }}>
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
              <div style={{ color: "var(--accent)", fontWeight: "bold" }}>
                {item.score} / {item.totalQuestions}
              </div>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <button
          onClick={() => {
            localStorage.removeItem("quiz_history");
            setHistory([]);
          }}
          style={{
            marginTop: "20px",
            background: "transparent",
            border: "none",
            color: "red",
            cursor: "pointer",
          }}
        >
          Borrar todo mi historial
        </button>
      )}
    </div>
  );
}
