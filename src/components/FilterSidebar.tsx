import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from './ui/Button';
import type { Transaction, TransactionFilters } from '../types/api';
import 'react-datepicker/dist/react-datepicker.css';
import './FilterSidebar.css';

interface FilterSidebarProps {
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

const TRANSACTION_TYPES = ['deposit', 'withdrawal'];
const TRANSACTION_STATUSES = ['successful', 'pending', 'failed'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  transactions,
}) => {
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

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

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="filter-sidebar-backdrop" onClick={handleBackdropClick}>
      <div className={`filter-sidebar ${isOpen ? 'filter-sidebar--open' : ''}`}>
        <div className="filter-sidebar__header">
          <h2 className="filter-sidebar__title">Filter</h2>
          <button
            className="filter-sidebar__close"
            onClick={onClose}
            aria-label="Close filter"
          >
            ×
          </button>
        </div>

        <div className="filter-sidebar__content">
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
                  dateFormat="dd MMM yyyy"
                  className="date-picker-input"
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
                  dateFormat="dd MMM yyyy"
                  className="date-picker-input"
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

        <div className="filter-sidebar__actions">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};
