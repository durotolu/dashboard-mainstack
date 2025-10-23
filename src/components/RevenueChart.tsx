import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useTransactions } from '../hooks/useApi';
import { Loading } from './ui/Loading';
import type { Transaction } from '../types/api';
import './RevenueChart.css';

interface ChartDataPoint {
  date: string;
  value: number;
  originalDate: Date;
}

const formatChartDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM d');
  } catch {
    return dateString;
  }
};

const formatLabelDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
};

export const RevenueChart: React.FC = () => {
  const { data: transactions, loading, error } = useTransactions();

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // Filter for successful deposit transactions only (revenue)
    const revenueTransactions = transactions.filter(
      (transaction: Transaction) =>
        transaction.status === 'successful' &&
        transaction.type === 'deposit'
    );

    if (revenueTransactions.length === 0) return [];

    // Group transactions by date and sum amounts
    const dailyRevenue = revenueTransactions.reduce((acc: Record<string, number>, transaction: Transaction) => {
      const dateKey = transaction.date.split('T')[0]; // Get YYYY-MM-DD part
      acc[dateKey] = (acc[dateKey] || 0) + transaction.amount;
      return acc;
    }, {});

    // Convert to chart data format and sort by date
    const chartPoints: ChartDataPoint[] = Object.entries(dailyRevenue)
      .map(([dateKey, amount]) => ({
        date: formatChartDate(dateKey),
        value: amount,
        originalDate: new Date(dateKey)
      }))
      .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime());

    return chartPoints;
  }, [transactions]);

  const dateRange = useMemo(() => {
    if (chartData.length === 0) return { start: '', end: '' };

    const sortedDates = chartData.map(point => point.originalDate).sort((a, b) => a.getTime() - b.getTime());
    return {
      start: formatLabelDate(sortedDates[0].toISOString()),
      end: formatLabelDate(sortedDates[sortedDates.length - 1].toISOString())
    };
  }, [chartData]);

  if (loading) {
    return (
      <div className="revenue-chart">
        <div className="revenue-chart__container">
          <Loading size="medium" text="Loading revenue data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="revenue-chart">
        <div className="revenue-chart__container">
          <div className="error-message">
            <p>Failed to load revenue data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="revenue-chart">
        <div className="revenue-chart__container">
          <div className="empty-state">
            <p>No revenue data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="revenue-chart">
      <div className="revenue-chart__container">
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
            <span className="chart-label__date">{dateRange.start}</span>
          </div>
          <div className="chart-label chart-label--end">
            <span className="chart-label__date">{dateRange.end}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
