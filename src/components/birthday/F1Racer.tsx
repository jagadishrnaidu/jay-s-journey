import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Timer, ChevronLeft, ChevronRight, Flag, Zap } from "lucide-react";

interface Props {
  onNext: (score: number) => void;
}

interface Obstacle {
  id: number;
  lane: number;
  top: number;
  type: string;
}

interface Collectible {
  id: number;
  lane: number;
  top: number;
}

const LANES = 3;
const LANE_WIDTH = 33.33;
const OBSTACLE_EMOJIS = ["🚧", "🛢️", "🚗", "🪨", "🔥"];

const F1Racer = ({ onNext }: Props) => {
  const [playerLane, setPlayerLane] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [started, setStarted] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [speed, setSpeed] = useState(5);
  const obstacleId = useRef(0);
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

  // Timer + speed increase
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
      // Increase speed every 10 seconds
      setSpeed((s) => Math.min(s + 0.3, 12));
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  // Spawn obstacles
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const spawnRate = Math.max(400, 800 - (60 - timeLeft) * 5);
    const spawner = setInterval(() => {
      const emoji = OBSTACLE_EMOJIS[Math.floor(Math.random() * OBSTACLE_EMOJIS.length)];
      setObstacles((prev) => [
        ...prev,
        { id: obstacleId.current++, lane: Math.floor(Math.random() * LANES), top: -10, type: emoji },
      ]);
      // Occasionally spawn collectible
      if (Math.random() < 0.25) {
        setCollectibles((prev) => [
          ...prev,
          { id: obstacleId.current++, lane: Math.floor(Math.random() * LANES), top: -10 },
        ]);
      }
    }, spawnRate);
    return () => clearInterval(spawner);
  }, [started, timeLeft]);

  // Move obstacles + collision
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const mover = setInterval(() => {
      setObstacles((prev) => {
        const updated = prev
          .map((o) => ({ ...o, top: o.top + speed }))
          .filter((o) => o.top < 110);
        // Collision check
        const hitObstacle = updated.find(
          (o) => o.lane === playerLane && o.top > 78 && o.top < 95
        );
        if (hitObstacle) {
          setCrashed(true);
          setCombo(0);
          setTimeout(() => setCrashed(false), 300);
        }
        const passed = prev.filter((o) => o.top + speed >= 110 && o.lane !== playerLane).length;
        if (passed > 0) {
          setScore((s) => s + passed);
          setCombo((c) => c + passed);
        }
        return updated;
      });
      // Move collectibles
      setCollectibles((prev) => {
        const updated = prev
          .map((c) => ({ ...c, top: c.top + speed }))
          .filter((c) => c.top < 110);
        const collected = updated.filter(
          (c) => c.lane === playerLane && c.top > 78 && c.top < 95
        );
        if (collected.length > 0) {
          setScore((s) => s + collected.length * 3);
          return updated.filter((c) => !collected.includes(c));
        }
        return updated;
      });
    }, 80);
    return () => clearInterval(mover);
  }, [started, timeLeft, playerLane, speed]);

  // End game
  useEffect(() => {
    if (timeLeft === 0 && started) onNext(score);
  }, [timeLeft, started, score, onNext]);

  return (
    <div className="screen-container screen-dark">
      <motion.div
        className="w-full max-w-sm mx-auto relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="flex items-center gap-2 text-secondary font-bold">
            <Flag className="w-5 h-5" />
            <span>F1 Racer 🏎️</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="glass-badge text-primary font-bold">
              {combo > 3 && <Zap className="w-3 h-3 inline mr-1" />}
              {score}
            </span>
            <div className="flex items-center gap-1">
              <Timer className={`w-4 h-4 ${timeLeft <= 10 ? "text-destructive" : "text-secondary"}`} />
              <span className={`font-bold ${timeLeft <= 10 ? "text-destructive" : "text-secondary"}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Speed indicator */}
        <div className="glass-panel p-1 mb-2 mx-2">
          <div className="h-1.5 rounded-full overflow-hidden bg-muted/20">
            <motion.div
              className="h-full bg-gradient-to-r from-fun to-destructive rounded-full"
              style={{ width: `${((speed - 5) / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Game area */}
        <div
          className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-secondary/20"
          style={{
            background: "linear-gradient(180deg, hsl(220 30% 8%) 0%, hsl(220 30% 15%) 100%)",
          }}
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const diff = e.changedTouches[0].clientX - touchStartX.current;
            if (diff > 30) moveRight();
            else if (diff < -30) moveLeft();
          }}
        >
          {/* Road markings */}
          {[1, 2].map((i) => (
            <div key={i} className="absolute top-0 bottom-0 w-px opacity-20" style={{ left: `${i * LANE_WIDTH}%` }}>
              {Array(8).fill(0).map((_, j) => (
                <motion.div
                  key={j}
                  className="w-full h-8 bg-secondary mb-8"
                  animate={{ y: [0, 64] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear", delay: j * 0.06 }}
                />
              ))}
            </div>
          ))}

          {/* Speed lines */}
          {speed > 7 && Array(4).fill(0).map((_, i) => (
            <motion.div
              key={`speed-${i}`}
              className="absolute w-0.5 h-16 bg-secondary/10 rounded"
              style={{ left: `${15 + i * 22}%` }}
              animate={{ y: [-64, 500], opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}

          {/* Obstacles */}
          {obstacles.map((o) => (
            <div
              key={o.id}
              className="absolute w-[28%] h-8 rounded-lg flex items-center justify-center text-lg"
              style={{
                left: `${o.lane * LANE_WIDTH + 2.5}%`,
                top: `${o.top}%`,
                transition: "top 0.08s linear",
                background: "hsl(0 84% 60% / 0.6)",
                backdropFilter: "blur(4px)",
                border: "1px solid hsl(0 84% 60% / 0.3)",
              }}
            >
              {o.type}
            </div>
          ))}

          {/* Collectibles */}
          {collectibles.map((c) => (
            <motion.div
              key={c.id}
              className="absolute w-[20%] h-7 rounded-full flex items-center justify-center text-lg"
              style={{
                left: `${c.lane * LANE_WIDTH + 6}%`,
                top: `${c.top}%`,
                transition: "top 0.08s linear",
                background: "hsl(45 93% 47% / 0.5)",
                border: "1px solid hsl(45 93% 47% / 0.4)",
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ⭐
            </motion.div>
          ))}

          {/* Player car */}
          <motion.div
            className="absolute bottom-4 w-[28%] h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, hsl(210 79% 54% / 0.7), hsl(210 79% 40% / 0.7))",
              backdropFilter: "blur(8px)",
              border: "1px solid hsl(210 79% 54% / 0.4)",
            }}
            animate={{
              left: `${playerLane * LANE_WIDTH + 2.5}%`,
              rotate: crashed ? [0, -15, 15, 0] : 0,
            }}
            transition={crashed
              ? { duration: 0.3 }
              : { type: "spring", stiffness: 500, damping: 30 }
            }
          >
            🏎️
          </motion.div>

          {!started && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
              style={{ background: "hsl(220 30% 8% / 0.7)", backdropFilter: "blur(8px)" }}
            >
              <p className="text-secondary font-bold text-xl text-center px-4">
                Swipe or use ← → to start! 🏁
              </p>
            </div>
          )}
        </div>

        {/* Touch controls */}
        <div className="flex gap-3 mt-4">
          <motion.button
            onClick={moveLeft}
            className="flex-1 py-4 rounded-xl glass-panel font-bold flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-8 h-8 text-secondary" />
          </motion.button>
          <motion.button
            onClick={moveRight}
            className="flex-1 py-4 rounded-xl glass-panel font-bold flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-8 h-8 text-secondary" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default F1Racer;
