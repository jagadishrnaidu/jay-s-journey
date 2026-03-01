import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Heart } from "lucide-react";
import { hangarooWords } from "@/lib/birthdayData";

interface Props {
  onNext: (score: number) => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_WRONG = 6;

const KANGAROO_STAGES = [
  "🦘", // 0 wrong - happy
  "😰", // 1
  "😥", // 2
  "😫", // 3
  "😵", // 4
  "💀", // 5
  "☠️", // 6 - dead
];

const Hangaroo = ({ onNext }: Props) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [started, setStarted] = useState(false);
  const [roundResult, setRoundResult] = useState<"won" | "lost" | null>(null);

  const currentWord = hangarooWords[wordIndex % hangarooWords.length];

  const isWordComplete = currentWord
    .split("")
    .every((letter) => guessedLetters.has(letter));

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && started) onNext(score);
  }, [timeLeft, started, score, onNext]);

  useEffect(() => {
    if (isWordComplete && started) {
      setRoundResult("won");
      setScore((s) => s + 1);
      setTimeout(nextWord, 1200);
    }
  }, [isWordComplete, started]);

  useEffect(() => {
    if (wrongCount >= MAX_WRONG && started) {
      setRoundResult("lost");
      setTimeout(nextWord, 1200);
    }
  }, [wrongCount, started]);

  const nextWord = useCallback(() => {
    setWordIndex((i) => i + 1);
    setGuessedLetters(new Set());
    setWrongCount(0);
    setRoundResult(null);
  }, []);

  const handleGuess = (letter: string) => {
    if (!started) setStarted(true);
    if (guessedLetters.has(letter) || roundResult) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!currentWord.includes(letter)) {
      setWrongCount((w) => w + 1);
    }
  };

  const lives = MAX_WRONG - wrongCount;

  return (
    <div className="screen-container">
      <motion.div
        className="wizard-card text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold mb-2">🦘 Hangaroo!</h2>
        <p className="text-muted-foreground text-sm mb-4">
          {!started ? "Guess the word! Tap a letter to start." : "Guess the hidden word!"}
        </p>

        {/* Stats bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1 font-bold text-sm">
            <Timer className="w-4 h-4 text-destructive" />
            <span className={timeLeft <= 10 ? "text-destructive" : ""}>{timeLeft}s</span>
          </div>
          <div className="glass-badge">Score: {score}</div>
          <div className="flex gap-0.5">
            {Array(MAX_WRONG).fill(0).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-all ${
                  i < lives ? "text-love fill-love" : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Kangaroo */}
        <motion.div
          className="text-6xl my-4"
          animate={wrongCount > 0 ? { x: [0, -5, 5, 0] } : { y: [0, -8, 0] }}
          transition={{ duration: wrongCount > 0 ? 0.3 : 2, repeat: wrongCount > 0 ? 0 : Infinity }}
          key={wrongCount}
        >
          {KANGAROO_STAGES[Math.min(wrongCount, 6)]}
        </motion.div>

        {/* Word blanks */}
        <div className="flex justify-center gap-2 my-6 flex-wrap">
          {currentWord.split("").map((letter, i) => (
            <motion.div
              key={i}
              className="w-10 h-12 rounded-lg flex items-center justify-center text-xl font-bold glass-panel"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <AnimatePresence mode="wait">
                {guessedLetters.has(letter) || roundResult === "lost" ? (
                  <motion.span
                    key="letter"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={roundResult === "lost" && !guessedLetters.has(letter)
                      ? "text-destructive"
                      : "text-foreground"
                    }
                  >
                    {letter}
                  </motion.span>
                ) : (
                  <span className="text-muted-foreground/30">_</span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Round result */}
        <AnimatePresence>
          {roundResult && (
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-xl font-bold mb-3 ${
                roundResult === "won" ? "text-fun" : "text-destructive"
              }`}
            >
              {roundResult === "won" ? "🎉 Got it!" : `😅 It was: ${currentWord}`}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Keyboard */}
        <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
          {ALPHABET.map((letter) => {
            const isGuessed = guessedLetters.has(letter);
            const isCorrect = isGuessed && currentWord.includes(letter);
            const isWrong = isGuessed && !currentWord.includes(letter);

            return (
              <motion.button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed || !!roundResult}
                className={`h-9 sm:h-10 rounded-lg text-sm font-bold transition-all ${
                  isCorrect
                    ? "bg-fun/80 text-accent-foreground"
                    : isWrong
                    ? "bg-destructive/40 text-destructive-foreground/50"
                    : "glass-panel hover:bg-primary/20"
                } ${isGuessed ? "opacity-60" : ""}`}
                whileTap={!isGuessed ? { scale: 0.85 } : undefined}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Hangaroo;
