import { motion } from "framer-motion";
import { Heart, Gift } from "lucide-react";

interface Props {
  onNext: () => void;
}

const BirthdayWish = ({ onNext }: Props) => {
  return (
    <div className="screen-container gradient-celebration">
      <motion.div
        className="wizard-card text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <motion.div
          className="text-7xl mb-6"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🏆
        </motion.div>

        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You are a winner.
        </motion.h2>

        <motion.p
          className="text-xl text-muted-foreground mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          I look up to you. 🌟
        </motion.p>

        <motion.div
          className="my-8 space-y-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-2xl font-bold text-gradient">
            Happy Birthday! 🎂
          </p>
          <p className="text-lg text-muted-foreground">
            Keep growing, keep smiling.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-2 my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {["🎈", "🎁", "🎊", "🎉", "🎂"].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-3xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        <motion.button
          onClick={onNext}
          className="w-full py-4 rounded-xl bg-love text-accent-foreground font-bold text-lg flex items-center justify-center gap-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Gift className="w-5 h-5" /> Before you close this, click here
          <Heart className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BirthdayWish;
