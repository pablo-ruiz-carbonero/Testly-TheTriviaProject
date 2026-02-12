import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import QuestionsPage from "./pages/QuestionsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getCurrentUser } from "./api/auth.api";
import "./App.css";
import Navbar from "./components/NavBar";
import MyScore from "./pages/MyScore";
import AdminPanel from "./pages/Admin-panel";
// IMPORTA EL COMPONENTE NUEVO
import { ProtectedRoute } from "./components/ProtectedRouteProps";
import OpenTriviaPage from "./pages/OpenTrivia";

function App() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null,
  );
  // NUEVO ESTADO: Para saber si estamos comprobando la sesión
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    try {
      const data = await getCurrentUser();
      if (data.authenticated) {
        setUser({ username: data.username || "", role: data.role || "" });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <>
      <Navbar user={user} onLogout={() => setUser(null)} />

      <main>
        <Routes>
          {/* Rutas PÚBLICAS */}
          <Route
            path="/"
            element={
              <section className="hero">
                <QuestionsPage currentUser={user} />
              </section>
            }
          />
          <Route
            path="/login"
            element={<Login onLoginSuccess={checkSession} />}
          />
          <Route path="/register" element={<Register />} />

          {/* --- RUTAS PROTEGIDAS --- */}

          {/* A. Solo para ADMIN (añade 'ROLE_ADMIN' por si acaso Spring lo devuelve así) */}
          <Route
            element={
              <ProtectedRoute
                user={user}
                isLoading={isLoading}
                allowedRoles={["ADMIN", "ROLE_ADMIN"]}
              />
            }
          >
            <Route path="/admin" element={<AdminPanel currentUser={user} />} />
          </Route>

          {/* B. Para usuarios logueados (USER o ADMIN) */}
          <Route element={<ProtectedRoute user={user} isLoading={isLoading} />}>
            <Route path="/myscore" element={<MyScore currentUser={user} />} />
          </Route>
          <Route path="/arcade" element={<OpenTriviaPage />} />
        </Routes>
      </main>

      <footer className="text-center mt-5">
        <p>&copy; 2024 Testly. Todos los derechos reservados.</p>
        <div className="mt-2">
          <Link to="#" className="mx-2">
            Privacidad
          </Link>
          <Link to="#" className="mx-2">
            Términos
          </Link>
        </div>
      </footer>
    </>
  );
}

export default App;
