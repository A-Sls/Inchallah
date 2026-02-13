import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VolumeX, Music } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    const audio = new Audio("/audio/background-music.mp3");
    audio.loop = true;
    audioRef.current = audio;

    // Handle audio loading errors
    audio.addEventListener('error', (e) => {
      console.log("Audio file not found or failed to load");
      setIsPlaying(false);
    });

    // Check saved preference
    const savedPreference = localStorage.getItem("music-enabled");
    if (savedPreference === "true") {
      // Try to autoplay
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Autoplay blocked or audio not available:", err);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem("music-enabled", "false");
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Failed to play audio:", err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
      localStorage.setItem("music-enabled", "true");
    }

    // Show status briefly
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {showStatus && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-card/80 backdrop-blur-md border border-gold/30 px-4 py-2 rounded-full text-gold font-arabic-ui text-sm shadow-xl"
            dir="rtl"
          >
            {isPlaying ? "الموسيقى تعمل" : "الموسيقى متوقفة"}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(212, 168, 71, 0.4)" }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden
          ${isPlaying 
            ? "bg-gold/20 backdrop-blur-md border-2 border-gold text-gold" 
            : "bg-slate-900/60 backdrop-blur-md border-2 border-slate-700 text-slate-400"}
        `}
      >
        {/* Animated Background Pulse */}
        {isPlaying && (
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gold rounded-full"
          />
        )}
        
        <div className="relative z-10">
          {isPlaying ? (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Music className="w-6 h-6" />
            </motion.div>
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
        </div>
      </motion.button>
    </div>
  );
}
