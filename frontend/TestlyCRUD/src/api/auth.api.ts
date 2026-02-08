import api from "./api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  role: string;
  success: boolean;
  message?: string;
  username?: string;
  authenticated?: boolean;
}

/**
 * Registrar nuevo usuario
 * Endpoint: POST http://localhost:8081/auth/register
 */
export const register = async (
  credentials: RegisterCredentials,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", credentials);
  return response.data;
};

/**
 * Iniciar sesión
 * Endpoint: POST http://localhost:8081/auth/login
 * IMPORTANTE: Spring Security requiere x-www-form-urlencoded por defecto
 */
export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  const response = await api.post<AuthResponse>("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

/**
 * Cerrar sesión
 * Endpoint: POST http://localhost:8081/auth/logout
 */
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

/**
 * Obtener estado de la sesión actual
 * Endpoint: GET http://localhost:8081/auth/me
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>("/auth/me");
  return response.data;
};
