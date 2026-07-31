import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GaugeChartProps {
  value: number;
  max?: number;
  label: string;
  color?: string;
  size?: number;
}

function GaugeChart({ value, max = 100, label, color = '#2563eb', size = 200 }: GaugeChartProps) {
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const r = size * 0.38;
  const viewWidth = size;
  const viewHeight = size / 2 + 6;
  const cx = size / 2;
  const cy = size / 2;

  const segments = useMemo(() => {
    const segs = [];
    const numSegs = 40;
    for (let i = 0; i < numSegs; i++) {
      const angle1 = (i / numSegs) * Math.PI;
      const angle2 = ((i + 0.8) / numSegs) * Math.PI;
      const x1 = cx - r * Math.cos(angle1);
      const y1 = cy - r * Math.sin(angle1);
      const x2 = cx - r * Math.cos(angle2);
      const y2 = cy - r * Math.sin(angle2);
      const x3 = cx - (r - 10) * Math.cos(angle2);
      const y3 = cy - (r - 10) * Math.sin(angle2);
      const x4 = cx - (r - 10) * Math.cos(angle1);
      const y4 = cy - (r - 10) * Math.sin(angle1);
      segs.push({ id: i, d: `M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2} L ${x3} ${y3} A ${r - 10} ${r - 10} 0 0 1 ${x4} ${y4} Z` });
    }
    return segs;
  }, [size]);

  // Scale text sizes with the gauge so the block fits in the safe zone
  // near the bottom of the container (close to the flat baseline / cy),
  // instead of the container's vertical center.
  const valueFontSize = Math.max(size * 0.15, 14);
  const labelFontSize = Math.max(size * 0.055, 8);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: viewHeight }}>
        <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="w-full h-full">
          {segments.map((seg, i) => {
            const segPercent = (i + 1) / segments.length;
            const isActive = segPercent <= percentage;
            return (
              <motion.path
                key={seg.id}
                d={seg.d}
                fill={isActive ? color : '#e2e8f0'}
                opacity={isActive ? 0.85 : 0.4}
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 0.85 : 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.008 }}
              />
            );
          })}

          <line x1={cx - r + 2} y1={cy} x2={cx + r - 2} y2={cy} stroke="#e2e8f0" strokeWidth={1} strokeOpacity={0.5} />

          {[0, 25, 50, 75, 100].map((pct) => {
            const angle = (pct / 100) * Math.PI;
            const x = cx - (r + 8) * Math.cos(angle);
            const y = cy - (r + 8) * Math.sin(angle);
            return (
              <text key={pct} x={x} y={y + 3} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight={500}>
                {pct}
              </text>
            );
          })}
        </svg>

        {/* Anchored to the bottom of the container (near cy), which is the
            actual empty "safe zone" inside the arc's inner radius — instead
            of the container's vertical center, which sits inside the band. */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-0.5 pointer-events-none">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="font-bold font-mono text-eco-dark leading-none"
            style={{ fontSize: valueFontSize }}
          >
            {Math.round(value)}
          </motion.span>
          <span
            className="text-eco-muted font-medium tracking-wide uppercase leading-tight"
            style={{ fontSize: labelFontSize }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GaugeChart;