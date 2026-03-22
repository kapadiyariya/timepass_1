import React, { useState, useEffect, useRef } from 'react';
import { Music, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 🎵 CHANGE YOUR SONG HERE:
    // 1. Upload your mp3 file to the "public" folder (create one if it doesn't exist)
    // 2. Replace '/your-song.mp3' with your actual filename (e.g., '/mymusic.mp3')
    audioRef.current = new Audio('/mymusic.mp3');
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 shadow-lg text-white hover:bg-white/30 transition-colors"
      >
        {isPlaying ? <Music className="w-6 h-6 animate-pulse" /> : <Music2 className="w-6 h-6 opacity-50" />}
      </motion.button>
    </div>
  );
};
