import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plane, Sparkles } from "lucide-react";

interface Props {
  onNext: (name: string) => void;
}

const WelcomeScreen = ({ onNext }: Props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter your name!");
      setShowError(true);
      return;
    }
    if (name.trim().toLowerCase() !== "trizon") {
      setError("You are not my brother! Get out! 😤");
      setShowError(true);
      return;
    }
    setShowError(false);
    onNext(name.trim());
  };

  return (
    <div className="screen-container">
      <motion.div
        className="wizard-card text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <motion.div
          className="mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-16 h-16 mx-auto text-primary" />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-foreground mb-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Hello Bhaiya! 🎉
        </motion.h1>

        <motion.div
          className="flex items-center justify-center gap-2 text-muted-foreground mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span>🇮🇳</span>
          <Plane className="w-4 h-4 text-secondary" />
          <span>🇬🇧</span>
        </motion.div>

        <motion.p
          className="text-lg text-muted-foreground mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          I have put something special for you.
          <br />
          <span className="text-love font-semibold">From India to UK with love.</span>
        </motion.p>

        <motion.div
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setShowError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter your name to continue..."
            className="glass-input text-center text-lg font-medium"
          />

          <AnimatePresence>
            {showError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-destructive font-semibold text-sm"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleSubmit}
            className="glass-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's Go! <Heart className="inline w-5 h-5 ml-1" />
          </motion.button>
        </motion.div>

        <motion.p
          className="text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Made with ❤️ by Golu
        </motion.p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
