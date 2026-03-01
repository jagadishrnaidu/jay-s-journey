import { motion } from "framer-motion";
import { Trophy, ArrowRight } from "lucide-react";

interface Props {
  score: number;
  onNext: () => void;
}

const ScoreReveal = ({ score, onNext }: Props) => {
  return (
    <div className="screen-container gradient-celebration">
      <motion.div
        className="wizard-card text-center"
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Trophy className="w-16 h-16 mx-auto text-primary mb-4" />

        <motion.h2
          className="text-3xl font-bold mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your Score: {score} hits! 💪
        </motion.h2>

        <motion.div
          className="space-y-3 my-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-2xl font-bold text-destructive">
            You LOST! 😂
          </p>
          <p className="text-muted-foreground text-lg">
            Because I am the decider! Golu always wins! 👑
          </p>
          <div className="bg-muted rounded-2xl p-4 mt-4">
            <p className="text-sm text-muted-foreground">However, your effort score is:</p>
            <p className="text-4xl font-bold text-secondary">{score}</p>
            <p className="text-xs text-muted-foreground">
              (Impressive... but still a loss 😜)
            </p>
          </div>
        </motion.div>

        <motion.button
          onClick={onNext}
          className="w-full py-3 rounded-xl gradient-warm text-primary-foreground font-bold text-lg flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Accept Defeat & Continue <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ScoreReveal;
