import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../../lib/utils';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface LineChartProps {
  data: DataPoint[];
  xKey?: string;
  yKey?: string;
  strokeColor?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  dot?: boolean;
  activeDot?: boolean;
  className?: string;
}

export default function LineChart({
  data,
  xKey = 'name',
  yKey = 'value',
  strokeColor = '#06B6D4',
  strokeWidth = 2,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  dot = false,
  activeDot = true,
  className,
}: LineChartProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              cursor={{ stroke: '#06B6D4', strokeOpacity: 0.3 }}
            />
          )}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            dot={dot}
            activeDot={activeDot ? { fill: strokeColor, r: 4 } : false}
            fill="url(#lineGradient)"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
