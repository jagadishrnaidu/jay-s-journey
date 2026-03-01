import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, ArrowRight } from "lucide-react";

interface Props {
  onNext: (photo: string | null) => void;
}

const PhotoUpload = ({ onNext }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="screen-container gradient-celebration">
      <motion.div
        className="wizard-card text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Camera className="w-12 h-12 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">📸 Photo Time!</h2>
        <p className="text-muted-foreground mb-6">
          Upload your favorite photo of us together
        </p>

        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleFile}
          className="hidden"
        />

        {preview ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6"
          >
            <img
              src={preview}
              alt="Uploaded"
              className="w-full max-h-64 object-cover rounded-2xl shadow-lg"
            />
          </motion.div>
        ) : (
          <motion.button
            onClick={() => fileRef.current?.click()}
            className="w-full py-12 rounded-2xl border-2 border-dashed border-primary/40 bg-muted/50 flex flex-col items-center gap-3 mb-6 hover:bg-muted transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-10 h-10 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">
              Tap to upload photo
            </span>
          </motion.button>
        )}

        {preview && (
          <motion.button
            onClick={() => fileRef.current?.click()}
            className="text-sm text-secondary font-semibold mb-4 block mx-auto"
          >
            Change photo
          </motion.button>
        )}

        <motion.button
          onClick={() => onNext(preview)}
          className="w-full py-3 rounded-xl gradient-warm text-primary-foreground font-bold text-lg flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PhotoUpload;
