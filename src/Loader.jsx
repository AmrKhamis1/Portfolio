import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import "./CSS/loader.css";

export default function Loader({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate progress since no assets are being loaded
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return oldProgress + Math.random() * 10; // Increase by random small amounts
      });
    }, 300); // Update every 300ms

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setIsLoading(false), 1000); // Ensure fade-out animation
      setTimeout(onLoaded, 1500); // Call onLoaded after animation
    }
  }, [progress, onLoaded]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="loading-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }} // Smooth fade-out
        >
          {/* Logo Animation */}
          <motion.video
            src="logo.webm"
            className="logo"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 1 } }}
            loop
            autoPlay
            muted
            playsInline
          />

          {/* Loading Bar */}
          <div className="loading-bar-container">
            <motion.div
              className="loading-bar"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Loading Percentage */}
          <motion.p
            className="loading-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
