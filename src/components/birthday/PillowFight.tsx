import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Timer, Zap } from "lucide-react";

interface Props {
  onNext: (score: number) => void;
}

const PillowFight = ({ onNext }: Props) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [isHit, setIsHit] = useState(false);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && started) {
      onNext(score);
    }
  }, [timeLeft, started, score, onNext]);

  const handleHit = useCallback(() => {
    if (!started) setStarted(true);
    setScore((s) => s + 1);
    setIsHit(true);
    setTimeout(() => setIsHit(false), 100);
  }, [started]);

  return (
    <div className="screen-container bg-love-light">
      <motion.div
        className="wizard-card text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-8 h-8 text-accent" />
          <h2 className="text-2xl font-bold">Pillow Fight! 🛏️</h2>
        </div>

        <p className="text-muted-foreground mb-6">
          {!started
            ? "Tap the pillow as fast as you can! 60 seconds!"
            : "Keep going! Hit harder! 💪"}
        </p>

        <div className="flex justify-between items-center mb-6 px-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Timer className="w-5 h-5 text-destructive" />
            <span className={timeLeft <= 10 ? "text-destructive" : ""}>
              {timeLeft}s
            </span>
          </div>
          <div className="text-lg font-bold text-secondary">
            Score: {score}
          </div>
        </div>

        <motion.button
          onClick={handleHit}
          className="w-40 h-40 sm:w-48 sm:h-48 rounded-full gradient-warm shadow-2xl flex items-center justify-center mx-auto text-6xl sm:text-7xl active:shadow-inner"
          whileTap={{ scale: 0.85 }}
          animate={isHit ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.15 }}
        >
          🛏️
        </motion.button>

        <motion.p
          className="mt-6 text-3xl font-bold text-foreground"
          key={score}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
        >
          {score} hits!
        </motion.p>

        {!started && (
          <p className="text-sm text-muted-foreground mt-4 animate-bounce-soft">
            👆 Tap to start!
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default PillowFight;
