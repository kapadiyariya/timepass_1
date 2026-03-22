import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Wind } from 'lucide-react';

interface CakeProps {
  onBlown: () => void;
}

export const Cake = ({ onBlown }: CakeProps) => {
  const [isBlown, setIsBlown] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setMicActive(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Mic access denied. You can also click the candles to blow them out!");
    }
  };

  useEffect(() => {
    let animationFrame: number;
    
    const checkVolume = () => {
      if (analyserRef.current && micActive && !isBlown) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(average);

        if (average > 60) { // Threshold for "blowing"
          handleBlow();
        }
      }
      animationFrame = requestAnimationFrame(checkVolume);
    };

    if (micActive) {
      checkVolume();
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [micActive, isBlown]);

  const handleBlow = () => {
    if (!isBlown) {
      setIsBlown(true);
      setTimeout(onBlown, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        {/* Cake Base */}
        <div className="w-64 h-32 bg-pink-400 rounded-t-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 w-full h-8 bg-pink-500 opacity-50 rounded-t-3xl" />
          <div className="absolute bottom-0 w-full h-4 bg-pink-600" />
          {/* Sprinkles */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-3 rounded-full"
              style={{
                backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#ADFF2F'][i % 4],
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Candles */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex space-x-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative cursor-pointer" onClick={handleBlow}>
              <div className="w-3 h-12 bg-yellow-200 rounded-full shadow-inner" />
              <AnimatePresence>
                {!isBlown && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      y: [0, -2, 0]
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.5 + Math.random() * 0.5 
                    }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-8 bg-orange-500 rounded-full blur-[2px] origin-bottom"
                    style={{
                      background: 'radial-gradient(circle, #ffeb3b 0%, #ff9800 50%, #f44336 100%)'
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center space-y-4">
        {!isBlown ? (
          <>
            <p className="text-white text-xl font-medium animate-bounce">
              Make a wish and blow! 🌬️
            </p>
            {!micActive ? (
              <button 
                onClick={startMic}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-white transition-all border border-white/20"
              >
                <Mic className="w-5 h-5" />
                <span>Enable Microphone to Blow</span>
              </button>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-400"
                    animate={{ width: `${Math.min(volume * 2, 100)}%` }}
                  />
                </div>
                <span className="text-white/60 text-sm flex items-center gap-1">
                  <Wind className="w-4 h-4" /> Blowing intensity
                </span>
              </div>
            )}
          </>
        ) : (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-yellow-300 text-2xl font-bold italic"
          >
            Wish granted! ✨
          </motion.p>
        )}
      </div>
    </div>
  );
};
