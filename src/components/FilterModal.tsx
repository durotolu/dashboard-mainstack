import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { Transaction, TransactionFilters } from '../types/api';
import 'react-datepicker/dist/react-datepicker.css';
import './FilterModal.css';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  transactions: Transaction[];
}

const QUICK_FILTERS = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'last7days' },
  { label: 'This month', value: 'thismonth' },
  { label: 'Last 3 months', value: 'last3months' },
];

const TRANSACTION_TYPES = [
  'Store Transactions',
  'Get Tipped',
  'Withdrawals',
  'Chargebacks',
  'Cashbacks',
  'Refer & Earn',
];

const TRANSACTION_STATUSES = [
  'Successful',
  'Pending',
  'Failed',
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  transactions: _transactions,
}) => {
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleQuickFilter = (value: string) => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (value) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'last7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        end = now;
        break;
      case 'thismonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = now;
        break;
      case 'last3months':
        start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        end = now;
        break;
    }

    setLocalFilters(prev => ({
      ...prev,
      dateRange: { start, end }
    }));
  };

  const handleTransactionTypeToggle = (type: string) => {
    setLocalFilters(prev => ({
      ...prev,
      transactionTypes: prev.transactionTypes.includes(type)
        ? prev.transactionTypes.filter(t => t !== type)
        : [...prev.transactionTypes, type]
    }));
  };

  const handleTransactionStatusToggle = (status: string) => {
    setLocalFilters(prev => ({
      ...prev,
      transactionStatuses: prev.transactionStatuses.includes(status)
        ? prev.transactionStatuses.filter(s => s !== status)
        : [...prev.transactionStatuses, status]
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: TransactionFilters = {
      dateRange: { start: null, end: null },
      transactionTypes: [],
      transactionStatuses: [],
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter" className="filter-modal">
      <div className="filter-modal__content">
        {/* Quick Filters */}
        <div className="filter-section">
          <div className="quick-filters">
            {QUICK_FILTERS.map(filter => (
              <button
                key={filter.value}
                className="quick-filter-btn"
                onClick={() => handleQuickFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="filter-section">
          <h3 className="filter-section__title">Date Range</h3>
          <div className="date-range">
            <div className="date-input">
              <DatePicker
                selected={localFilters.dateRange.start}
                onChange={(date) => setLocalFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: date }
                }))}
                placeholderText="17 Jul 2023"
                className="date-picker"
                dateFormat="dd MMM yyyy"
              />
            </div>
            <div className="date-input">
              <DatePicker
                selected={localFilters.dateRange.end}
                onChange={(date) => setLocalFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: date }
                }))}
                placeholderText="17 Aug 2023"
                className="date-picker"
                dateFormat="dd MMM yyyy"
              />
            </div>
          </div>
        </div>

        {/* Transaction Type */}
        <div className="filter-section">
          <h3 className="filter-section__title">Transaction Type</h3>
          <div className="checkbox-group">
            {TRANSACTION_TYPES.map(type => (
              <label key={type} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={localFilters.transactionTypes.includes(type)}
                  onChange={() => handleTransactionTypeToggle(type)}
                />
                <span className="checkbox-label">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Transaction Status */}
        <div className="filter-section">
          <h3 className="filter-section__title">Transaction Status</h3>
          <div className="checkbox-group">
            {TRANSACTION_STATUSES.map(status => (
              <label key={status} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={localFilters.transactionStatuses.includes(status)}
                  onChange={() => handleTransactionStatusToggle(status)}
                />
                <span className="checkbox-label">{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-modal__actions">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="primary" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </Modal>
  );
};
