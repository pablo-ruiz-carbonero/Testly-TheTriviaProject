// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth.api";
import "./Auth.css";

interface LoginProps {
  onLoginSuccess: () => Promise<void>;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ username, password });

      // Si tu API devuelve un 200 OK con success: true
      if (response.success) {
        await onLoginSuccess();
        navigate("/");
      } else {
        setError(response.message || "Credenciales incorrectas");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // CAPTURAR ERRORES DE AXIOS
      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos");
      } else if (err.response?.status === 403) {
        setError("No tienes permiso para acceder");
      } else {
        setError("No se pudo conectar con el servidor. Inténtalo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="testly-card-auth">
        <div className="text-center mb-5" style={{ textAlign: "center" }}>
          <div className="logo-text">Testly</div>
          <h2 style={{ margin: "0 0 10px 0" }}>¡Hola de nuevo!</h2>
          <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
            Ingresa tus credenciales para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Nombre de usuario"
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="**********"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn-testly" disabled={loading}>
            {loading ? "Cargando..." : "Entrar"}
          </button>

          <div className="auth-footer">
            <span style={{ color: "var(--text-dim)" }}>
              ¿No tienes cuenta?{" "}
            </span>
            <Link to="/register">Regístrate aquí</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
