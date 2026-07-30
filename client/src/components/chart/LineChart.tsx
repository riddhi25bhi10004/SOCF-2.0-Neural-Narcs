import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
} from 'recharts';

interface LineChartData {
  [key: string]: string | number;
}

interface LineChartSeries {
  key: string;
  color: string;
  name: string;
}

interface LineChartProps {
  data: LineChartData[];
  lines: LineChartSeries[];
  xKey: string;
  height?: number;
  showArea?: boolean;
}

function LineChart({ data, lines, xKey, height = 300, showArea = false }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-eco-muted text-sm" style={{ height }}>
        No data available
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 4 }}>
          <defs>
            {lines.map((line) => (
              <React.Fragment key={line.key}>
                <linearGradient id={`gradient-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={line.color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={line.color} stopOpacity={0} />
                </linearGradient>
                <filter id={`glow-${line.key}`}>
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </React.Fragment>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" strokeOpacity={0.6} />
          <XAxis
            dataKey={xKey}
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 400 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
            dy={4}
            minTickGap={20}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 400 }}
            tickLine={false}
            axisLine={false}
            width={45}
            dx={-2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              color: '#1e293b',
              fontSize: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              padding: '10px 14px',
            }}
            labelStyle={{ color: '#64748b', fontSize: '11px', fontWeight: 500, marginBottom: 4 }}
            itemStyle={{ padding: '2px 0' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
            verticalAlign="bottom"
          />
          {lines.map((line) => (
            <React.Fragment key={line.key}>
              {showArea && (
                <Area
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color}
                  fill={`url(#gradient-${line.key})`}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  name={line.name}
                  connectNulls
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              )}
              <Line
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={showArea ? 0 : 2.5}
                dot={showArea ? false : { r: 3, fill: '#ffffff', stroke: line.color, strokeWidth: 2 }}
                activeDot={{ r: 5, fill: line.color, stroke: '#ffffff', strokeWidth: 2 }}
                name={line.name}
                connectNulls
                animationDuration={800}
                animationEasing="ease-out"
              />
            </React.Fragment>
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;