import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

interface Props {
  comments: string[];
  onNext: (selected: number[]) => void;
}

const PLACEHOLDER_IMAGES = Array.from({ length: 10 }, (_, i) =>
  `https://picsum.photos/seed/birthday${i + 1}/400/300`
);

const PolaroidSelection = ({ comments, onNext }: Props) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState("");

  const toggleSelect = (i: number) => {
    setError("");
    if (selected.includes(i)) {
      setSelected(selected.filter((s) => s !== i));
    } else if (selected.length < 5) {
      setSelected([...selected, i]);
    } else {
      setError("You can only pick 5! Deselect one first.");
    }
  };

  const handleSubmit = () => {
    if (selected.length !== 5) {
      setError("Select exactly 5 favorites!");
      return;
    }
    onNext(selected);
  };

  const getGist = (comment: string) => {
    const words = comment.trim().split(/\s+/).slice(0, 4).join(" ");
    return words + "...";
  };

  return (
    <div className="screen-container">
      <motion.div
        className="w-full max-w-lg mx-auto relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="wizard-card mb-4 text-center">
          <Star className="w-10 h-10 mx-auto text-primary mb-2" />
          <h2 className="text-2xl font-bold">Pick Your Top 5 📸</h2>
          <p className="text-muted-foreground text-sm">
            {selected.length}/5 selected
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto px-1">
          {PLACEHOLDER_IMAGES.map((src, i) => (
            <motion.button
              key={i}
              onClick={() => toggleSelect(i)}
              className={`relative glass-panel p-2 pb-8 transition-all ${
                selected.includes(i)
                  ? "ring-2 ring-primary scale-[0.97]"
                  : ""
              }`}
              whileTap={{ scale: 0.95 }}
              style={{ transform: `rotate(${(i % 3 - 1) * 2}deg)` }}
            >
              {selected.includes(i) && (
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center z-10">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <img
                src={src}
                alt={`Polaroid ${i + 1}`}
                className="w-full h-28 object-cover rounded-lg"
                loading="lazy"
              />
              <p className="text-xs font-medium text-muted-foreground mt-2 px-1 truncate italic">
                "{getGist(comments[i] || "No comment")}"
              </p>
            </motion.button>
          ))}
        </div>

        {error && (
          <p className="text-destructive text-sm font-semibold text-center mt-3">
            {error}
          </p>
        )}

        <motion.button
          onClick={handleSubmit}
          className="glass-button mt-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Confirm Selection ✨
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PolaroidSelection;
