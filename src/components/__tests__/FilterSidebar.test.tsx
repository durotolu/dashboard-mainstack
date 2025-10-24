import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FilterSidebar } from '../FilterSidebar';
import type { TransactionFilters } from '../../types/api';

// Mock react-datepicker
vi.mock('react-datepicker', () => ({
  default: ({ selected, onChange, placeholderText, ...props }: any) => (
    <input
      data-testid="date-picker"
      value={selected ? selected.toISOString().split('T')[0] : ''}
      onChange={(e) => {
        const date = e.target.value ? new Date(e.target.value) : null;
        onChange(date);
      }}
      placeholder={placeholderText}
      {...props}
    />
  ),
}));

const defaultFilters: TransactionFilters = {
  dateRange: { start: null, end: null },
  transactionTypes: [],
  transactionStatuses: [],
};

const mockProps = {
  isOpen: true,
  onClose: vi.fn(),
  filters: defaultFilters,
  onFiltersChange: vi.fn(),
};

describe('FilterSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<FilterSidebar {...mockProps} isOpen={false} />);
      
      expect(screen.queryByText('Filter')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<FilterSidebar {...mockProps} />);
      
      expect(screen.getByText('Filter')).toBeInTheDocument();
      expect(screen.getByLabelText('Close filter')).toBeInTheDocument();
    });

    it('should render all quick filter buttons', () => {
      render(<FilterSidebar {...mockProps} />);
      
      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Last 7 days')).toBeInTheDocument();
      expect(screen.getByText('This month')).toBeInTheDocument();
      expect(screen.getByText('Last 3 months')).toBeInTheDocument();
      expect(screen.getByText('Last 6 months')).toBeInTheDocument();
    });

    it('should render date pickers', () => {
      render(<FilterSidebar {...mockProps} />);
      
      const datePickers = screen.getAllByTestId('date-picker');
      expect(datePickers).toHaveLength(2);
    });

    it('should render transaction type and status dropdowns', () => {
      render(<FilterSidebar {...mockProps} />);
      
      expect(screen.getByText('Transaction Type')).toBeInTheDocument();
      expect(screen.getByText('Transaction Status')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<FilterSidebar {...mockProps} />);
      
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });
  });

  describe('Close functionality', () => {
    it('should call onClose when close button is clicked', () => {
      render(<FilterSidebar {...mockProps} />);
      
      const closeButton = screen.getByLabelText('Close filter');
      fireEvent.click(closeButton);
      
      expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      render(<FilterSidebar {...mockProps} />);
      
      const backdrop = document.querySelector('.filter-sidebar-backdrop');
      fireEvent.click(backdrop!);
      
      expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when sidebar content is clicked', () => {
      render(<FilterSidebar {...mockProps} />);
      
      const sidebar = document.querySelector('.filter-sidebar');
      fireEvent.click(sidebar!);
      
      expect(mockProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Quick filters', () => {
    it('should apply today filter', () => {
      render(<FilterSidebar {...mockProps} />);
      
      const todayButton = screen.getByText('Today');
      fireEvent.click(todayButton);
      
      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateRange: expect.objectContaining({
            start: expect.any(Date),
            end: expect.any(Date),
          }),
        })
      );
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('should apply last 7 days filter', () => {
      render(<FilterSidebar {...mockProps} />);
      
      const last7DaysButton = screen.getByText('Last 7 days');
      fireEvent.click(last7DaysButton);
      
      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateRange: expect.objectContaining({
            start: expect.any(Date),
            end: expect.any(Date),
          }),
        })
      );
    });

    it('should apply this month filter', () => {
      render(<FilterSidebar {...mockProps} />);
      
      const thisMonthButton = screen.getByText('This month');
      fireEvent.click(thisMonthButton);
      
      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateRange: expect.objectContaining({
            start: expect.any(Date),
            end: expect.any(Date),
          }),
        })
      );
    });
  });

  describe('Date picker functionality', () => {
    it('should update start date when first date picker changes', async () => {
      render(<FilterSidebar {...mockProps} />);
      
      const datePickers = screen.getAllByTestId('date-picker');
      const startDatePicker = datePickers[0];
      
      fireEvent.change(startDatePicker, { target: { value: '2024-01-01' } });
      
      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateRange: expect.objectContaining({
            start: expect.any(Date),
          }),
        })
      );
    });

    it('should update end date when second date picker changes', async () => {
      render(<FilterSidebar {...mockProps} />);
      
      const datePickers = screen.getAllByTestId('date-picker');
      const endDatePicker = datePickers[1];
      
      fireEvent.change(endDatePicker, { target: { value: '2024-01-31' } });
      
      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateRange: expect.objectContaining({
            end: expect.any(Date),
          }),
        })
      );
    });
  });

  describe('Transaction type filtering', () => {
    it('should open transaction type dropdown when clicked', async () => {
      render(<FilterSidebar {...mockProps} />);

      const typeDropdownInput = screen.getByText('Select transaction types');
      fireEvent.click(typeDropdownInput);

      await waitFor(() => {
        expect(screen.getByText('Store Transactions')).toBeInTheDocument();
        expect(screen.getByText('Get Tipped')).toBeInTheDocument();
        expect(screen.getByText('Withdrawal')).toBeInTheDocument();
        expect(screen.getByText('Chargebacks')).toBeInTheDocument();
        expect(screen.getByText('Cashbacks')).toBeInTheDocument();
        expect(screen.getByText('Refer & Earn')).toBeInTheDocument();
      });
    });

    it('should toggle transaction type selection', async () => {
      render(<FilterSidebar {...mockProps} />);

      const typeDropdownInput = screen.getByText('Select transaction types');
      fireEvent.click(typeDropdownInput);

      await waitFor(() => {
        const storeTransactionsOption = screen.getByText('Store Transactions');
        fireEvent.click(storeTransactionsOption);
      });

      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionTypes: ['Store Transactions'],
        })
      );
    });

    it('should allow multiple transaction type selections', async () => {
      render(<FilterSidebar {...mockProps} />);

      const typeDropdownInput = screen.getByText('Select transaction types');
      fireEvent.click(typeDropdownInput);

      await waitFor(() => {
        const storeTransactionsOption = screen.getByText('Store Transactions');
        const withdrawalOption = screen.getByText('Withdrawal');

        fireEvent.click(storeTransactionsOption);
        fireEvent.click(withdrawalOption);
      });

      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionTypes: expect.arrayContaining(['Store Transactions', 'Withdrawal']),
        })
      );
    });
  });

  describe('Transaction status filtering', () => {
    it('should open transaction status dropdown when clicked', async () => {
      render(<FilterSidebar {...mockProps} />);

      const statusDropdownInput = screen.getByText('Select transaction statuses');
      fireEvent.click(statusDropdownInput);

      await waitFor(() => {
        expect(screen.getByText('Successful')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Failed')).toBeInTheDocument();
      });
    });

    it('should toggle transaction status selection', async () => {
      render(<FilterSidebar {...mockProps} />);

      const statusDropdownInput = screen.getByText('Select transaction statuses');
      fireEvent.click(statusDropdownInput);

      await waitFor(() => {
        const successfulOption = screen.getByText('Successful');
        fireEvent.click(successfulOption);
      });

      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionStatuses: ['Successful'],
        })
      );
    });
  });

  describe('Clear functionality', () => {
    it('should clear all filters when clear button is clicked', () => {
      const filtersWithData: TransactionFilters = {
        dateRange: { start: new Date('2024-01-01'), end: new Date('2024-01-31') },
        transactionTypes: ['Store Transactions'],
        transactionStatuses: ['Successful'],
      };
      
      render(<FilterSidebar {...mockProps} filters={filtersWithData} />);
      
      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        dateRange: { start: null, end: null },
        transactionTypes: [],
        transactionStatuses: [],
      });
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Apply functionality', () => {
    it('should apply filters and close sidebar when changes are made', () => {
      render(<FilterSidebar {...mockProps} />);

      // Make a change first to enable the Apply button
      const todayButton = screen.getByText('Today');
      fireEvent.click(todayButton);

      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      expect(mockProps.onFiltersChange).toHaveBeenCalled();
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('should have disabled apply button when no changes are made', () => {
      render(<FilterSidebar {...mockProps} />);

      const applyButton = screen.getByText('Apply');
      expect(applyButton).toBeDisabled();
    });
  });
});
