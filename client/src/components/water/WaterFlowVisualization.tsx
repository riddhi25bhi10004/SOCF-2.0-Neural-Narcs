// client/src/components/water/WaterFlowVisualization.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, RefreshCw, Trash2, ArrowDown, Cpu } from 'lucide-react';

interface FlowParticle {
  id: number;
  progress: number;
  path: 'recycling' | 'waste';
  xOffset: number;
}

export default function WaterFlowVisualization() {
  const [particles, setParticles] = useState<FlowParticle[]>([]);
  const [particleId, setParticleId] = useState(0);

  // Generate particles
  useEffect(() => {
    const interval = setInterval(() => {
      const isRecycling = Math.random() > 0.4;
      const particle: FlowParticle = {
        id: particleId,
        progress: 0,
        path: isRecycling ? 'recycling' : 'waste',
        xOffset: (Math.random() - 0.5) * 20
      };
      
      setParticles(prev => {
        const newParticles = [...prev, particle];
        return newParticles.slice(-12);
      });
      setParticleId(prev => prev + 1);
    }, 900);

    return () => clearInterval(interval);
  }, [particleId]);

  // Animate particles
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            progress: Math.min(100, p.progress + 1.8)
          }))
          .filter(p => p.progress < 100)
      );
    }, 50);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <motion.div 
      className="glass p-5 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-title text-sm">Water Flow Visualization</h3>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-eco-muted">Live</span>
          </div>
          <span className="text-eco-muted">•</span>
          <span className="text-eco-muted font-medium">{particles.length} active</span>
        </div>
      </div>
      
      <div className="relative w-full" style={{ height: '260px' }}>
        {/* Flow Diagram - Compact Layout */}
        <div className="flex flex-col items-center justify-between h-full relative">
          
          {/* Row 1: Water Source */}
          <div className="flex items-center gap-4 w-full justify-center relative z-10">
            <CompactNode icon={<Droplets className="w-4 h-4" />} label="Water Source" color="#3b82f6" />
          </div>

          {/* Arrow 1 - Compact */}
          <div className="relative z-10 -my-1">
            <CompactArrow delay={0} />
          </div>

          {/* Row 2: Cooling Towers */}
          <div className="flex items-center gap-4 w-full justify-center relative z-10">
            <CompactNode icon={<RefreshCw className="w-4 h-4" />} label="Cooling Towers" color="#8b5cf6" />
          </div>

          {/* Arrow 2 - Compact */}
          <div className="relative z-10 -my-1">
            <CompactArrow delay={0.3} />
          </div>

          {/* Row 3: AI Optimization */}
          <div className="flex items-center gap-4 w-full justify-center relative z-10">
            <CompactNode icon={<Cpu className="w-4 h-4" />} label="AI Optimization" color="#10b981" isAI />
            
            {/* Particles Container - Compact */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-40 h-10">
              {particles.map((particle) => {
                const isRecycling = particle.path === 'recycling';
                const xPos = isRecycling ? -35 - (particle.progress / 100) * 25 : 35 + (particle.progress / 100) * 25;
                const yPos = 8 + (particle.progress / 100) * 15;
                const opacity = particle.progress > 80 ? 1 - (particle.progress - 80) / 20 : 1;
                const size = 3 + (particle.progress / 100) * 1.5;
                
                return (
                  <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: isRecycling ? '#f59e0b' : '#ef4444',
                      opacity: opacity,
                      left: `calc(50% + ${xPos}px)`,
                      top: `${yPos}px`,
                      boxShadow: `0 0 8px ${isRecycling ? '#f59e0b' : '#ef4444'}50`
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                );
              })}
            </div>
          </div>

          {/* Split Arrows - Compact */}
          <div className="flex items-center justify-center w-full gap-24 relative z-10 -my-1">
            <CompactArrow delay={0.6} direction="left" />
            <CompactArrow delay={0.6} direction="right" />
          </div>

          {/* Row 4: Recycling & Waste - Compact */}
          <div className="flex items-center justify-center w-full gap-24 relative z-10">
            <div className="flex flex-col items-center">
              <CompactNode 
                icon={<RefreshCw className="w-4 h-4" />} 
                label="Recycling" 
                color="#f59e0b"
              />
              <span className="text-xs font-bold text-eco-primary mt-0.5">58%</span>
            </div>
            <div className="flex flex-col items-center">
              <CompactNode 
                icon={<Trash2 className="w-4 h-4" />} 
                label="Waste" 
                color="#ef4444"
              />
              <span className="text-xs font-bold text-red-500 mt-0.5">42%</span>
            </div>
          </div>
        </div>

        {/* Stats - Compact */}
        <div className="absolute bottom-0 right-0 glass px-2 py-1 rounded-lg text-[10px] z-20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-eco-muted">Optimized: 96%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-eco-muted">Flow: {particles.length}/s</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== COMPACT SUB-COMPONENTS =====

interface CompactNodeProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  isAI?: boolean;
}

function CompactNode({ icon, label, color, isAI }: CompactNodeProps) {
  return (
    <motion.div 
      className="flex flex-col items-center gap-0.5"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative">
        {/* Glow */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: color,
            opacity: 0.08,
            filter: 'blur(8px)',
            transform: 'scale(1.3)'
          }}
        />
        
        {/* Node */}
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center relative"
          style={{ 
            backgroundColor: `${color}15`, 
            border: `2px solid ${color}`,
          }}
        >
          <span style={{ color }} className="relative">
            {icon}
          </span>
        </div>

        {/* AI Pulsing Ring */}
        {isAI && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${color}` }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      
      <span className="text-[10px] font-medium text-eco-dark">{label}</span>
    </motion.div>
  );
}

interface CompactArrowProps {
  delay: number;
  direction?: 'down' | 'left' | 'right';
}

function CompactArrow({ delay, direction = 'down' }: CompactArrowProps) {
  const getRotation = () => {
    if (direction === 'down') return '0deg';
    if (direction === 'left') return '90deg';
    return '-90deg';
  };

  const getAnimation = () => {
    if (direction === 'down') {
      return { y: [0, -2, 0] };
    }
    if (direction === 'left') {
      return { x: [0, -2, 0] };
    }
    return { x: [0, 2, 0] };
  };

  return (
    <motion.div
      className="text-eco-muted"
      style={{ transform: `rotate(${getRotation()})` }}
      animate={{
        opacity: [0.3, 0.7, 0.3],
        ...getAnimation()
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    >
      <ArrowDown className="w-3 h-3" />
    </motion.div>
  );
}