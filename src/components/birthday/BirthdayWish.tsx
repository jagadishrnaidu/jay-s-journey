import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Gift, Sparkles } from "lucide-react";

interface Props {
  onNext: () => void;
}

const messages = [
  "You know what, Bhaiya?",
  "You're not just my brother...",
  "You're my hero. 🦸‍♂️",
  "The one who always stood by me.",
  "From our silly fights to late-night talks...",
  "Every moment with you is a treasure. 💎",
  "You moved to UK, but you never left my heart. ❤️",
  "I look up to you. I always will. 🌟",
  "Happy Birthday, my champion! 🏆🎂",
];

const BirthdayWish = ({ onNext }: Props) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (visibleIndex < messages.length - 1) {
      const timer = setTimeout(() => setVisibleIndex((i) => i + 1), 1800);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setShowAll(true), 1000);
    }
  }, [visibleIndex]);

  return (
    <div className="screen-container">
      {/* Floating emojis background */}
      {["🎈", "🎁", "🎊", "✨", "💫", "🌟", "🎂", "🎉"].map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl sm:text-3xl pointer-events-none z-0"
          style={{
            left: `${10 + (i * 11) % 80}%`,
            top: `${5 + (i * 13) % 70}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.span>
      ))}

      <motion.div
        className="wizard-card text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🏆
        </motion.div>

        {/* Messages appearing one by one */}
        <div className="min-h-[280px] flex flex-col items-center justify-center space-y-3 mb-6">
          <AnimatePresence>
            {messages.slice(0, visibleIndex + 1).map((msg, i) => (
              <motion.p
                key={i}
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`${
                  i === messages.length - 1
                    ? "text-2xl sm:text-3xl font-bold text-gradient"
                    : i === 0
                    ? "text-xl font-semibold text-foreground"
                    : "text-lg text-muted-foreground"
                }`}
              >
                {msg}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {/* Emoji row */}
        <motion.div
          className="flex justify-center gap-2 my-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: showAll ? 1 : 0 }}
        >
          {["🎈", "🎁", "🎊", "🎉", "🎂"].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-3xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ delay: i * 0.15, duration: 1.5, repeat: Infinity }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {showAll && (
          <motion.button
            onClick={onNext}
            className="glass-button mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Gift className="w-5 h-5" /> Before you close this, click here
            <Heart className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default BirthdayWish;
