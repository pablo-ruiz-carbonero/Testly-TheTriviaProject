import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth.api";
import logo from "../assets/logo.webp";
import "./NavBar.css"; // <--- Importamos su propio CSS

interface NavbarProps {
  user: { username: string; role: string } | null; // Cambiamos el tipo
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const handleLogout = async () => {
    await logout();
    onLogout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {" "}
        <a className="logo" href="http://localhost:8081">
          <img src={logo} alt="Testly" />
          <span>Testly</span>
        </a>
        <div className="nav-actions">
          {!user ? (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-ghost">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </div>
          ) : (
            <div className="dropdown" ref={dropdownRef}>
              <button
                className="btn-profile"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="material-symbols-outlined">
                  account_circle
                </span>
              </button>

              {isOpen && (
                <ul className="dropdown-menu-react">
                  <li className="px-3 py-2 border-bottom border-secondary mb-1">
                    <span className="user-name">Usuario: {user.username}</span>
                  </li>
                  <hr className="dropdown-divider" />

                  {/* LINK DE MI PUNTUACIÓN (Para todos los logueados) */}
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/myscore"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="material-symbols-outlined">
                        emoji_events
                      </span>
                      <span>Mi Puntuación</span>
                    </Link>
                  </li>

                  {/* --- PANEL ADMIN (Solo si es ADMIN) --- */}
                  {user?.role === "ADMIN" && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="material-symbols-outlined">
                          settings
                        </span>
                        <span>Panel Admin</span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <span className="material-symbols-outlined">logout</span>{" "}
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
