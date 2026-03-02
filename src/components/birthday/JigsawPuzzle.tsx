import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Puzzle, RefreshCw } from "lucide-react";

interface Props {
  imageSrc?: string | null;
  onNext: () => void;
}

const GRID_SIZE = 3;
const TOTAL = GRID_SIZE * GRID_SIZE;
const FALLBACK_IMAGE = "https://picsum.photos/seed/jigsaw-birthday/450/450";

function shuffleArray(arr: number[]): number[] {
  const shuffled = [...arr];
  let isSolvable = false;
  while (!isSolvable) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const isSolved = shuffled.every((v, i) => v === i);
    if (!isSolved) isSolvable = true;
  }
  return shuffled;
}

const JigsawPuzzle = ({ imageSrc, onNext }: Props) => {
  const [pieces, setPieces] = useState<number[]>(() =>
    shuffleArray(Array.from({ length: TOTAL }, (_, i) => i))
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);

  const image = imageSrc || FALLBACK_IMAGE;

  const isSolved = useCallback(
    (p: number[]) => p.every((v, i) => v === i),
    []
  );

  useEffect(() => {
    if (isSolved(pieces) && moves > 0) {
      setSolved(true);
    }
  }, [pieces, moves, isSolved]);

  const handlePieceClick = (index: number) => {
    if (solved) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      if (selectedIndex !== index) {
        const newPieces = [...pieces];
        [newPieces[selectedIndex], newPieces[index]] = [newPieces[index], newPieces[selectedIndex]];
        setPieces(newPieces);
        setMoves((m) => m + 1);
      }
      setSelectedIndex(null);
    }
  };

  const handleShuffle = () => {
    setPieces(shuffleArray(Array.from({ length: TOTAL }, (_, i) => i)));
    setSelectedIndex(null);
    setSolved(false);
    setMoves(0);
  };

  return (
    <div className="screen-container">
      <motion.div
        className="wizard-card text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Puzzle className="w-8 h-8 text-secondary" />
          <h2 className="text-2xl font-bold">Jigsaw Puzzle 🧩</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          {solved
            ? "🎉 You solved it!"
            : "Tap two pieces to swap them. Solve the photo!"}
        </p>

        <div className="flex justify-between items-center mb-3 px-2">
          <span className="glass-badge">Moves: {moves}</span>
          <button
            onClick={handleShuffle}
            className="glass-badge flex items-center gap-1 hover:bg-primary/20 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Puzzle Grid */}
        <div
          className="grid gap-1 mx-auto rounded-xl overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: "min(100%, 320px)",
            aspectRatio: "1",
          }}
        >
          {pieces.map((pieceId, index) => {
            const row = Math.floor(pieceId / GRID_SIZE);
            const col = pieceId % GRID_SIZE;
            const isSelected = selectedIndex === index;

            return (
              <motion.button
                key={index}
                onClick={() => handlePieceClick(index)}
                className={`relative overflow-hidden rounded-lg transition-all ${
                  isSelected
                    ? "ring-3 ring-primary scale-95 z-10"
                    : "hover:brightness-110"
                } ${solved ? "pointer-events-none" : ""}`}
                style={{
                  aspectRatio: "1",
                  backgroundImage: `url(${image})`,
                  backgroundSize: `${GRID_SIZE * 100}%`,
                  backgroundPosition: `${(col / (GRID_SIZE - 1)) * 100}% ${(row / (GRID_SIZE - 1)) * 100}%`,
                }}
                whileTap={!solved ? { scale: 0.9 } : undefined}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            );
          })}
        </div>

        {solved && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-4"
          >
            <p className="text-lg font-bold text-fun mb-3">
              Solved in {moves} moves! 🏆
            </p>
            <motion.button
              onClick={onNext}
              className="glass-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue 🎉
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default JigsawPuzzle;
