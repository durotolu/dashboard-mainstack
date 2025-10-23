import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import './RevenueChart.css';

// Mock data for the chart since API doesn't provide chart data
const mockChartData = [
  { date: 'Apr 1', value: 20000 },
  { date: 'Apr 5', value: 35000 },
  { date: 'Apr 10', value: 25000 },
  { date: 'Apr 15', value: 45000 },
  { date: 'Apr 20', value: 30000 },
  { date: 'Apr 25', value: 50000 },
  { date: 'Apr 30', value: 40000 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="revenue-chart">
      <div className="revenue-chart__container">
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                interval="preserveStartEnd"
              />
              <YAxis hide />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ff5722"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#ff5722' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-labels">
          <div className="chart-label chart-label--start">
            <span className="chart-label__date">Apr 1, 2022</span>
          </div>
          <div className="chart-label chart-label--end">
            <span className="chart-label__date">Apr 30, 2022</span>
          </div>
        </div>
      </div>
    </div>
  );
};
