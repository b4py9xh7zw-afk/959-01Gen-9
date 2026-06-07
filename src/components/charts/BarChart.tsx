import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '../../lib/utils';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
  [key: string]: string | number | undefined;
}

interface BarChartProps {
  data: DataPoint[];
  xKey?: string;
  yKey?: string;
  fillColor?: string;
  radius?: number | [number, number, number, number];
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export default function BarChart({
  data,
  xKey = 'name',
  yKey = 'value',
  fillColor = '#06B6D4',
  radius = [4, 4, 0, 0],
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  className,
}: BarChartProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          )}
          {showXAxis && (
            <XAxis
              dataKey={xKey}
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
            />
          )}
          {showYAxis && (
            <YAxis
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
            />
          )}
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#F1F5F9',
              }}
              cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }}
            />
          )}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor} stopOpacity={1} />
              <stop offset="100%" stopColor={fillColor} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <Bar
            dataKey={yKey}
            fill="url(#barGradient)"
            radius={radius}
            maxBarSize={40}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || 'url(#barGradient)'}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
