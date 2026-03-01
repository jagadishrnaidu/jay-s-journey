import { motion } from "framer-motion";
import { Package, Truck, MapPin, ChevronRight } from "lucide-react";

interface Props {
  onNext: () => void;
}

const AmazonDelivery = ({ onNext }: Props) => {
  return (
    <div className="screen-container">
      <motion.div
        className="wizard-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="glass-panel rounded-t-xl -mt-2 mb-6 px-4 py-3 text-center">
          <p className="font-bold text-lg">📦 Order Confirmation</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-fun/20 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-fun" />
            </div>
            <div>
              <p className="font-bold text-fun">Order Placed!</p>
              <p className="text-sm text-muted-foreground">
                Your selected Polaroids will be delivered soon.
              </p>
            </div>
          </div>

          <div className="glass-panel space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Shipping to:</strong> Jay, UK 🇬🇧
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Estimated delivery:</strong> With love, always ❤️
              </span>
            </div>
          </div>

          <div className="glass-panel">
            <p className="text-xs text-muted-foreground mb-1">Order #</p>
            <p className="font-mono text-sm font-bold">BDAY-JAY-2025-GOLU</p>
          </div>

          <motion.div
            className="flex justify-center"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Truck className="w-12 h-12 text-secondary" />
          </motion.div>
        </div>

        <motion.button
          onClick={onNext}
          className="glass-button mt-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Track Package <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AmazonDelivery;
