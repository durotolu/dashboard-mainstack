import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionList } from '../TransactionList';
import * as useApiHook from '../../hooks/useApi';
import type { Transaction } from '../../types/api';

// Mock the useTransactions hook
vi.mock('../../hooks/useApi', () => ({
  useTransactions: vi.fn(),
}));

// Mock the FilterSidebar component
vi.mock('../FilterSidebar', () => ({
  FilterSidebar: ({ isOpen, onClose }: any) => (
    <div data-testid="filter-sidebar" data-open={isOpen}>
      <button onClick={onClose}>Close Filter</button>
    </div>
  ),
}));

const mockTransactions: Transaction[] = [
  {
    amount: 500,
    date: '2024-01-02T15:30:00Z',
    type: 'withdrawal',
    status: 'pending',
    payment_reference: 'ref456',
  },
];

describe('TransactionList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should render loading state when data is loading', () => {
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: vi.fn(),
      });

      render(<TransactionList />);

      expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
      expect(screen.queryByText('Transactions')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('should render error state when there is an error', () => {
      const errorMessage = 'Failed to fetch transactions';
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: null,
        loading: false,
        error: errorMessage,
        refetch: vi.fn(),
      });

      render(<TransactionList />);

      expect(screen.getByText(`Failed to load transactions: ${errorMessage}`)).toBeInTheDocument();
      expect(screen.queryByText('Transactions')).not.toBeInTheDocument();
    });
  });

  describe('Success state', () => {
    beforeEach(() => {
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should render transaction list with correct count', () => {
      render(<TransactionList />);

      expect(screen.getByText('1 Transactions')).toBeInTheDocument();
      expect(screen.getByText('Your transactions for the last 7 days')).toBeInTheDocument();
    });

    it('should render filter and export buttons', () => {
      render(<TransactionList />);

      expect(screen.getByText('Filter')).toBeInTheDocument();
      expect(screen.getByText('Export list')).toBeInTheDocument();
    });

    it('should render transaction details', () => {
      render(<TransactionList />);

      expect(screen.getByText('Cash withdrawal')).toBeInTheDocument();
      expect(screen.getByText('USD 500')).toBeInTheDocument();
    });

    it('should display transaction date correctly', () => {
      render(<TransactionList />);

      expect(screen.getByText('Jan 02, 2024')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should render empty state when no transactions', () => {
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: [],
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<TransactionList />);

      expect(screen.getByText('0 Transactions')).toBeInTheDocument();
      expect(screen.getByText('No matching transaction found for the selected filter')).toBeInTheDocument();
      expect(screen.getByText('Change your filters to see more results, or add a new product.')).toBeInTheDocument();
    });
  });

  describe('Filter functionality', () => {
    beforeEach(() => {
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should open filter sidebar when filter button is clicked', async () => {
      render(<TransactionList />);

      const filterButton = screen.getByText('Filter');
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(screen.getByTestId('filter-sidebar')).toHaveAttribute('data-open', 'true');
      });
    });

    it('should close filter sidebar when close button is clicked', async () => {
      render(<TransactionList />);

      const filterButton = screen.getByText('Filter');
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(screen.getByTestId('filter-sidebar')).toHaveAttribute('data-open', 'true');
      });

      const closeButton = screen.getByText('Close Filter');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.getByTestId('filter-sidebar')).toHaveAttribute('data-open', 'false');
      });
    });
  });

  describe('User interactions', () => {
    beforeEach(() => {
      vi.mocked(useApiHook.useTransactions).mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should handle export button click', () => {
      render(<TransactionList />);

      const exportButton = screen.getByText('Export list');

      // Should not throw error when clicked
      expect(() => fireEvent.click(exportButton)).not.toThrow();
    });
  });
});
