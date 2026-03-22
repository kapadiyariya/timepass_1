import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Stars, 
  Cake as CakeIcon, 
  ArrowRight, 
  Gift, 
  Camera,
  Sparkles
} from 'lucide-react';
import { MusicPlayer } from './components/MusicPlayer';
import { Cake } from './components/Cake';
import { cn } from './lib/utils';

type Page = 'intro' | 'gallery' | 'cake' | 'wish';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('intro');
  const [openedGifts, setOpenedGifts] = useState<number[]>([]);

  const nextPage = () => {
    const pages: Page[] = ['intro', 'gallery', 'cake', 'wish'];
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1]);
    }
  };

  useEffect(() => {
    if (currentPage === 'wish') {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'intro':
        return (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center min-h-screen text-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full -z-10" />
              {/* 📸 CHANGE YOUR PHOTO HERE:
                  1. Upload your photo to the "public" folder
                  2. Replace '/myphoto.jpg' with your actual filename (e.g., '/birthday-girl.png')
              */}
              <img 
                src="/pic1.jpeg" 
                alt="Birthday Person"
                className="w-48 h-48 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 -right-4 bg-pink-500 p-2 rounded-full shadow-lg"
              >
                <Heart className="w-6 h-6 text-white fill-white" />
              </motion.div>
            </motion.div>

            <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
              Hey You! <br />
              <span className="text-pink-400">It's a Special Day.</span>
            </h1>
            <p className="text-white/70 text-xl max-w-md mb-12">
              I've prepared a little something to celebrate another amazing year of you.
            </p>
            <button
              onClick={nextPage}
              className="group flex items-center space-x-3 bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-all shadow-xl hover:shadow-pink-500/20"
            >
              <span>Open Your Surprise</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        );

      case 'gallery':
        const goodies = [
          { title: "A Virtual Hug", icon: Heart, color: "text-red-400" },
          { title: "Golden Soul", icon: Stars, color: "text-blue-400" },
          { title: "Shine Bright", icon: Sparkles, color: "text-yellow-400" },
          { title: "Dream Big", icon: Stars, color: "text-purple-400" },
          { title: "Keep Smiling", icon: Sparkles, color: "text-emerald-400" }
        ];

        const handleGiftClick = (index: number) => {
          if (!openedGifts.includes(index)) {
            setOpenedGifts([...openedGifts, index]);
            confetti({
              particleCount: 30,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#FF69B4', '#FFD700', '#00CED1']
            });
          }
        };

        return (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-2">The Goodie Box 🎁</h2>
              <p className="text-white/60">Tap the floating gifts to reveal your virtual goodies!</p>
            </div>

            <div className="relative w-full max-w-4xl h-[400px] flex flex-wrap justify-center items-center gap-8">
              {goodies.map((goodie, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0 }}
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3 + i,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <AnimatePresence mode="wait">
                    {!openedGifts.includes(i) ? (
                      <motion.button
                        key="gift"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleGiftClick(i)}
                        className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl group"
                      >
                        <Gift className="w-12 h-12 text-pink-400 group-hover:rotate-12 transition-transform" />
                      </motion.button>
                    ) : (
                      <motion.div
                        key="reveal"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="bg-white/20 backdrop-blur-2xl p-8 rounded-3xl border border-pink-400/50 shadow-[0_0_30px_rgba(244,114,182,0.3)] flex flex-col items-center space-y-3 min-w-[160px]"
                      >
                        <goodie.icon className={cn("w-10 h-10", goodie.color)} />
                        <span className="text-white font-bold text-lg whitespace-nowrap">{goodie.title}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              <div className="fixed bottom-12 right-12 z-40">
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={nextPage}
                  className={cn(
                    "group flex items-center space-x-3 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-2xl",
                    openedGifts.length >= 3 
                      ? "bg-pink-500 text-white hover:bg-pink-600 hover:shadow-pink-500/40" 
                      : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20 border border-white/10"
                  )}
                >
                  <span>{openedGifts.length >= 3 ? "Time for Cake! 🎂" : "Skip to Cake"}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </AnimatePresence>
          </motion.div>
        );

      case 'cake':
        return (
          <motion.div
            key="cake"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            <div className="flex items-center space-x-4 mb-20">
              <CakeIcon className="w-6 h-6 text-pink-400" />
              <h2 className="text-3xl font-bold text-white">Time for a Wish</h2>
            </div>
            <Cake onBlown={nextPage} />
            
            <button
              onClick={nextPage}
              className="mt-12 text-white/30 hover:text-white/60 transition-colors text-sm flex items-center gap-2"
            >
              <span>Can't blow? Skip to wish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        );

      case 'wish':
        return (
          <motion.div
            key="wish"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-screen text-center p-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 mb-8 animate-gradient">
                HAPPY BIRTHDAY!
              </h1>
              <p className="text-white text-2xl md:text-3xl font-light max-w-2xl mx-auto leading-relaxed">
                May your day be as <span className="text-pink-400 font-bold">extraordinary</span> as you are. 
                Keep shining, keep dreaming, and never stop being you.
              </p>
              <motion.div 
                className="mt-12 flex justify-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <Heart className="w-8 h-8 text-red-500 fill-red-500 animate-pulse" />
                <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
                <Heart className="w-8 h-8 text-red-500 fill-red-500 animate-pulse" />
              </motion.div>
              
              <button
                onClick={() => setCurrentPage('intro')}
                className="mt-16 text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest"
              >
                Start Over
              </button>
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] overflow-hidden selection:bg-pink-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <MusicPlayer />
      
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {['intro', 'gallery', 'cake', 'wish'].map((p) => (
          <div 
            key={p}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-500",
              currentPage === p ? "w-8 bg-pink-400" : "bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
}
