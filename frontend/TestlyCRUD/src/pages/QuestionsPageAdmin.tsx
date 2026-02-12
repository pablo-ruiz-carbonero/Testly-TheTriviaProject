import TrueFalseForm from "../components/questions-admin/TrueFalseForm";
import SingleChoiceForm from "../components/questions-admin/SingleChoiceForm";
import MultipleChoiceForm from "../components/questions-admin/MultipleChoiceForm";
import { useState } from "react";

interface QuestionsPageProps {
  currentUser: { username: string; role: string } | null;
}

export default function QuestionsPage({ currentUser }: QuestionsPageProps) {
  const [selector, setSelector] = useState<string>();

  let content;

  switch (selector) {
    case "1":
      content = <TrueFalseForm currentUser={currentUser} />;
      break;
    case "2":
      content = <SingleChoiceForm currentUser={currentUser} />;
      break;
    case "3":
      content = <MultipleChoiceForm currentUser={currentUser} />;
      break;
    default:
      content = null;
  }

  return (
    <div className="questions-container">
      <h2>Gestiona tus preguntas</h2>
      <p className="questions-subtitle">
        Selecciona el tipo de pregunta que deseas crear
      </p>

      <div className="selector-wrapper">
        <select
          value={selector || ""}
          onChange={(e) => setSelector(e.target.value || undefined)}
        >
          <option value="">Selecciona un tipo de pregunta</option>
          <option value="1">Verdadero / Falso</option>
          <option value="2">Una sola respuesta</option>
          <option value="3">Múltiples opciones</option>
        </select>
      </div>

      {content && <div className="form-content">{content}</div>}
    </div>
  );
}
