import { useState, useRef, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
}

function AnimatedNumber({ value, duration = 800, decimals = 1, className = '' }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const diff = end - start;
    if (diff === 0) return;

    const startTime = performance.now();
    let rafId: number;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + diff * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    prevValue.current = end;
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  return (
    <span className={`font-mono font-bold ${className}`}>
      {displayValue.toFixed(decimals)}
    </span>
  );
}

export default AnimatedNumber;