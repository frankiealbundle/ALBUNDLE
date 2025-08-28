import { useEffect, useState } from 'react';
import albundleLogo from 'figma:asset/3ae0606ee5d9055ceef427e84776613477a14947.png';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center max-w-xs w-full px-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1, 
            type: "spring", 
            bounce: 0.3 
          }}
          className="mb-8"
        >
          <div className="w-48 h-16 mx-auto mb-6">
            <img 
              src={albundleLogo} 
              alt="Albundle" 
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h1 className="text-xl font-semibold text-foreground mb-2">Welcome to Albundle</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your complete music project management companion for artists and creators
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8"
        >
          <div className="w-24 h-1 bg-primary/20 rounded-full mx-auto relative overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%", x: "-100%" }}
              animate={{ width: "100%", x: "0%" }}
              transition={{ delay: 1.7, duration: 0.8 }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.3 }}
            className="text-xs text-muted-foreground mt-2"
          >
            Loading your workspace...
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}