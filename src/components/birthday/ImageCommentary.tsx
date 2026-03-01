import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ArrowRight } from "lucide-react";

interface Props {
  onNext: (comments: string[]) => void;
}

const PLACEHOLDER_IMAGES = Array.from({ length: 10 }, (_, i) =>
  `https://picsum.photos/seed/birthday${i + 1}/400/300`
);

const ImageCommentary = ({ onNext }: Props) => {
  const [comments, setComments] = useState<string[]>(Array(10).fill(""));
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const empty = comments.findIndex((c) => !c.trim());
    if (empty !== -1) {
      setError(`Comment on photo #${empty + 1} first! 📝`);
      return;
    }
    onNext(comments);
  };

  const completedCount = comments.filter((c) => c.trim()).length;

  return (
    <div className="screen-container bg-celebration-light">
      <motion.div
        className="w-full max-w-lg mx-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="wizard-card mb-4 text-center">
          <MessageSquare className="w-10 h-10 mx-auto text-primary mb-2" />
          <h2 className="text-2xl font-bold">Memory Lane 📷</h2>
          <p className="text-muted-foreground text-sm">
            Comment on each memory ({completedCount}/10 done)
          </p>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          {PLACEHOLDER_IMAGES.map((src, i) => (
            <motion.div
              key={i}
              className="bg-card rounded-2xl overflow-hidden shadow-lg border border-primary/10"
              initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <img
                src={src}
                alt={`Memory ${i + 1}`}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <input
                  type="text"
                  value={comments[i]}
                  onChange={(e) => {
                    const newComments = [...comments];
                    newComments[i] = e.target.value;
                    setComments(newComments);
                    setError("");
                  }}
                  placeholder={`Comment on memory #${i + 1}...`}
                  className="w-full px-3 py-2 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-sm transition-all"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {error && (
          <p className="text-destructive text-sm font-semibold text-center mt-3">
            {error}
          </p>
        )}

        <motion.button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl gradient-warm text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 mt-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ImageCommentary;
