// mongo-init/init-mongo.js

db = db.getSiblingDB('testly_db');

db.preguntas.insertMany([
  {
    "question": "El sol es una estrella.",
    "type": "TRUE_FALSE",
    "options": ["true", "false"],
    "answer": ["true"],
    "category": "astronomía",
    "difficulty": 1
  },
  {
    "question": "La Luna es un planeta.",
    "type": "TRUE_FALSE",
    "options": ["true", "false"],
    "answer": ["false"],
    "category": "astronomía",
    "difficulty": 2
  },
  {
    "question": "La Revolución Francesa empezó en 1789.",
    "type": "TRUE_FALSE",
    "options": ["true", "false"],
    "answer": ["true"],
    "category": "historia",
    "difficulty": 1
  },
  {
    "question": "Napoleón murió en Waterloo.",
    "type": "TRUE_FALSE",
    "options": ["true", "false"],
    "answer": ["false"],
    "category": "historia",
    "difficulty": 2
  },
  {
    "question": "El Amazonas es el río más largo del mundo.",
    "type": "TRUE_FALSE",
    "options": ["true", "false"],
    "answer": ["true"],
    "category": "geografía",
    "difficulty": 1
  },
  {
    "question": "El Monte Everest está en los Alpes.",
    "type": "TRUE_FALSE",
    "options": ["true", "false"],
    "answer": ["false"],
    "category": "geografía",
    "difficulty": 2
  },
  {
    "question": "El agua hierve a 100°C a nivel del mar.",
    "type": "TRUE_FALSE",
    "options": ["true", "false"],
    "answer": ["true"],
    "category": "ciencia",
    "difficulty": 2
  },
  {
    "question": "La gravedad hace que los objetos suban.",
    "type": "TRUE_FALSE",
    "options": ["true", "false"],
    "answer": ["false"],
    "category": "ciencia",
    "difficulty": 1
  },
  {
    "question": "Shakespeare escribió 'Hamlet'.",
    "type": "TRUE_FALSE",
    "options": ["true", "false"],
    "answer": ["true"],
    "category": "literatura",
    "difficulty": 3
  },
  {
    "question": "Cervantes escribió 'La Odisea'.",
    "type": "TRUE_FALSE",
    "options": ["true", "false"],
    "answer": ["false"],
    "category": "literatura",
    "difficulty": 2
  },

  {
    "question": "Capital de Francia",
    "type": "SINGLE_CHOICE",
    "options": ["París", "Roma", "Berlín", "Madrid"],
    "answer": ["París"],
    "category": "geografía",
    "difficulty": 1
  },
  {
    "question": "Planeta más grande del sistema solar",
    "type": "SINGLE_CHOICE",
    "options": ["Marte", "Júpiter", "Saturno", "Neptuno"],
    "answer": ["Júpiter"],
    "category": "astronomía",
    "difficulty": 2
  },
  {
    "question": "Autor de 'Romeo y Julieta'",
    "type": "SINGLE_CHOICE",
    "options": ["William Shakespeare", "Cervantes", "Lope de Vega", "Molière"],
    "answer": ["William Shakespeare"],
    "category": "literatura",
    "difficulty": 3
  },
  {
    "question": "Capital de Estados Unidos",
    "type": "SINGLE_CHOICE",
    "options": ["Washington D.C.", "Nueva York", "Los Ángeles", "Chicago"],
    "answer": ["Washington D.C."],
    "category": "historia",
    "difficulty": 1
  },
  {
    "question": "Fórmula química del agua",
    "type": "SINGLE_CHOICE",
    "options": ["H2O", "CO2", "O2", "H2"],
    "answer": ["H2O"],
    "category": "ciencia",
    "difficulty": 1
  },
  {
    "question": "Pintor de 'La Gioconda'",
    "type": "SINGLE_CHOICE",
    "options": ["Leonardo da Vinci", "Miguel Ángel", "Rafael", "Donatello"],
    "answer": ["Leonardo da Vinci"],
    "category": "arte",
    "difficulty": 2
  },
  {
    "question": "Lenguaje de programación más usado en IA",
    "type": "SINGLE_CHOICE",
    "options": ["Python", "Java", "C++", "JavaScript"],
    "answer": ["Python"],
    "category": "tecnología",
    "difficulty": 1
  },
  {
    "question": "Montaña más alta del mundo",
    "type": "SINGLE_CHOICE",
    "options": ["Monte Everest", "K2", "Kilimanjaro", "Aconcagua"],
    "answer": ["Monte Everest"],
    "category": "geografía",
    "difficulty": 2
  },
  {
    "question": "Autor de la Ley de la Gravitación Universal",
    "type": "SINGLE_CHOICE",
    "options": ["Isaac Newton", "Galileo Galilei", "Einstein", "Kepler"],
    "answer": ["Isaac Newton"],
    "category": "ciencia",
    "difficulty": 3
  },
  {
    "question": "Río más largo de Sudamérica",
    "type": "SINGLE_CHOICE",
    "options": ["Amazonas", "Orinoco", "Paraná", "Magdalena"],
    "answer": ["Amazonas"],
    "category": "geografía",
    "difficulty": 2
  },

  {
    "question": "Planetas del sistema solar",
    "type": "MULTIPLE_CHOICE",
    "options": ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno", "Plutón"],
    "answer": ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"],
    "category": "astronomía",
    "difficulty": 1
  },
  {
    "question": "Lenguajes de programación populares",
    "type": "MULTIPLE_CHOICE",
    "options": ["Python", "JavaScript", "C++", "PHP", "Ruby"],
    "answer": ["Python", "JavaScript", "C++"],
    "category": "tecnología",
    "difficulty": 2
  },
  {
    "question": "Tipos de arte",
    "type": "MULTIPLE_CHOICE",
    "options": ["Pintura", "Escultura", "Música", "Matemáticas"],
    "answer": ["Pintura", "Escultura", "Música"],
    "category": "arte",
    "difficulty": 1
  },
  {
    "question": "Días laborables de la semana",
    "type": "MULTIPLE_CHOICE",
    "options": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    "answer": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    "category": "general",
    "difficulty": 1
  },
  {
    "question": "Colores primarios",
    "type": "MULTIPLE_CHOICE",
    "options": ["Rojo", "Verde", "Azul", "Amarillo"],
    "answer": ["Rojo", "Verde", "Azul"],
    "category": "ciencia",
    "difficulty": 2
  },
  {
    "question": "Países de Sudamérica",
    "type": "MULTIPLE_CHOICE",
    "options": ["Perú", "Brasil", "Argentina", "México", "España"],
    "answer": ["Perú", "Brasil", "Argentina"],
    "category": "geografía",
    "difficulty": 2
  },
  {
    "question": "Lenguajes de programación que usan POO",
    "type": "MULTIPLE_CHOICE",
    "options": ["C#", "Java", "Python", "HTML"],
    "answer": ["C#", "Java", "Python"],
    "category": "tecnología",
    "difficulty": 3
  },
  {
    "question": "Civilizaciones antiguas",
    "type": "MULTIPLE_CHOICE",
    "options": ["Egipto", "Grecia", "Roma", "Canadá"],
    "answer": ["Egipto", "Grecia", "Roma"],
    "category": "historia",
    "difficulty": 2
  },
  {
    "question": "Animales domésticos comunes",
    "type": "MULTIPLE_CHOICE",
    "options": ["Gato", "Perro", "Conejo", "León"],
    "answer": ["Gato", "Perro", "Conejo"],
    "category": "general",
    "difficulty": 1
  },
  {
    "question": "Sistemas operativos más usados",
    "type": "MULTIPLE_CHOICE",
    "options": ["Linux", "Windows", "MacOS", "MS-DOS"],
    "answer": ["Linux", "Windows", "MacOS"],
    "category": "tecnología",
    "difficulty": 2
  }
]);
