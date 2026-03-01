import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Timer, ChevronLeft, ChevronRight, Flag } from "lucide-react";

interface Props {
  onNext: (score: number) => void;
}

interface Obstacle {
  id: number;
  lane: number;
  top: number;
}

const LANES = 3;
const LANE_WIDTH = 33.33;

const F1Racer = ({ onNext }: Props) => {
  const [playerLane, setPlayerLane] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const obstacleId = useRef(0);
  const gameRef = useRef<HTMLDivElement>(null);

  // Touch controls
  const touchStartX = useRef(0);

  const moveLeft = useCallback(() => {
    setPlayerLane((l) => Math.max(0, l - 1));
    if (!started) setStarted(true);
  }, [started]);

  const moveRight = useCallback(() => {
    setPlayerLane((l) => Math.min(LANES - 1, l + 1));
    if (!started) setStarted(true);
  }, [started]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [moveLeft, moveRight]);

  // Timer
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  // Spawn obstacles
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const spawner = setInterval(() => {
      setObstacles((prev) => [
        ...prev,
        { id: obstacleId.current++, lane: Math.floor(Math.random() * LANES), top: -10 },
      ]);
    }, 800);
    return () => clearInterval(spawner);
  }, [started, timeLeft]);

  // Move obstacles
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const mover = setInterval(() => {
      setObstacles((prev) => {
        const updated = prev
          .map((o) => ({ ...o, top: o.top + 5 }))
          .filter((o) => o.top < 110);
        // Score for passed obstacles
        const passed = prev.filter((o) => o.top + 5 >= 110).length;
        if (passed > 0) setScore((s) => s + passed);
        return updated;
      });
    }, 100);
    return () => clearInterval(mover);
  }, [started, timeLeft]);

  // End game
  useEffect(() => {
    if (timeLeft === 0 && started) onNext(score);
  }, [timeLeft, started, score, onNext]);

  return (
    <div className="screen-container bg-foreground">
      <motion.div
        className="w-full max-w-sm mx-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="flex items-center gap-2 text-background font-bold">
            <Flag className="w-5 h-5" />
            <span>F1 Racer 🏎️</span>
          </div>
          <div className="flex items-center gap-4 text-background">
            <span className="font-bold">Score: {score}</span>
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4 text-destructive" />
              <span className={timeLeft <= 10 ? "text-destructive font-bold" : "font-bold"}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Game area */}
        <div
          ref={gameRef}
          className="relative w-full h-[400px] bg-muted/10 rounded-2xl overflow-hidden border-2 border-muted/30"
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const diff = e.changedTouches[0].clientX - touchStartX.current;
            if (diff > 30) moveRight();
            else if (diff < -30) moveLeft();
          }}
        >
          {/* Lane dividers */}
          {[1, 2].map((i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-0.5 bg-muted/20"
              style={{ left: `${i * LANE_WIDTH}%` }}
            />
          ))}

          {/* Obstacles */}
          {obstacles.map((o) => (
            <div
              key={o.id}
              className="absolute w-[28%] h-8 bg-destructive rounded-lg flex items-center justify-center text-sm"
              style={{
                left: `${o.lane * LANE_WIDTH + 2.5}%`,
                top: `${o.top}%`,
                transition: "top 0.1s linear",
              }}
            >
              🚧
            </div>
          ))}

          {/* Player car */}
          <motion.div
            className="absolute bottom-4 w-[28%] h-12 bg-secondary rounded-lg flex items-center justify-center text-2xl shadow-lg"
            animate={{ left: `${playerLane * LANE_WIDTH + 2.5}%` }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            🏎️
          </motion.div>

          {!started && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60 rounded-2xl">
              <p className="text-background font-bold text-xl text-center px-4">
                Swipe or use ← → arrows to start!
              </p>
            </div>
          )}
        </div>

        {/* Touch controls */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={moveLeft}
            className="flex-1 py-4 rounded-xl bg-muted/20 border border-muted/30 text-background font-bold flex items-center justify-center"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={moveRight}
            className="flex-1 py-4 rounded-xl bg-muted/20 border border-muted/30 text-background font-bold flex items-center justify-center"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default F1Racer;
