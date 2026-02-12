import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  user: { username: string; role: string } | null;
  allowedRoles?: string[]; // Opcional: lista de roles permitidos
  redirectPath?: string;
  isLoading: boolean; // Importante para no expulsar al usuario mientras carga
}

export const ProtectedRoute = ({
  user,
  allowedRoles,
  redirectPath = "/login",
  isLoading,
}: ProtectedRouteProps) => {
  // 1. Si todavía está comprobando la sesión, mostramos nada (o un spinner)
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // 2. Si ya cargó y NO hay usuario, al login
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // 3. Si hay usuario pero su rol NO está en la lista permitida, al home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 4. Si pasa todo, renderiza la ruta hija (AdminPanel o MyScore)
  return <Outlet />;
};
