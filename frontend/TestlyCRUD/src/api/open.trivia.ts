// src/api/opentrivia.api.ts

export interface TriviaQuestion {
  category: string;
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  // Propiedad extra que añadiremos nosotros para facilitar el renderizado
  all_answers?: string[];
}

export const openTriviaApi = {
  getQuestions: async (
    amount = 10,
    difficulty = "medium",
  ): Promise<TriviaQuestion[]> => {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`,
      );
      const data = await response.json();

      if (data.response_code !== 0) {
        throw new Error("Error al obtener preguntas de OpenTrivia");
      }

      // Procesamos las preguntas para mezclar las respuestas aquí
      return data.results.map((q: TriviaQuestion) => ({
        ...q,
        question: decodeHtml(q.question),
        all_answers: shuffleArray([
          ...q.incorrect_answers,
          q.correct_answer,
        ]).map(decodeHtml),
        correct_answer: decodeHtml(q.correct_answer),
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

// --- UTILIDADES ---

// Decodifica caracteres raros (ej: &quot; -> ")
const decodeHtml = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Algoritmo Fisher-Yates para mezclar respuestas aleatoriamente
const shuffleArray = (array: string[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
