import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { decode } from "html-entities";

const COLORS = {
  bgDark: "#161616",
  bgCard: "#1f1f1f",
  accent: "#6db33f",
  correct: "#22c55e",
  wrong: "#ef4444",
  textMain: "#ffffff",
  textDim: "#aaaaaa",
  border: "#333333",
};

export default function App() {
  const [gameState, setGameState] = useState("start");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const fadeAnim = useState(new Animated.Value(1))[0];

  // --- Animación transición ---
  const animateNext = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // --- API ---
  const fetchQuestions = async (difficulty) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`,
      );
      const data = await res.json();

      const formatted = data.results.map((q) => {
        const answers = [...q.incorrect_answers, q.correct_answer]
          .map((a) => decode(a))
          .sort(() => Math.random() - 0.5);

        return {
          category: q.category,
          question: decode(q.question),
          correct: decode(q.correct_answer),
          answers,
        };
      });

      setQuestions(formatted);
      setScore(0);
      setCurrentIndex(0);
      setGameState("playing");
    } catch (err) {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // --- Manejar respuesta ---
  const handleAnswer = useCallback(
    (answer) => {
      if (selectedAnswer) return; // evita doble click

      setSelectedAnswer(answer);

      if (answer === questions[currentIndex].correct) {
        setScore((prev) => prev + 1);
      }

      setTimeout(() => {
        setSelectedAnswer(null);
        animateNext();

        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setGameState("finished");
        }
      }, 1000);
    },
    [currentIndex, questions, selectedAnswer],
  );

  // --- START ---
  if (gameState === "start") {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.centered}>
          <Text style={styles.title}>
            Testly <Text style={{ color: COLORS.accent }}>Arcade</Text>
          </Text>
          <Text style={styles.subtitle}>Selecciona dificultad</Text>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.accent} />
          ) : (
            <>
              {["easy", "medium", "hard"].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={styles.button}
                  onPress={() => fetchQuestions(level)}
                >
                  <Text style={styles.buttonText}>{level.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // --- FIN ---
  if (gameState === "finished") {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.centered}>
          <Text style={styles.scoreBig}>{score}/10</Text>
          <Text style={styles.title}>Juego terminado</Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.accent }]}
            onPress={() => setGameState("start")}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>
              REINTENTAR
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- JUEGO ---
  const q = questions[currentIndex];

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.hud}>
          <Text style={styles.hudText}>{currentIndex + 1} / 10</Text>
          <Text style={[styles.hudText, { color: COLORS.accent }]}>
            Score: {score}
          </Text>
        </View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.category}>{q.category}</Text>
          <Text style={styles.question}>{q.question}</Text>

          {q.answers.map((ans, i) => {
            const isCorrect = ans === q.correct;
            const isSelected = ans === selectedAnswer;

            let bg = COLORS.bgCard;

            if (selectedAnswer) {
              if (isCorrect) bg = COLORS.correct;
              else if (isSelected) bg = COLORS.wrong;
            }

            return (
              <TouchableOpacity
                key={i}
                style={[styles.option, { backgroundColor: bg }]}
                onPress={() => handleAnswer(ans)}
                disabled={!!selectedAnswer}
              >
                <Text style={styles.optionText}>{ans}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.bgDark },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  title: { fontSize: 28, fontWeight: "800", color: "#fff", marginBottom: 10 },
  subtitle: { color: COLORS.textDim, marginBottom: 30 },

  button: {
    width: "100%",
    padding: 18,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "700" },

  hud: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  hudText: { color: COLORS.textDim },

  card: {
    backgroundColor: COLORS.bgCard,
    padding: 20,
    borderRadius: 20,
  },

  category: { color: COLORS.accent, marginBottom: 10, fontWeight: "700" },
  question: { color: "#fff", fontSize: 18, marginBottom: 20 },

  option: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  optionText: { color: "#fff" },

  scoreBig: {
    fontSize: 60,
    color: COLORS.accent,
    fontWeight: "900",
    marginBottom: 20,
  },
});
