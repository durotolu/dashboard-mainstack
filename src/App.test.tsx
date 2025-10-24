import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as useApiHook from './hooks/useApi';
import type { User, Wallet, Transaction } from './types/api';

// Mock all the hooks
vi.mock('./hooks/useApi', () => ({
  useUser: vi.fn(),
  useWallet: vi.fn(),
  useTransactions: vi.fn(),
}));

// Mock the RevenueChart component to avoid chart rendering issues
vi.mock('./components/RevenueChart', () => ({
  RevenueChart: () => <div data-testid="revenue-chart">Revenue Chart</div>,
}));

const mockUser: User = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
};

const mockWallet: Wallet = {
  balance: 5000.50,
  total_payout: 15000.75,
  total_revenue: 25000.25,
  pending_payout: 1500.00,
  ledger_balance: 3500.25,
};

const mockTransactions: Transaction[] = [
  {
    amount: 500,
    date: '2024-01-02T15:30:00Z',
    type: 'withdrawal',
    status: 'pending',
    payment_reference: 'ref456',
  },
];

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Structure', () => {
    beforeEach(() => {
      // Mock successful API responses
      vi.mocked(useApiHook.useUser).mockReturnValue({
        data: mockUser,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: mockWallet,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('renders the main app structure', () => {
      render(<App />);
      
      const appContainer = document.querySelector('.app');
      expect(appContainer).toBeInTheDocument();
      
      const mainContent = document.querySelector('.main-content');
      expect(mainContent).toBeInTheDocument();
      
      const container = document.querySelector('.container');
      expect(container).toBeInTheDocument();
    });

    it('renders all main components', () => {
      render(<App />);
      
      // Header should be present
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      
      // WalletSummary should be present
      expect(screen.getByText('Available Balance')).toBeInTheDocument();
      
      // TransactionList should be present
      expect(screen.getByText('1 Transactions')).toBeInTheDocument();
    });

    it('has correct semantic HTML structure', () => {
      render(<App />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('main-content');
    });
  });

  describe('Loading States', () => {
    it('shows loading states when data is loading', () => {
      vi.mocked(useApiHook.useUser).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: vi.fn(),
      });

      render(<App />);
      
      expect(screen.getByText('Loading wallet data...')).toBeInTheDocument();
      expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
    });

    it('shows partial loading states', () => {
      vi.mocked(useApiHook.useUser).mockReturnValue({
        data: mockUser,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<App />);
      
      // Header should show user data
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      
      // Wallet should show loading
      expect(screen.getByText('Loading wallet data...')).toBeInTheDocument();
      
      // Transactions should show data
      expect(screen.getByText('1 Transactions')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('shows error states when API calls fail', () => {
      vi.mocked(useApiHook.useUser).mockReturnValue({
        data: null,
        loading: false,
        error: 'Failed to load user',
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: null,
        loading: false,
        error: 'Failed to load wallet',
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: null,
        loading: false,
        error: 'Failed to load transactions',
        refetch: vi.fn(),
      });

      render(<App />);
      
      expect(screen.getByText('Failed to load wallet data: Failed to load wallet')).toBeInTheDocument();
      expect(screen.getByText('Failed to load transactions: Failed to load transactions')).toBeInTheDocument();
    });

    it('shows partial error states', () => {
      vi.mocked(useApiHook.useUser).mockReturnValue({
        data: mockUser,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: null,
        loading: false,
        error: 'Wallet error',
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<App />);
      
      // Header should work
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      
      // Wallet should show error
      expect(screen.getByText('Failed to load wallet data: Wallet error')).toBeInTheDocument();
      
      // Transactions should work
      expect(screen.getByText('1 Transactions')).toBeInTheDocument();
    });
  });

  describe('Data Integration', () => {
    beforeEach(() => {
      vi.mocked(useApiHook.useUser).mockReturnValue({
        data: mockUser,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: mockWallet,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('displays header navigation correctly', () => {
      render(<App />);

      // Header navigation should be present
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('CRM')).toBeInTheDocument();
      expect(screen.getByText('Apps')).toBeInTheDocument();
    });

    it('displays wallet data correctly', () => {
      render(<App />);
      
      expect(screen.getByText('USD 5,000.50')).toBeInTheDocument(); // balance
      expect(screen.getByText('USD 3,500.25')).toBeInTheDocument(); // ledger balance
      expect(screen.getByText('USD 15,000.75')).toBeInTheDocument(); // total payout
      expect(screen.getByText('USD 25,000.25')).toBeInTheDocument(); // total revenue
      expect(screen.getByText('USD 1,500.00')).toBeInTheDocument(); // pending payout
    });

    it('displays transaction data correctly', () => {
      render(<App />);
      
      expect(screen.getByText('1 Transactions')).toBeInTheDocument();
      expect(screen.getByText('Cash withdrawal')).toBeInTheDocument();
      expect(screen.getByText('USD 500')).toBeInTheDocument();
    });

    it('shows revenue chart', () => {
      render(<App />);
      
      expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
    });
  });

  describe('Component Interactions', () => {
    beforeEach(() => {
      vi.mocked(useApiHook.useUser).mockReturnValue({
        data: mockUser,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: mockWallet,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('allows interaction with header components', () => {
      render(<App />);
      
      // Apps dropdown should be interactive
      const appsButton = screen.getByRole('button', { name: /apps/i });
      expect(appsButton).toBeInTheDocument();
    });

    it('allows interaction with wallet components', () => {
      render(<App />);
      
      // Withdraw button should be present
      const withdrawButton = screen.getByRole('button', { name: /withdraw/i });
      expect(withdrawButton).toBeInTheDocument();
    });

    it('allows interaction with transaction components', () => {
      render(<App />);
      
      // Filter and export buttons should be present
      expect(screen.getByText('Filter')).toBeInTheDocument();
      expect(screen.getByText('Export list')).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    beforeEach(() => {
      vi.mocked(useApiHook.useUser).mockReturnValue({
        data: mockUser,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: mockWallet,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('has responsive container structure', () => {
      render(<App />);
      
      const container = document.querySelector('.container');
      expect(container).toBeInTheDocument();
      
      // Should contain both wallet and transaction components
      const walletSummary = container?.querySelector('.wallet-summary');
      const transactionList = container?.querySelector('.transaction-list');
      
      expect(walletSummary).toBeInTheDocument();
      expect(transactionList).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders without performance issues', async () => {
      vi.mocked(useApiHook.useUser).mockReturnValue({
        data: mockUser,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: mockWallet,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      const startTime = performance.now();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Available Balance')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within reasonable time (less than 100ms)
      expect(renderTime).toBeLessThan(100);
    });
  });
});
