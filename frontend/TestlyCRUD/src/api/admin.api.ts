import api from "./api"; // Tu instancia de axios configurada

export const adminApi = {
  // ==================== USUARIOS ====================

  // Obtener todos los usuarios
  getUsers: async () => {
    const response = await api.get("/api/admin/users");
    return response.data; // Devuelve un array de UserDTO
  },

  // Obtener un usuario por ID
  getUser: async (id: number) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data; // Devuelve un UserDTO
  },

  // Crear un nuevo usuario
  createUser: async (user: {
    username: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post("/api/admin/users", user);
    return response.data; // Devuelve el UserDTO creado
  },

  // Actualizar un usuario existente
  updateUser: async (
    id: number,
    user: { username?: string; role?: string },
  ) => {
    const response = await api.put(`/api/admin/users/${id}`, user);
    return response.data; // Devuelve el UserDTO actualizado
  },

  // Eliminar un usuario
  deleteUser: async (id: number) => {
    await api.delete(`/api/admin/users/${id}`);
  },

  // ==================== LOGS ====================

  // Crear un log
  addLog: async (username: string, action: string, details?: string) => {
    const response = await api.post(
      `/api/admin/add?username=${username}&action=${action}&details=${details ?? ""}`,
    );
    return response.data; // "Log registrado correctamente"
  },

  // Obtener logs del sistema
  getLogs: async () => {
    const response = await api.get("/api/admin/all"); // CORRECTO: /all
    return response.data; // Devuelve un array de UserLog
  },

  // Descargar logs como archivo .log (si agregas endpoint para eso)
  downloadLogs: () => {
    window.open("http://localhost:8081/api/admin/downloadLogs", "_blank");
  },
};
