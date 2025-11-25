import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function NFCCheckInAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      
    
      <div className="relative flex justify-center">
        <motion.div
          className="relative"
          animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
        
          <div className="w-80 h-96 bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl">
          
            <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50 rounded-2xl relative overflow-hidden border-2 border-slate-700">
             
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative"
                  animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: isAnimating ? 2 : 0 }}
                >
                  <NFCIcon />
                </motion.div>
              </div>

              {/* Check-in Interface */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-slate-700 text-sm">Ready to Check In</p>
                </div>
              </div>

              {/* Scanning Effect */}
              {isAnimating && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              )}
            </div>
          </div>

          {/* NFC Wave Effects */}
          {isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-40 h-40 border-2 border-blue-400 rounded-full"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: [0, 1.5, 2], opacity: [0.8, 0.4, 0] }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Phone */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          initial={{ x: "-200px", y: "50px", rotate: -15 }}
          animate={isAnimating ? {
            x: [-200, -50, -200],
            y: [50, -20, 50],
            rotate: [-15, -5, -15]
          } : {}}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        >
          <div className="w-24 h-44 bg-gradient-to-b from-slate-900 to-black rounded-xl shadow-xl relative">
            {/* Phone Screen */}
            <div className="absolute inset-2 bg-gradient-to-b from-blue-600 to-purple-700 rounded-lg overflow-hidden">
              {/* Status Bar */}
              <div className="h-6 bg-black/20 flex items-center justify-between px-2 text-white text-xs">
                <span>9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 p-3 text-center">
                <div className="w-8 h-8 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                </div>
                <p className="text-white text-xs">Tap to Check In</p>
              </div>

              {/* Tap Indicator */}
              {isAnimating && (
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 0.5, delay: 1 }}
                />
              )}
            </div>

            {/* Phone Hand */}
            <div className="absolute -bottom-4 -left-6 w-12 h-8 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full transform -rotate-12">
              <div className="absolute top-1 left-2 w-8 h-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Message */}
      {isAnimating && (
        <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-2 text-green-800">
            ✓ Check-in Successful
          </div>
        </motion.div>
      )}
    </div>
  );
}

function NFCIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M6 7v10"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.path
        d="M10 9v6"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.path
        d="M14 11v2"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.path
        d="M18 8v8"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.6, repeat: Infinity, repeatType: "reverse" }}
      />
    </svg>
  );
}