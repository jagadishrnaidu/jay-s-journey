import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send } from "lucide-react";

interface Props {
  onNext: (story: string) => void;
}

const ThailandStory = ({ onNext }: Props) => {
  const [story, setStory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (story.trim().length < 20) {
      setError("Come on, spill the tea! Write more! 🍵");
      return;
    }
    onNext(story.trim());
  };

  return (
    <div className="screen-container bg-love-light">
      <motion.div
        className="wizard-card text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🇹🇭
        </motion.div>

        <h2 className="text-2xl font-bold mb-2">The Thailand Story 👀</h2>

        <p className="text-muted-foreground mb-6">
          Tell me about your crush in Thailand... the girl you were staring at in the club? 😏
        </p>

        <div className="flex items-center gap-2 text-love text-sm font-semibold mb-3">
          <Heart className="w-4 h-4" /> Confession Time
        </div>

        <textarea
          value={story}
          onChange={(e) => {
            setStory(e.target.value);
            setError("");
          }}
          placeholder="Start typing your confession..."
          className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-love focus:outline-none min-h-[160px] resize-none transition-all text-left"
        />

        {error && (
          <p className="text-destructive text-sm font-semibold mt-2">{error}</p>
        )}

        <motion.button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-love text-accent-foreground font-bold text-lg flex items-center justify-center gap-2 mt-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Submit Confession <Send className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ThailandStory;
