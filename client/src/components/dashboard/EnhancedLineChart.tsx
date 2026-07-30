import { motion } from 'framer-motion';

interface EnhancedLineChartProps {
  data: Array<{ [key: string]: string | number }>;
  lines: Array<{ key: string; color: string; name: string }>;
  xKey: string;
  height?: number;
  showArea?: boolean;
  showPrediction?: boolean;
  predictionData?: Array<{ [key: string]: string | number }>;
  showAverage?: boolean;
  averageKey?: string;
  showMarkers?: boolean;
  title?: string;
  subtitle?: string;
}

function EnhancedLineChart({
  data,
  lines,
  xKey,
  height = 300,
  showArea = true,
  showPrediction = false,
  predictionData,
  showAverage = false,
  averageKey,
  showMarkers = true,
  title,
  subtitle,
}: EnhancedLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-eco-muted text-sm" style={{ height }}>
        No data available
      </div>
    );
  }

  const allValues = data.flatMap((d) => lines.map((l) => Number(d[l.key])));
  const avg = showAverage && averageKey ? data.reduce((s, d) => s + Number(d[averageKey]), 0) / data.length : undefined;
  const peak = Math.max(...allValues);
  const trough = Math.min(...allValues);

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h3 className="text-sm font-semibold text-eco-dark">{title}</h3>}
          {subtitle && <p className="text-[11px] text-eco-muted mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div style={{ width: '100%', minWidth: 0 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ height }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 600 ${height}`} preserveAspectRatio="none">
            <defs>
              {lines.map((line) => (
                <linearGradient key={`grad-${line.key}`} id={`enhanced-grad-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={line.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={line.color} stopOpacity={0} />
                </linearGradient>
              ))}
              {showPrediction && predictionData && (
                <linearGradient id="prediction-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              )}
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGridX data={data} xKey={xKey} height={height} />

            {showAverage && avg !== undefined && (
              <motion.line
                x1="0" x2="600"
                y1={height - (avg / (peak * 1.2)) * height}
                y2={height - (avg / (peak * 1.2)) * height}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="6 4"
                opacity={0.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            )}

            {showPrediction && predictionData && (
              <path
                d={buildPredictionPath(predictionData, lines, height)}
                fill="url(#prediction-gradient)"
                stroke="none"
              />
            )}

            {lines.map((line) => {
              const values = data.map((d) => Number(d[line.key]));
              const pathD = buildLinePath(values, height, data.length);
              const areaD = showArea ? `${pathD} L 600 ${height} L 0 ${height} Z` : undefined;

              return (
                <g key={line.key}>
                  {showArea && areaD && (
                    <motion.path
                      d={areaD}
                      fill={`url(#enhanced-grad-${line.key})`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  )}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke={line.color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                  {showMarkers && (
                    <>
                      {values.map((v, i) => {
                        if (i % Math.max(1, Math.floor(values.length / 10)) !== 0) return null;
                        const x = (i / (values.length - 1)) * 600;
                        const y = height - (v / (peak * 1.2)) * height;
                        return (
                          <circle
                            key={`dot-${line.key}-${i}`}
                            cx={x}
                            cy={y}
                            r={2}
                            fill={line.color}
                            stroke="#fff"
                            strokeWidth={1.5}
                            opacity={0.7}
                          />
                        );
                      })}
                      <circle
                        cx={600}
                        cy={height - (values[values.length - 1] / (peak * 1.2)) * height}
                        r={4}
                        fill={line.color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </g>
              );
            })}

            {showPrediction && predictionData && (
              <motion.path
                d={buildPredictionPath(predictionData, lines, height)}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            )}

            {showMarkers && (
              <>
                <circle
                  cx={600}
                  cy={height - (peak / (peak * 1.2)) * height}
                  r={5}
                  fill="#ef4444"
                  stroke="#fff"
                  strokeWidth={2}
                />
                <text x={590} y={height - (peak / (peak * 1.2)) * height - 8} textAnchor="end" fill="#ef4444" fontSize={9} fontWeight={600}>
                  Peak
                </text>
                <circle
                  cx={600}
                  cy={height - (trough / (peak * 1.2)) * height}
                  r={5}
                  fill="#3b82f6"
                  stroke="#fff"
                  strokeWidth={2}
                />
                <text x={590} y={height - (trough / (peak * 1.2)) * height + 14} textAnchor="end" fill="#3b82f6" fontSize={9} fontWeight={600}>
                  Low
                </text>
              </>
            )}
          </svg>
        </motion.div>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          {lines.map((line) => (
            <div key={line.key} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: line.color }} />
              <span className="text-[11px] text-eco-muted font-medium">{line.name}</span>
            </div>
          ))}
          {showAverage && avg !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-dashed border-slate-400" />
              <span className="text-[11px] text-eco-muted font-medium">Average</span>
            </div>
          )}
          {showPrediction && (
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-dashed border-violet-500" style={{ backgroundColor: '#8b5cf640' }} />
              <span className="text-[11px] text-eco-muted font-medium">Predicted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CartesianGridX({ data, xKey, height }: { data: Array<{ [key: string]: string | number }>; xKey: string; height: number }) {
  if (!data || data.length === 0) return null;
  const ticks = data.length <= 12 ? data : data.filter((_, i) => i % Math.ceil(data.length / 8) === 0);

  return (
    <>
      {ticks.map((d, i) => {
        const x = (i / (data.length - 1)) * 600;
        return (
          <g key={i}>
            <line x1={x} y1={0} x2={x} y2={height} stroke="#f1f5f9" strokeWidth={0.5} />
            <text x={x} y={height - 2} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight={400}>
              {String(d[xKey])}
            </text>
          </g>
        );
      })}
    </>
  );
}

function buildLinePath(values: number[], height: number, count: number): string {
  if (values.length === 0) return '';
  const max = Math.max(...values, 1);
  return values
    .map((v, i) => {
      const x = count > 1 ? (i / (count - 1)) * 600 : 300;
      const y = height - (v / (max * 1.15)) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function buildPredictionPath(
  predData: Array<{ [key: string]: string | number }>,
  lines: Array<{ key: string; color: string; name: string }>,
  height: number
): string {
  if (!predData || predData.length === 0 || lines.length === 0) return '';
  const firstLine = lines[0];
  const values = predData.map((d) => Number(d[firstLine.key]));
  const max = Math.max(...values, 1);
  return values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * 600;
      const y = height - (v / (max * 1.15)) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export default EnhancedLineChart;