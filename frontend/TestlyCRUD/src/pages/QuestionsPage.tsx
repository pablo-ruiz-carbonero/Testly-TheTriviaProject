import TrueFalseForm from "../components/questions/TrueFalseForm";
import SingleChoiceForm from "../components/questions/SingleChoiceForm";
import MultipleChoiceForm from "../components/questions/MultipleChoiceForm";
import { useState } from "react";

export default function QuestionsPage() {
  const [selector, setSelector] = useState<string>();

  let content;

  switch (selector) {
    case "1":
      content = <TrueFalseForm />;
      break;
    case "2":
      content = <SingleChoiceForm />;
      break;
    case "3":
      content = <MultipleChoiceForm />;
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
