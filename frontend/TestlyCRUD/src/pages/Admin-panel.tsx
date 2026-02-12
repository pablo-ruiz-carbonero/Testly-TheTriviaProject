import { useState, useEffect } from "react";
import { adminApi } from "../api/admin.api";
import "./Admin-panel.css";
import QuestionsPage from "./QuestionsPageAdmin";

// --- TIPOS ---
interface User {
  id: number;
  username: string;
  role: string;
}

interface LogEntry {
  id: number;
  username: string;
  action: string;
  details: string;
  timestamp: string;
  level?: string;
}

interface AdminPanelProps {
  currentUser: { username: string; role: string } | null;
}

// --- SUB-COMPONENTE: UsersTable con modales CRUD ---
const UsersTable = ({
  users,
  refresh,
}: {
  users: User[];
  refresh: () => void;
}) => {
  const [deleteModal, setDeleteModal] = useState<User | null>(null);
  const [editModal, setEditModal] = useState<User | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    role: "USER",
    password: "",
  });

  // --- HANDLERS ---
  const openDeleteModal = (user: User) => {
    setDeleteModal(user);
    setErrorMessage("");
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await adminApi.deleteUser(deleteModal.id);
      refresh();
      setDeleteModal(null);
    } catch {
      setErrorMessage(
        "Error al eliminar usuario. Puede que tenga datos relacionados.",
      );
    }
  };

  const openEditModal = (user: User) => {
    setEditModal(user);
    setFormData({ username: user.username, role: user.role, password: "" });
    setErrorMessage("");
  };

  const handleEdit = async () => {
    if (!editModal) return;
    try {
      await adminApi.updateUser(editModal.id, {
        username: formData.username,
        role: formData.role,
      });
      refresh();
      setEditModal(null);
    } catch {
      setErrorMessage("Error al actualizar usuario.");
    }
  };

  const openCreateModal = () => {
    setCreateModal(true);
    setFormData({ username: "", role: "USER", password: "" });
    setErrorMessage("");
  };

  const handleCreate = async () => {
    try {
      await adminApi.createUser(formData);
      refresh();
      setCreateModal(false);
    } catch {
      setErrorMessage("Error al crear usuario.");
    }
  };

  if (users.length === 0) {
    return (
      <div>
        <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
          No hay usuarios registrados.
        </p>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className="btn-action btn-create" onClick={openCreateModal}>
            ➕ Crear usuario
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <button className="btn-action btn-create" onClick={openCreateModal}>
          ➕ Crear usuario
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ color: "#666" }}>#{user.id}</td>
                <td>
                  <strong>{user.username}</strong>
                </td>
                <td>
                  <span
                    className={`badge-role ${user.role === "ADMIN" ? "badge-admin" : "badge-user"}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    className="btn-action btn-edit"
                    title="Editar usuario"
                    onClick={() => openEditModal(user)}
                  >
                    ✏️
                  </button>
                  {user.role !== "ADMIN" && (
                    <button
                      className="btn-action btn-delete"
                      title="Eliminar usuario"
                      onClick={() => openDeleteModal(user)}
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE ELIMINACIÓN */}
      {deleteModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que quieres eliminar a{" "}
              <strong>{deleteModal.username}</strong>?<br />
              Esta acción es irreversible.
            </p>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="modal-actions">
              <button
                className="btn-action btn-cancel"
                onClick={() => setDeleteModal(null)}
              >
                Cancelar
              </button>
              <button className="btn-action btn-delete" onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {editModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Editar usuario</h3>
            <label>
              Nombre:
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </label>
            <label>
              Rol:
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="modal-actions">
              <button
                className="btn-action btn-cancel"
                onClick={() => setEditModal(null)}
              >
                Cancelar
              </button>
              <button className="btn-action btn-edit" onClick={handleEdit}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CREACIÓN */}
      {createModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Crear usuario</h3>
            <label>
              Nombre:
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </label>
            <label>
              Contraseña:
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </label>
            <label>
              Rol:
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="modal-actions">
              <button
                className="btn-action btn-cancel"
                onClick={() => setCreateModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-action btn-create" onClick={handleCreate}>
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- LOGS ---
const levelColors: Record<string, string> = {
  INFO: "#6db33f",
  WARNING: "#ffb84c",
  ERROR: "#ff4c4c",
  ADMIN: "#d64db3",
};

const LogsView = ({ logs }: { logs: LogEntry[] }) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "1rem",
      }}
    >
      <button className="btn-action btn-edit" onClick={adminApi.downloadLogs}>
        ⬇ Descargar .log
      </button>
    </div>

    <div className="terminal-window">
      {logs.length === 0 ? (
        <p style={{ color: "#555" }}>_ Esperando actividad del sistema...</p>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="log-entry">
            <span className="log-time">
              [{new Date(log.timestamp).toLocaleTimeString()}]
            </span>
            <span
              className="log-level"
              style={{ color: levelColors[log.level || "INFO"] }}
            >
              [{log.level || "INFO"}]
            </span>
            <span className="log-user">{log.username}</span>
            <span className="log-action">
              {log.action}{" "}
              <span style={{ color: "#666" }}>- {log.details}</span>
            </span>
          </div>
        ))
      )}
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function AdminPanel({ currentUser }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"users" | "logs" | "questions">(
    "users",
  );
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getLogs();
      setLogs(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error cargando logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "logs") {
      fetchLogs();
      const interval = setInterval(fetchLogs, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2 className="admin-title">Panel de Control</h2>
        <div style={{ fontSize: "0.9rem", color: "#666" }}>
          Administrador: <strong>{currentUser?.username}</strong>
        </div>
      </header>

      <nav className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Usuarios
        </button>
        <button
          className={`tab-btn ${activeTab === "logs" ? "active" : ""}`}
          onClick={() => setActiveTab("logs")}
        >
          📠 Logs
        </button>
        <button
          className={`tab-btn ${activeTab === "questions" ? "active" : ""}`}
          onClick={() => setActiveTab("questions")}
        >
          ⚙️ Preguntas
        </button>
      </nav>

      <main className="admin-card">
        {loading && activeTab !== "questions" ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner-border text-primary" role="status" />
            <p style={{ marginTop: "1rem" }}>Cargando datos...</p>
          </div>
        ) : (
          <>
            {activeTab === "users" && (
              <UsersTable users={users} refresh={fetchUsers} />
            )}
            {activeTab === "logs" && <LogsView logs={logs} />}
            {activeTab === "questions" && (
              <QuestionsPage currentUser={currentUser} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
