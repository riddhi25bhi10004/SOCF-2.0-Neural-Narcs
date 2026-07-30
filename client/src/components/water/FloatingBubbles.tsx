// client/src/components/water/FloatingBubbles.tsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 5,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-blue-500/20"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: bubble.size,
            height: bubble.size,
            opacity: bubble.opacity,
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 20, -20, 10, 0],
            scale: [1, 1.2, 1, 0.8, 1],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Inner shine */}
          <div 
            className="absolute rounded-full bg-white/30"
            style={{
              top: '20%',
              left: '20%',
              width: '30%',
              height: '30%',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}