import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Zap } from "lucide-react";

interface Props {
  onNext: (score: number) => void;
}

const COLORS = ["red", "blue", "green", "yellow"] as const;
const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type UnoCard = { color: (typeof COLORS)[number]; number: number };

const colorClasses: Record<string, string> = {
  red: "bg-destructive text-destructive-foreground",
  blue: "bg-secondary text-secondary-foreground",
  green: "bg-fun text-accent-foreground",
  yellow: "bg-primary text-primary-foreground",
};

const colorBorders: Record<string, string> = {
  red: "border-destructive",
  blue: "border-secondary",
  green: "border-fun",
  yellow: "border-primary",
};

function randomCard(): UnoCard {
  return {
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    number: NUMBERS[Math.floor(Math.random() * NUMBERS.length)],
  };
}

function generateHand(target: UnoCard): UnoCard[] {
  const hand: UnoCard[] = [];
  // One correct card
  const correctType = Math.random() > 0.5 ? "color" : "number";
  if (correctType === "color") {
    let num = target.number;
    while (num === target.number) num = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    hand.push({ color: target.color, number: num });
  } else {
    let col = target.color;
    while (col === target.color) col = COLORS[Math.floor(Math.random() * COLORS.length)];
    hand.push({ color: col, number: target.number });
  }
  // Three wrong cards
  while (hand.length < 4) {
    const card = randomCard();
    if (card.color !== target.color && card.number !== target.number) {
      hand.push(card);
    }
  }
  // Shuffle
  return hand.sort(() => Math.random() - 0.5);
}

const SpeedUno = ({ onNext }: Props) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [target, setTarget] = useState<UnoCard>(randomCard());
  const [hand, setHand] = useState<UnoCard[]>(generateHand(target));
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [roundTimer, setRoundTimer] = useState(2);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setRoundTimer((t) => {
        if (t <= 0) {
          nextRound();
          return 2;
        }
        return t - 0.1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [started, timeLeft, target]);

  useEffect(() => {
    if (timeLeft === 0 && started) onNext(score);
  }, [timeLeft, started, score, onNext]);

  const nextRound = useCallback(() => {
    const newTarget = randomCard();
    setTarget(newTarget);
    setHand(generateHand(newTarget));
    setRoundTimer(2);
    setFeedback(null);
  }, []);

  const handleCardClick = (card: UnoCard) => {
    if (!started) setStarted(true);
    const isMatch = card.color === target.color || card.number === target.number;
    if (isMatch) {
      setScore((s) => s + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(nextRound, 300);
  };

  return (
    <div className="screen-container bg-joy-light">
      <motion.div
        className="wizard-card text-center"
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-8 h-8 text-secondary" />
          <h2 className="text-2xl font-bold">Speed Uno! 🃏</h2>
        </div>

        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2 font-bold">
            <Timer className="w-5 h-5 text-destructive" />
            <span className={timeLeft <= 10 ? "text-destructive" : ""}>{timeLeft}s</span>
          </div>
          <div className="font-bold text-secondary">Score: {score}</div>
        </div>

        {/* Round timer bar */}
        <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-secondary rounded-full"
            style={{ width: `${(roundTimer / 2) * 100}%` }}
          />
        </div>

        {/* Target card */}
        <p className="text-sm font-semibold text-muted-foreground mb-2">Match this card:</p>
        <motion.div
          key={`${target.color}-${target.number}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-24 h-36 rounded-xl ${colorClasses[target.color]} flex items-center justify-center mx-auto mb-6 text-4xl font-bold shadow-lg border-4 ${colorBorders[target.color]}`}
        >
          {target.number}
        </motion.div>

        {/* Player hand */}
        <p className="text-sm text-muted-foreground mb-3">
          {!started ? "Tap a matching card to start!" : "Quick! Match color OR number!"}
        </p>

        <div className="grid grid-cols-4 gap-2">
          <AnimatePresence mode="popLayout">
            {hand.map((card, i) => (
              <motion.button
                key={`${card.color}-${card.number}-${i}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleCardClick(card)}
                className={`h-24 rounded-xl ${colorClasses[card.color]} flex items-center justify-center text-2xl font-bold shadow-md border-2 ${colorBorders[card.color]} active:scale-90 transition-transform`}
              >
                {card.number}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`mt-4 text-xl font-bold ${
                feedback === "correct" ? "text-fun" : "text-destructive"
              }`}
            >
              {feedback === "correct" ? "✅ Nice!" : "❌ Wrong!"}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SpeedUno;
