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

function App() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null,
  );

  const checkSession = async () => {
    try {
      const data = await getCurrentUser();
      if (data.authenticated) {
        // Guardamos tanto nombre como rol
        setUser({ username: data.username || "", role: data.role || "" });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);
  return (
    <>
      {/* NAVBAR */}
      <Navbar user={user} onLogout={() => setUser(null)} />

      <main>
        {/* DEFINICIÓN DE RUTAS */}
        <Routes>
          <Route
            path="/"
            element={
              <section className="hero">
                {/* Pasamos checkSession para recargar usuario si hace falta */}
                <QuestionsPage />
              </section>
            }
          />
          <Route
            path="/login"
            element={
              <Login onLoginSuccess={checkSession} /> // <--- Pasa la función real aquí
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/myscore" element={<MyScore />} />
        </Routes>
      </main>

      {/* FOOTER */}
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
