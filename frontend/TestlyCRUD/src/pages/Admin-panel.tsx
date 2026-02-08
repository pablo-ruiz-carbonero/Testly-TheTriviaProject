// src/pages/AdminPanel.tsx
import "./Auth.css"; // Reutilizamos estilos de tarjetas

export default function AdminPanel() {
  return (
    <div className="container mt-5">
      <header className="page-header mb-4">
        <h2 className="page-title">Panel de Administración</h2>
      </header>

      <div className="features-container">
        {/* Card de Estadísticas */}
        <div className="testly-card">
          <h3 className="game-title">Estadísticas Globales</h3>
          <p className="text-dim">Total de preguntas: 150</p>
          <p className="text-dim">Usuarios activos: 42</p>
        </div>

        {/* Card de Gestión */}
        <div className="testly-card">
          <h3 className="game-title">Gestión de Usuarios</h3>
          <button className="btn-testly mt-2">Ver Lista de Usuarios</button>
          <button
            className="btn-testly mt-2"
            style={{ background: "linear-gradient(135deg, #ff4b2b, #ff416c)" }}
          >
            Reportes de Errores
          </button>
        </div>
      </div>
    </div>
  );
}
