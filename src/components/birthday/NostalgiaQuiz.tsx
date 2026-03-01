import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";
import { quizQuestions } from "@/lib/birthdayData";

interface Props {
  onNext: (answers: string[]) => void;
}

const NostalgiaQuiz = ({ onNext }: Props) => {
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [currentQ, setCurrentQ] = useState(0);
  const [error, setError] = useState("");

  const handleAnswer = () => {
    if (!answers[currentQ].trim()) {
      setError("Come on, don't skip this! 😅");
      return;
    }
    setError("");
    if (currentQ < 4) {
      setCurrentQ(currentQ + 1);
    } else {
      onNext(answers);
    }
  };

  return (
    <div className="screen-container bg-joy-light">
      <motion.div
        className="wizard-card"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-secondary" />
          <h2 className="text-2xl font-bold">Nostalgia Quiz</h2>
        </div>

        <div className="flex gap-1 mb-6">
          {Array(5).fill(0).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${
                i <= currentQ ? "bg-secondary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <motion.div
          key={currentQ}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-4"
        >
          <p className="text-sm font-semibold text-secondary">
            Question {currentQ + 1} of 5
          </p>
          <p className="text-lg font-medium">{quizQuestions[currentQ]}</p>

          <textarea
            value={answers[currentQ]}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[currentQ] = e.target.value;
              setAnswers(newAnswers);
              setError("");
            }}
            placeholder="Type your answer..."
            className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-secondary focus:outline-none min-h-[100px] resize-none transition-all"
          />

          {error && (
            <p className="text-destructive text-sm font-semibold">{error}</p>
          )}

          <motion.button
            onClick={handleAnswer}
            className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-bold text-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentQ < 4 ? "Next" : "Done!"} <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NostalgiaQuiz;
