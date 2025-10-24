import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RevenueChart } from './RevenueChart';
import * as useApiHook from '../hooks/useApi';
import type { Transaction } from '../types/api';
import React from 'react';

// Mock the useTransactions hook
vi.mock('../hooks/useApi', () => ({
  useTransactions: vi.fn()
}));

// Mock recharts components
vi.mock('recharts', () => ({
  LineChart: ({ children, data }: { children: React.ReactNode; data: unknown }) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  )
}));

const mockTransactions: Transaction[] = [
  {
    amount: 1000,
    date: '2024-01-01T10:00:00Z',
    type: 'deposit',
    status: 'successful'
  },
  {
    amount: 2000,
    date: '2024-01-02T10:00:00Z',
    type: 'deposit',
    status: 'successful'
  },
  {
    amount: 1500,
    date: '2024-01-01T15:00:00Z',
    type: 'deposit',
    status: 'successful'
  },
  {
    amount: 500,
    date: '2024-01-03T10:00:00Z',
    type: 'withdrawal',
    status: 'successful'
  },
  {
    amount: 800,
    date: '2024-01-04T10:00:00Z',
    type: 'deposit',
    status: 'failed'
  }
];

describe('RevenueChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when data is loading', () => {
    vi.mocked(useApiHook.useTransactions).mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn()
    });

    render(<RevenueChart />);
    
    expect(screen.getByText('Loading revenue data...')).toBeInTheDocument();
  });

  it('renders error state when there is an error', () => {
    const errorMessage = 'Failed to fetch data';
    vi.mocked(useApiHook.useTransactions).mockReturnValue({
      data: null,
      loading: false,
      error: errorMessage,
      refetch: vi.fn()
    });

    render(<RevenueChart />);
    
    expect(screen.getByText(`Failed to load revenue data: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders empty state when no transactions are available', () => {
    vi.mocked(useApiHook.useTransactions).mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<RevenueChart />);
    
    expect(screen.getByText('No revenue data available')).toBeInTheDocument();
  });

  it('renders empty state when no successful deposit transactions are available', () => {
    const nonRevenueTransactions: Transaction[] = [
      {
        amount: 500,
        date: '2024-01-03T10:00:00Z',
        type: 'withdrawal',
        status: 'successful'
      },
      {
        amount: 800,
        date: '2024-01-04T10:00:00Z',
        type: 'deposit',
        status: 'failed'
      }
    ];

    vi.mocked(useApiHook.useTransactions).mockReturnValue({
      data: nonRevenueTransactions,
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<RevenueChart />);
    
    expect(screen.getByText('No revenue data available')).toBeInTheDocument();
  });

  it('renders chart with correct data when transactions are available', () => {
    vi.mocked(useApiHook.useTransactions).mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<RevenueChart />);
    
    // Check that chart components are rendered
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();

    // Check that chart labels are rendered
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 2, 2024')).toBeInTheDocument();
  });

  it('filters and aggregates data correctly', () => {
    vi.mocked(useApiHook.useTransactions).mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<RevenueChart />);
    
    const chartElement = screen.getByTestId('line-chart');
    const chartData = JSON.parse(chartElement.getAttribute('data-chart-data') || '[]');
    
    // Should have 2 data points (Jan 1 and Jan 2)
    // Jan 1: 1000 + 1500 = 2500 (two successful deposits)
    // Jan 2: 2000 (one successful deposit)
    // Jan 3: withdrawal should be excluded
    // Jan 4: failed deposit should be excluded
    expect(chartData).toHaveLength(2);
    
    // Check aggregated amounts
    const jan1Data = chartData.find((point: { date: string; value: number }) => point.date === 'Jan 1');
    const jan2Data = chartData.find((point: { date: string; value: number }) => point.date === 'Jan 2');
    
    expect(jan1Data?.value).toBe(2500);
    expect(jan2Data?.value).toBe(2000);
  });

  it('sorts data points by date correctly', () => {
    const unsortedTransactions: Transaction[] = [
      {
        amount: 2000,
        date: '2024-01-03T10:00:00Z',
        type: 'deposit',
        status: 'successful'
      },
      {
        amount: 1000,
        date: '2024-01-01T10:00:00Z',
        type: 'deposit',
        status: 'successful'
      },
      {
        amount: 1500,
        date: '2024-01-02T10:00:00Z',
        type: 'deposit',
        status: 'successful'
      }
    ];

    vi.mocked(useApiHook.useTransactions).mockReturnValue({
      data: unsortedTransactions,
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<RevenueChart />);
    
    const chartElement = screen.getByTestId('line-chart');
    const chartData = JSON.parse(chartElement.getAttribute('data-chart-data') || '[]');
    
    // Should be sorted by date
    expect(chartData[0].date).toBe('Jan 1');
    expect(chartData[1].date).toBe('Jan 2');
    expect(chartData[2].date).toBe('Jan 3');
  });
});
