import api from "./api";
import type { Question } from "../types/Question";

// GET: Obtener todas las preguntas paginadas
export const getAllQuestions = (page: number = 0) => {
  // AÑADIDO /api AL INICIO
  return api.get(`/api/questions?page=${page}`);
};

// GET: Obtener preguntas por tipo
export const getQuestionsByType = (
  type: string,
  page: number = 0,
  search: string = "",
  category: string = "",
) => {
  // Pasamos los parámetros en la URL
  return api.get(`/api/questions/type/${type}`, {
    params: {
      page: page,
      search: search,
      category: category === "Todas" ? "" : category,
    },
  });
};

// POST: Crear nueva pregunta
export const createQuestion = (question: Omit<Question, "id">) =>
  api.post<Question>("/api/questions", question);

// DELETE: Eliminar pregunta
export const deleteQuestion = (id: string) =>
  api.delete(`/api/questions/${id}`);

// PUT: Actualizar pregunta
export const updateQuestion = (id: string, question: Question) =>
  api.put(`/api/questions/${id}`, question);
