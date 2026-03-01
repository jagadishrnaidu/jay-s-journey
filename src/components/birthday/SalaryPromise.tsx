import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";

const SalaryPromise = () => {
  useEffect(() => {
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#e8a700", "#3b82f6", "#ef4444", "#22c55e"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#e8a700", "#3b82f6", "#ef4444", "#22c55e"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, []);

  return (
    <div className="screen-container">
      <motion.div
        className="wizard-card text-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 1 }}
      >
        <motion.div
          className="text-7xl mb-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💝
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl font-bold mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          One Last Thing...
        </motion.h2>

        <motion.div
          className="glass-panel space-y-4 text-left"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-lg leading-relaxed">
            This is a small gift for now. 🎁
          </p>
          <p className="text-lg leading-relaxed">
            Very soon I will be joining a job and you will get a{" "}
            <span className="font-bold text-gradient">real gift</span> from my
            salary. 💰
          </p>
          <p className="text-lg leading-relaxed font-semibold">
            That's a promise! 🤞
          </p>
        </motion.div>

        <motion.div
          className="mt-8 flex items-center justify-center gap-2 text-love font-bold text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Heart className="w-6 h-6 fill-current" />
          <span>With all my love, Golu</span>
          <Heart className="w-6 h-6 fill-current" />
        </motion.div>

        <motion.p
          className="text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          🇮🇳 → 🇬🇧 • From your sister, always.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SalaryPromise;
