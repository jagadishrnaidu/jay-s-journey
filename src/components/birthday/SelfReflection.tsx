import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChevronRight } from "lucide-react";
import { goalQuestions } from "@/lib/birthdayData";

interface Props {
  onNext: (goals: string[]) => void;
}

const SelfReflection = ({ onNext }: Props) => {
  const [goals, setGoals] = useState<string[]>(Array(5).fill(""));
  const [currentQ, setCurrentQ] = useState(0);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (goals[currentQ].trim().length < 50) {
      setError("Explain yourself better, bro! (min 50 characters) 📝");
      return;
    }
    setError("");
    if (currentQ < 4) {
      setCurrentQ(currentQ + 1);
    } else {
      onNext(goals);
    }
  };

  const charCount = goals[currentQ].length;

  return (
    <div className="screen-container">
      <motion.div
        className="wizard-card"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-fun" />
          <h2 className="text-2xl font-bold">Deep Dive 🤔</h2>
        </div>

        <div className="flex gap-1 mb-6">
          {Array(5).fill(0).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${
                i <= currentQ ? "bg-fun" : "bg-muted/30"
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
          <p className="glass-badge text-fun inline-block">
            Question {currentQ + 1} of 5
          </p>
          <p className="text-lg font-medium">{goalQuestions[currentQ]}</p>

          <div className="relative">
            <textarea
              value={goals[currentQ]}
              onChange={(e) => {
                const newGoals = [...goals];
                newGoals[currentQ] = e.target.value;
                setGoals(newGoals);
                setError("");
              }}
              placeholder="Share your thoughts (min 50 characters)..."
              className="glass-input min-h-[120px] resize-none"
            />
            <span
              className={`absolute bottom-3 right-3 text-xs font-semibold ${
                charCount >= 50 ? "text-fun" : "text-muted-foreground"
              }`}
            >
              {charCount}/50
            </span>
          </div>

          {error && (
            <p className="text-destructive text-sm font-semibold">{error}</p>
          )}

          <motion.button
            onClick={handleNext}
            className="glass-button"
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

export default SelfReflection;
