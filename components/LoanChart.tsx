import React from 'react';
import { AmortizationDataPoint } from '../types';
import { formatCurrency } from '../utils/currency';

interface LoanChartProps {
  data: AmortizationDataPoint[];
}

const LoanChart: React.FC<LoanChartProps> = ({ data }) => {
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 60, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dates = data.map(d => new Date(d.date + 'T00:00:00'));
  const minDate = Math.min(...dates.map(d => d.getTime()));
  const maxDate = Math.max(...dates.map(d => d.getTime()));

  const maxTotalPaid = Math.max(...data.map(d => d.totalPaid));

  const xScale = (date: Date) => {
    if (maxDate === minDate) return 0;
    return ((date.getTime() - minDate) / (maxDate - minDate)) * innerWidth;
  };

  const yScale = (amount: number) => {
    if (maxTotalPaid === 0) return innerHeight;
    return innerHeight - (amount / maxTotalPaid) * innerHeight;
  };
  
  const createAreaPath = (points: [number, number][]) => {
    return "M" + points.map(p => `${p[0]},${p[1]}`).join(" L ");
  };

  const totalPaidAreaPoints = data.map((d): [number, number] => [xScale(new Date(d.date + 'T00:00:00')), yScale(d.totalPaid)]);
  const principalPaidAreaPoints = data.map((d): [number, number] => [xScale(new Date(d.date + 'T00:00:00')), yScale(d.principalPaid)]);

  const totalPaidPath = `${createAreaPath(totalPaidAreaPoints)} L ${innerWidth},${innerHeight} L 0,${innerHeight} Z`;
  const principalPaidPath = `${createAreaPath(principalPaidAreaPoints)} L ${innerWidth},${innerHeight} L 0,${innerHeight} Z`;

  // Ticks generation
  const yTicks = [];
  const numYTicks = 5;
  if (maxTotalPaid > 0) {
    for (let i = 0; i <= numYTicks; i++) {
        const value = (maxTotalPaid / numYTicks) * i;
        yTicks.push({ value, y: yScale(value) });
    }
  }

  const xTicks = [];
  const numXTicks = Math.min(5, data.length -1);
  if (data.length > 1 && maxDate > minDate) {
      for (let i = 0; i <= numXTicks; i++) {
          const timestamp = minDate + ( (maxDate - minDate) / numXTicks ) * i;
          const date = new Date(timestamp);
          xTicks.push({
              value: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              x: xScale(date)
          });
      }
  }


  return (
    <div>
       <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-labelledby="chart-title" role="img">
        <title id="chart-title">Loan Payment Breakdown Chart</title>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {yTicks.map(({ y }, i) => (
            <line
              key={i}
              x1="0"
              x2={innerWidth}
              y1={y}
              y2={y}
              stroke="currentColor"
              className="text-gray-700"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}

          {/* Areas */}
          <path d={totalPaidPath} fill="url(#interestGradient)" />
          <path d={principalPaidPath} fill="url(#principalGradient)" />
          
           <defs>
            <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
            </linearGradient>
            <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Lines */}
           <path d={createAreaPath(totalPaidAreaPoints)} fill="none" stroke="#14b8a6" strokeWidth="2" />
           <path d={createAreaPath(principalPaidAreaPoints)} fill="none" stroke="#3b82f6" strokeWidth="2" />

          {/* Axes */}
          <line x1="0" y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="currentColor" className="text-gray-600" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2={innerHeight} stroke="currentColor" className="text-gray-600" strokeWidth="1" />
          
          {/* Y-axis Ticks */}
          {yTicks.map(({ value, y }, i) => (
            <g key={i} transform={`translate(0, ${y})`}>
              <text
                x="-10"
                dy="0.32em"
                textAnchor="end"
                className="text-xs fill-current text-gray-400"
              >
                {formatCurrency(value)}
              </text>
            </g>
          ))}
          
          {/* X-axis Ticks */}
          {xTicks.map(({ value, x }, i) => (
            <g key={i} transform={`translate(${x}, ${innerHeight})`}>
              <text
                y="20"
                textAnchor="middle"
                className="text-xs fill-current text-gray-400"
              >
                {value}
              </text>
            </g>
          ))}
            {/* Axis Labels */}
            <text 
                transform={`translate(-55, ${innerHeight / 2}) rotate(-90)`}
                textAnchor="middle"
                className="text-sm fill-current text-gray-300 font-medium"
            >
                Amount Paid
            </text>
             <text 
                transform={`translate(${innerWidth / 2}, ${innerHeight + 45})`}
                textAnchor="middle"
                className="text-sm fill-current text-gray-300 font-medium"
            >
                Date
            </text>
        </g>
      </svg>
      <div className="flex justify-center items-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-gray-300">Principal Paid</span>
        </div>
        <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-teal-500"></span>
            <span className="text-gray-300">Interest Paid</span>
        </div>
      </div>
    </div>
  );
};

export default LoanChart;
