import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, ChevronLeft, ChevronRight, Flag, Zap, Gauge, Shield } from "lucide-react";

interface Props {
  onNext: (score: number) => void;
}

interface Obstacle {
  id: number;
  lane: number;
  top: number;
  type: string;
}

interface PowerUp {
  id: number;
  lane: number;
  top: number;
  kind: "nitro" | "shield" | "magnet" | "double";
}

interface Collectible {
  id: number;
  lane: number;
  top: number;
}

const LANES = 5;
const LANE_WIDTH = 20;
const OBSTACLE_EMOJIS = ["🚧", "🛢️", "🚗", "🪨", "🔥", "🚛", "🦌"];
const POWERUP_ICONS: Record<string, string> = {
  nitro: "🚀",
  shield: "🛡️",
  magnet: "🧲",
  double: "✖️2",
};

const F1Racer = ({ onNext }: Props) => {
  const [playerLane, setPlayerLane] = useState(2);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [started, setStarted] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [nitroActive, setNitroActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [doubleActive, setDoubleActive] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [nearMiss, setNearMiss] = useState(false);
  const obstacleId = useRef(0);
  const touchStartX = useRef(0);

  const effectiveSpeed = nitroActive ? speed * 1.8 : speed;

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
      setSpeed((s) => Math.min(s + 0.2, 10));
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  // Spawn obstacles + power-ups
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const spawnRate = Math.max(350, 700 - (60 - timeLeft) * 4);
    const spawner = setInterval(() => {
      const emoji = OBSTACLE_EMOJIS[Math.floor(Math.random() * OBSTACLE_EMOJIS.length)];
      // Spawn 1-2 obstacles at a time
      const count = Math.random() < 0.3 ? 2 : 1;
      const usedLanes = new Set<number>();
      for (let i = 0; i < count; i++) {
        let lane: number;
        do { lane = Math.floor(Math.random() * LANES); } while (usedLanes.has(lane));
        usedLanes.add(lane);
        setObstacles((prev) => [
          ...prev,
          { id: obstacleId.current++, lane, top: -10, type: emoji },
        ]);
      }
      // Collectible stars
      if (Math.random() < 0.3) {
        let lane: number;
        do { lane = Math.floor(Math.random() * LANES); } while (usedLanes.has(lane));
        setCollectibles((prev) => [
          ...prev,
          { id: obstacleId.current++, lane, top: -10 },
        ]);
      }
      // Power-ups (rare)
      if (Math.random() < 0.1) {
        const kinds: PowerUp["kind"][] = ["nitro", "shield", "magnet", "double"];
        const kind = kinds[Math.floor(Math.random() * kinds.length)];
        let lane: number;
        do { lane = Math.floor(Math.random() * LANES); } while (usedLanes.has(lane));
        setPowerUps((prev) => [
          ...prev,
          { id: obstacleId.current++, lane, top: -10, kind },
        ]);
      }
    }, spawnRate);
    return () => clearInterval(spawner);
  }, [started, timeLeft]);

  // Move everything + collision
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const mover = setInterval(() => {
      // Move obstacles
      setObstacles((prev) => {
        const updated = prev
          .map((o) => ({ ...o, top: o.top + effectiveSpeed }))
          .filter((o) => o.top < 110);
        
        const hitObstacle = updated.find(
          (o) => o.lane === playerLane && o.top > 75 && o.top < 95
        );
        if (hitObstacle) {
          if (shieldActive) {
            // Shield absorbs hit
          } else {
            setCrashed(true);
            setCombo(0);
            setScreenShake(true);
            setTimeout(() => { setCrashed(false); setScreenShake(false); }, 400);
          }
        }
        
        // Near miss detection
        const nearMissObstacle = updated.find(
          (o) => Math.abs(o.lane - playerLane) === 1 && o.top > 78 && o.top < 92
        );
        if (nearMissObstacle && !hitObstacle) {
          setNearMiss(true);
          setScore((s) => s + (doubleActive ? 4 : 2));
          setCombo((c) => c + 1);
          setTimeout(() => setNearMiss(false), 500);
        }

        const passed = prev.filter((o) => o.top + effectiveSpeed >= 110 && o.lane !== playerLane).length;
        if (passed > 0) {
          const pts = doubleActive ? passed * 2 : passed;
          setScore((s) => s + pts);
          setCombo((c) => c + passed);
        }
        return updated;
      });

      // Move collectibles
      setCollectibles((prev) => {
        const updated = prev
          .map((c) => ({ ...c, top: c.top + effectiveSpeed }))
          .filter((c) => c.top < 110);
        const collected = updated.filter(
          (c) => c.lane === playerLane && c.top > 75 && c.top < 95
        );
        if (collected.length > 0) {
          const pts = doubleActive ? collected.length * 6 : collected.length * 3;
          setScore((s) => s + pts);
          return updated.filter((c) => !collected.includes(c));
        }
        return updated;
      });

      // Move power-ups
      setPowerUps((prev) => {
        const updated = prev
          .map((p) => ({ ...p, top: p.top + effectiveSpeed }))
          .filter((p) => p.top < 110);
        const collected = updated.filter(
          (p) => p.lane === playerLane && p.top > 75 && p.top < 95
        );
        if (collected.length > 0) {
          collected.forEach((p) => {
            switch (p.kind) {
              case "nitro":
                setNitroActive(true);
                setTimeout(() => setNitroActive(false), 3000);
                break;
              case "shield":
                setShieldActive(true);
                setTimeout(() => setShieldActive(false), 4000);
                break;
              case "double":
                setDoubleActive(true);
                setTimeout(() => setDoubleActive(false), 5000);
                break;
              case "magnet":
                setScore((s) => s + 10);
                break;
            }
          });
          return updated.filter((p) => !collected.includes(p));
        }
        return updated;
      });
    }, 70);
    return () => clearInterval(mover);
  }, [started, timeLeft, playerLane, effectiveSpeed, shieldActive, doubleActive]);

  // End game
  useEffect(() => {
    if (timeLeft === 0 && started) onNext(score);
  }, [timeLeft, started, score, onNext]);

  return (
    <div className="screen-container screen-dark">
      <motion.div
        className="w-full max-w-sm mx-auto relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, x: screenShake ? [0, -5, 5, -3, 3, 0] : 0 }}
      >
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="flex items-center gap-2 text-secondary font-bold">
            <Flag className="w-5 h-5" />
            <span>F1 Racer 🏎️</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="glass-badge text-primary font-bold">
              {combo > 5 && <Zap className="w-3 h-3 inline mr-1" />}
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

        {/* Active power-ups display */}
        <div className="flex gap-2 mb-2 px-2 min-h-[28px]">
          <AnimatePresence>
            {nitroActive && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="glass-badge text-xs flex items-center gap-1">
                🚀 NITRO
              </motion.div>
            )}
            {shieldActive && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="glass-badge text-xs flex items-center gap-1">
                🛡️ SHIELD
              </motion.div>
            )}
            {doubleActive && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="glass-badge text-xs flex items-center gap-1">
                ✖️2 DOUBLE
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Speed + combo bar */}
        <div className="glass-panel p-1 mb-2 mx-2 flex gap-2">
          <div className="flex-1">
            <div className="h-1.5 rounded-full overflow-hidden bg-muted/20">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${((speed - 4) / 6) * 100}%`,
                  background: nitroActive
                    ? "linear-gradient(90deg, hsl(45 93% 47%), hsl(0 84% 60%))"
                    : "linear-gradient(90deg, hsl(210 79% 54%), hsl(145 63% 49%))",
                }}
              />
            </div>
          </div>
          {combo > 3 && (
            <motion.span
              className="text-xs font-bold text-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {combo}x COMBO!
            </motion.span>
          )}
        </div>

        {/* Near miss indicator */}
        <AnimatePresence>
          {nearMiss && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-primary font-bold text-sm mb-1"
            >
              ⚡ NEAR MISS! +2
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game area */}
        <div
          className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-secondary/20"
          style={{
            background: nitroActive
              ? "linear-gradient(180deg, hsl(0 60% 10%) 0%, hsl(20 50% 12%) 100%)"
              : "linear-gradient(180deg, hsl(220 30% 8%) 0%, hsl(220 30% 15%) 100%)",
          }}
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const diff = e.changedTouches[0].clientX - touchStartX.current;
            if (diff > 25) moveRight();
            else if (diff < -25) moveLeft();
          }}
        >
          {/* Lane dividers */}
          {Array.from({ length: LANES - 1 }, (_, i) => (
            <div key={i} className="absolute top-0 bottom-0 w-px opacity-15" style={{ left: `${(i + 1) * LANE_WIDTH}%` }}>
              {Array(10).fill(0).map((_, j) => (
                <motion.div
                  key={j}
                  className="w-full h-6 bg-secondary mb-6"
                  animate={{ y: [0, 48] }}
                  transition={{ duration: nitroActive ? 0.2 : 0.5, repeat: Infinity, ease: "linear", delay: j * 0.05 }}
                />
              ))}
            </div>
          ))}

          {/* Speed lines when nitro */}
          {nitroActive && Array(8).fill(0).map((_, i) => (
            <motion.div
              key={`nitro-${i}`}
              className="absolute w-0.5 h-20 bg-primary/20 rounded"
              style={{ left: `${5 + i * 12}%` }}
              animate={{ y: [-80, 500], opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.04 }}
            />
          ))}

          {/* Obstacles */}
          {obstacles.map((o) => (
            <div
              key={o.id}
              className="absolute w-[16%] h-8 rounded-lg flex items-center justify-center text-lg"
              style={{
                left: `${o.lane * LANE_WIDTH + 2}%`,
                top: `${o.top}%`,
                transition: "top 0.07s linear",
                background: "hsl(0 84% 60% / 0.5)",
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
              className="absolute w-[14%] h-7 rounded-full flex items-center justify-center text-lg"
              style={{
                left: `${c.lane * LANE_WIDTH + 3}%`,
                top: `${c.top}%`,
                transition: "top 0.07s linear",
                background: "hsl(45 93% 47% / 0.4)",
                border: "1px solid hsl(45 93% 47% / 0.4)",
              }}
              animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              ⭐
            </motion.div>
          ))}

          {/* Power-ups */}
          {powerUps.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-[16%] h-8 rounded-xl flex items-center justify-center text-base font-bold"
              style={{
                left: `${p.lane * LANE_WIDTH + 2}%`,
                top: `${p.top}%`,
                transition: "top 0.07s linear",
                background: "linear-gradient(135deg, hsl(280 60% 50% / 0.6), hsl(210 79% 54% / 0.6))",
                backdropFilter: "blur(4px)",
                border: "1px solid hsl(280 60% 50% / 0.5)",
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              {POWERUP_ICONS[p.kind]}
            </motion.div>
          ))}

          {/* Player car */}
          <motion.div
            className="absolute bottom-4 w-[16%] h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg"
            style={{
              background: shieldActive
                ? "linear-gradient(135deg, hsl(45 93% 47% / 0.7), hsl(45 80% 40% / 0.7))"
                : "linear-gradient(135deg, hsl(210 79% 54% / 0.7), hsl(210 79% 40% / 0.7))",
              backdropFilter: "blur(8px)",
              border: shieldActive
                ? "2px solid hsl(45 93% 47% / 0.6)"
                : "1px solid hsl(210 79% 54% / 0.4)",
              boxShadow: nitroActive
                ? "0 0 20px hsl(0 84% 60% / 0.5), 0 10px 30px hsl(0 84% 60% / 0.3)"
                : "0 0 10px hsl(210 79% 54% / 0.3)",
            }}
            animate={{
              left: `${playerLane * LANE_WIDTH + 2}%`,
              rotate: crashed ? [0, -20, 20, -10, 0] : 0,
            }}
            transition={crashed
              ? { duration: 0.4 }
              : { type: "spring", stiffness: 500, damping: 30 }
            }
          >
            🏎️
          </motion.div>

          {!started && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
              style={{ background: "hsl(220 30% 8% / 0.8)", backdropFilter: "blur(8px)" }}
            >
              <div className="text-center px-4">
                <p className="text-4xl mb-3">🏁</p>
                <p className="text-secondary font-bold text-xl mb-2">Ready to Race?</p>
                <p className="text-muted-foreground text-sm">Swipe or use ← → arrows</p>
                <p className="text-muted-foreground text-xs mt-2">Collect ⭐ stars & 🚀 power-ups!</p>
              </div>
            </div>
          )}
        </div>

        {/* Touch controls */}
        <div className="flex gap-3 mt-4">
          <motion.button
            onClick={moveLeft}
            className="flex-1 py-4 rounded-xl glass-panel font-bold flex items-center justify-center"
            whileTap={{ scale: 0.85 }}
          >
            <ChevronLeft className="w-8 h-8 text-secondary" />
          </motion.button>
          <motion.button
            onClick={moveRight}
            className="flex-1 py-4 rounded-xl glass-panel font-bold flex items-center justify-center"
            whileTap={{ scale: 0.85 }}
          >
            <ChevronRight className="w-8 h-8 text-secondary" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default F1Racer;
