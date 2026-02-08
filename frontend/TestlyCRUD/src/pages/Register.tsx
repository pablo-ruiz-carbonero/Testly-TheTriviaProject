// src/pages/Register.tsx
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth.api";
import "./Auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (username.trim().length < 3) {
      setError("El usuario debe tener al menos 3 caracteres");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await register({ username, password });

      if (response.success) {
        // Registro exitoso - redirigir al login
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        navigate("/login");
      } else {
        setError(response.message || "Error al registrarse");
      }
    } catch (err: any) {
      console.error("Register error:", err);

      if (err.response?.status === 409) {
        setError("El usuario ya existe");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error de conexión. Verifica que el servidor esté corriendo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="testly-card-auth">
        <div className="text-center mb-5">
          <div className="logo-text">Testly</div>
          <h2 className="fw-bold mt-2">Crea tu cuenta</h2>
          <p className="text-secondary small">
            Únete a la nueva era de los tests.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn-testly" disabled={loading}>
            {loading ? "Cargando..." : "Registrarse"}
          </button>

          <div className="auth-footer">
            <span style={{ color: "var(--text-dim)" }}>
              ¿No tienes cuenta?{" "}
            </span>
            <Link to="/login">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
