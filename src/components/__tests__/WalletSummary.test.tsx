import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletSummary } from '../WalletSummary';
import * as useApiHook from '../../hooks/useApi';
import type { Wallet } from '../../types/api';

// Mock the useWallet hook
vi.mock('../../hooks/useApi', () => ({
  useWallet: vi.fn(),
  useTransactions: vi.fn(),
}));

// Mock the RevenueChart component
vi.mock('../RevenueChart', () => ({
  RevenueChart: () => <div data-testid="revenue-chart">Revenue Chart</div>,
}));

const mockWallet: Wallet = {
  balance: 5000.50,
  total_payout: 15000.75,
  total_revenue: 25000.25,
  pending_payout: 1500.00,
  ledger_balance: 3500.25,
};

describe('WalletSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should render loading state when data is loading', () => {
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: vi.fn(),
      });

      render(<WalletSummary />);

      expect(screen.getByText('Loading wallet data...')).toBeInTheDocument();
      expect(screen.queryByText('Available Balance')).not.toBeInTheDocument();
    });

    it('should show loading component with correct size and text', () => {
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: vi.fn(),
      });

      render(<WalletSummary />);

      const loadingElement = screen.getByText('Loading wallet data...');
      expect(loadingElement).toBeInTheDocument();
      
      // Check that the loading component is within the wallet-summary container
      const walletSummary = screen.getByText('Loading wallet data...').closest('.wallet-summary');
      expect(walletSummary).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('should render error state when there is an error', () => {
      const errorMessage = 'Failed to fetch wallet data';
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: null,
        loading: false,
        error: errorMessage,
        refetch: vi.fn(),
      });

      render(<WalletSummary />);

      expect(screen.getByText(`Failed to load wallet data: ${errorMessage}`)).toBeInTheDocument();
      expect(screen.queryByText('Available Balance')).not.toBeInTheDocument();
    });

    it('should render error message in correct container', () => {
      const errorMessage = 'Network error';
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: null,
        loading: false,
        error: errorMessage,
        refetch: vi.fn(),
      });

      render(<WalletSummary />);

      const errorElement = screen.getByText(`Failed to load wallet data: ${errorMessage}`);
      expect(errorElement).toBeInTheDocument();
      
      // Check that error is within the correct container
      const errorContainer = errorElement.closest('.error-message');
      expect(errorContainer).toBeInTheDocument();
    });
  });

  describe('Empty data state', () => {
    it('should return null when wallet data is null and not loading', () => {
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: null,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { container } = render(<WalletSummary />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Success state', () => {
    beforeEach(() => {
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: mockWallet,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should render wallet summary with all data when loaded successfully', () => {
      render(<WalletSummary />);

      // Check main balance
      expect(screen.getByText('Available Balance')).toBeInTheDocument();
      expect(screen.getByText('USD 5,000.50')).toBeInTheDocument();

      // Check stats
      expect(screen.getByText('Ledger Balance')).toBeInTheDocument();
      expect(screen.getByText('USD 3,500.25')).toBeInTheDocument();
      
      expect(screen.getByText('Total Payout')).toBeInTheDocument();
      expect(screen.getByText('USD 15,000.75')).toBeInTheDocument();
      
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('USD 25,000.25')).toBeInTheDocument();
      
      expect(screen.getByText('Pending Payout')).toBeInTheDocument();
      expect(screen.getByText('USD 1,500.00')).toBeInTheDocument();
    });

    it('should render withdraw button', () => {
      render(<WalletSummary />);

      const withdrawButton = screen.getByRole('button', { name: /withdraw/i });
      expect(withdrawButton).toBeInTheDocument();
      expect(withdrawButton).toHaveClass('btn--primary');
    });

    it('should render revenue chart', () => {
      render(<WalletSummary />);

      expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
    });

    it('should render info buttons for each stat', () => {
      render(<WalletSummary />);

      const infoButtons = screen.getAllByLabelText('More info');
      expect(infoButtons).toHaveLength(4); // One for each stat card
      
      infoButtons.forEach(button => {
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('should handle withdraw button click', () => {
      render(<WalletSummary />);

      const withdrawButton = screen.getByRole('button', { name: /withdraw/i });
      
      // Should not throw error when clicked
      expect(() => fireEvent.click(withdrawButton)).not.toThrow();
    });

    it('should handle info button clicks', () => {
      render(<WalletSummary />);

      const infoButtons = screen.getAllByLabelText('More info');
      
      infoButtons.forEach(button => {
        // Should not throw error when clicked
        expect(() => fireEvent.click(button)).not.toThrow();
      });
    });
  });

  describe('Currency formatting', () => {
    it('should format currency with decimals correctly', () => {
      const walletWithDecimals: Wallet = {
        balance: 1234.56,
        total_payout: 9876.54,
        total_revenue: 5555.55,
        pending_payout: 123.45,
        ledger_balance: 999.99,
      };

      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: walletWithDecimals,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<WalletSummary />);

      expect(screen.getByText('USD 1,234.56')).toBeInTheDocument();
      expect(screen.getByText('USD 9,876.54')).toBeInTheDocument();
      expect(screen.getByText('USD 5,555.55')).toBeInTheDocument();
      expect(screen.getByText('USD 123.45')).toBeInTheDocument();
      expect(screen.getByText('USD 999.99')).toBeInTheDocument();
    });

    it('should format currency without decimals for whole numbers', () => {
      const walletWholeNumbers: Wallet = {
        balance: 1000,
        total_payout: 5000,
        total_revenue: 10000,
        pending_payout: 2000,
        ledger_balance: 3000,
      };

      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: walletWholeNumbers,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<WalletSummary />);

      expect(screen.getByText('USD 1,000.00')).toBeInTheDocument();
      expect(screen.getByText('USD 5,000.00')).toBeInTheDocument();
      expect(screen.getByText('USD 10,000.00')).toBeInTheDocument();
      expect(screen.getByText('USD 2,000.00')).toBeInTheDocument();
      expect(screen.getByText('USD 3,000.00')).toBeInTheDocument();
    });

    it('should handle zero values correctly', () => {
      const zeroWallet: Wallet = {
        balance: 0,
        total_payout: 0,
        total_revenue: 0,
        pending_payout: 0,
        ledger_balance: 0,
      };

      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: zeroWallet,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<WalletSummary />);

      const zeroAmounts = screen.getAllByText('USD 0.00');
      expect(zeroAmounts).toHaveLength(5); // All 5 amounts should be zero
    });

    it('should handle large numbers correctly', () => {
      const largeWallet: Wallet = {
        balance: 1234567.89,
        total_payout: 9876543.21,
        total_revenue: 5555555.55,
        pending_payout: 1111111.11,
        ledger_balance: 2222222.22,
      };

      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: largeWallet,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<WalletSummary />);

      expect(screen.getByText('USD 1,234,567.89')).toBeInTheDocument();
      expect(screen.getByText('USD 9,876,543.21')).toBeInTheDocument();
      expect(screen.getByText('USD 5,555,555.55')).toBeInTheDocument();
      expect(screen.getByText('USD 1,111,111.11')).toBeInTheDocument();
      expect(screen.getByText('USD 2,222,222.22')).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    beforeEach(() => {
      vi.mocked(useApiHook.useWallet).mockReturnValue({
        data: mockWallet,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should have correct CSS classes', () => {
      render(<WalletSummary />);

      expect(document.querySelector('.wallet-summary')).toBeInTheDocument();
      expect(document.querySelector('.wallet-summary__main')).toBeInTheDocument();
      expect(document.querySelector('.wallet-summary__balance')).toBeInTheDocument();
      expect(document.querySelector('.wallet-summary__stats')).toBeInTheDocument();
      expect(document.querySelector('.balance-card--primary')).toBeInTheDocument();
    });

    it('should render all stat cards', () => {
      render(<WalletSummary />);

      const statCards = document.querySelectorAll('.stat-card');
      expect(statCards).toHaveLength(4);
    });

    it('should have proper accessibility attributes', () => {
      render(<WalletSummary />);

      const infoButtons = screen.getAllByLabelText('More info');
      infoButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label', 'More info');
      });

      const withdrawButton = screen.getByRole('button', { name: /withdraw/i });
      expect(withdrawButton).toBeInTheDocument();
    });
  });
});
