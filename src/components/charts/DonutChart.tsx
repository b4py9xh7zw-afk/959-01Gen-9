import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../../lib/utils';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DataPoint[];
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  className?: string;
  showTooltip?: boolean;
}

const DEFAULT_COLORS = ['#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899'];

export default function DonutChart({
  data,
  innerRadius = 60,
  outerRadius = 90,
  paddingAngle = 2,
  className,
  showTooltip = true,
}: DonutChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={cn('w-full h-full relative', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#F1F5F9',
              }}
              formatter={(value: number) => [`${value}`, '数量']}
            />
          )}
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-text-primary">{total}</span>
        <span className="text-sm text-text-muted">总计</span>
      </div>
    </div>
  );
}
