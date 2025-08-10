import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressChartProps {
  data: { date: string; value: number; goal?: number }[];
  title: string;
  unit: string;
  color: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, title, unit, color }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.goal || 0)));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const trend = currentValue - previousValue;

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trend > 0 ? '+' : ''}{trend} {unit}
          </span>
        </div>
      </div>
      
      <div className="relative h-32 mb-4">
        <svg className="w-full h-full" viewBox="0 0 400 120">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y * 1.2}
              x2="400"
              y2={y * 1.2}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Goal line */}
          {data[0]?.goal && (
            <line
              x1="0"
              y1={120 - ((data[0].goal - minValue) / range) * 120}
              x2="400"
              y2={120 - ((data[0].goal - minValue) / range) * 120}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.7"
            />
          )}
          
          {/* Data line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 400;
              const y = 120 - ((point.value - minValue) / range) * 120;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 400;
            const y = 120 - ((point.value - minValue) / range) * 120;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{data[0]?.date}</span>
        <span className="font-medium text-gray-900">
          {currentValue} {unit}
        </span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
};