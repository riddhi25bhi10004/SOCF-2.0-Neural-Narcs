import { motion } from 'framer-motion';

interface RadialGaugeProps {
  value: number;
  max?: number;
  label: string;
  size?: number;
  zones?: Array<{ from: number; to: number; color: string; label: string }>;
  expectedValue?: number;
  optimizedValue?: number;
  recommendation?: string;
}

function RadialGauge({
  value,
  max = 100,
  label,
  size = 220,
  zones,
  expectedValue,
  optimizedValue,
  recommendation,
}: RadialGaugeProps) {
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const expectedPct = expectedValue !== undefined ? Math.min(Math.max(expectedValue / max, 0), 1) : undefined;
  const optimizedPct = optimizedValue !== undefined ? Math.min(Math.max(optimizedValue / max, 0), 1) : undefined;

  const defaultZones = [
    { from: 0, to: 0.33, color: '#10b981', label: 'Safe' },
    { from: 0.33, to: 0.66, color: '#f59e0b', label: 'Moderate' },
    { from: 0.66, to: 0.85, color: '#f97316', label: 'High' },
    { from: 0.85, to: 1, color: '#ef4444', label: 'Critical' },
  ];
  const activeZones = zones || defaultZones;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const strokeWidth = size * 0.08;
  const startAngle = -90;
  const totalAngle = 270;

  const getAngle = (pct: number) => startAngle + pct * totalAngle;
  const polarToCartesian = (angleDeg: number, r: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (startPct: number, endPct: number, r: number) => {
    const s = getAngle(startPct * 100);
    const e = getAngle(endPct * 100);
    const start = polarToCartesian(s, r);
    const end = polarToCartesian(e, r);
    const largeArc = (endPct - startPct) * 100 > 50 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  const needleAngle = getAngle(percentage * 100);
  const needleLen = radius * 0.85;
  const needle = polarToCartesian(needleAngle, needleLen);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {activeZones.map((zone, i) => {
            const arcPath = describeArc(zone.from, zone.to, radius);
            return (
              <motion.path
                key={i}
                d={arcPath}
                fill="none"
                stroke={zone.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity={0.2}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.2, pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            );
          })}

          {activeZones.map((zone, i) => {
            const arcPath = describeArc(zone.from, zone.to, radius);
            const isActive = percentage * 100 >= zone.from * 100 && percentage * 100 <= zone.to * 100;
            return (
              <motion.path
                key={`active-${i}`}
                d={arcPath}
                fill="none"
                stroke={zone.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity={isActive ? 0.9 : 0.15}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            );
          })}

          <motion.line
            x1={cx}
            y1={cy}
            x2={needle.x}
            y2={needle.y}
            stroke="#2f220f"
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ x2: cx, y2: cy }}
            animate={{ x2: needle.x, y2: needle.y }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <circle cx={cx} cy={cy} r={6} fill="#2f220f" />
          <circle cx={cx} cy={cy} r={3} fill="#fff" />

          {expectedPct !== undefined && (
            <>
              {(() => {
                const expAngle = getAngle(expectedPct * 100);
                const expPt = polarToCartesian(expAngle, radius + strokeWidth / 2 + 4);
                return (
                  <>
                    <circle cx={expPt.x} cy={expPt.y} r={3} fill="none" stroke="#3b82f6" strokeWidth={2} />
                    <text x={expPt.x} y={expPt.y + 12} textAnchor="middle" fill="#3b82f6" fontSize={8} fontWeight={500}>
                      Expected
                    </text>
                  </>
                );
              })()}
            </>
          )}

          {optimizedPct !== undefined && (
            <>
              {(() => {
                const optAngle = getAngle(optimizedPct * 100);
                const optPt = polarToCartesian(optAngle, radius + strokeWidth / 2 + 4);
                return (
                  <>
                    <circle cx={optPt.x} cy={optPt.y} r={3} fill="none" stroke="#10b981" strokeWidth={2} />
                    <text x={optPt.x} y={optPt.y + 12} textAnchor="middle" fill="#10b981" fontSize={8} fontWeight={500}>
                      Optimal
                    </text>
                  </>
                );
              })()}
            </>
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pb-6">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-3xl font-bold font-mono text-eco-dark"
          >
            {Math.round(value)}
          </motion.span>
          <span className="text-xs text-eco-muted font-medium tracking-wide uppercase mt-1">{label}</span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        {activeZones.map((zone) => (
          <div key={zone.label} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: zone.color }} />
            <span className="text-[10px] text-eco-muted font-medium">{zone.label}</span>
          </div>
        ))}
      </div>

      {recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 rounded-xl bg-[#fefaf3] border border-amber-200/60 px-4 py-2.5 text-center"
        >
          <p className="text-[11px] text-eco-muted leading-relaxed">{recommendation}</p>
        </motion.div>
      )}
    </div>
  );
}

export default RadialGauge;