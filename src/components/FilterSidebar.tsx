import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from './ui/Button';
import type { TransactionFilters } from '../types/api';
import 'react-datepicker/dist/react-datepicker.css';
import './FilterSidebar.css';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

const QUICK_FILTERS = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'last7days' },
  { label: 'This month', value: 'thismonth' },
  { label: 'Last 3 months', value: 'last3months' },
  { label: 'Last 6 months', value: 'last6months' },
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

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
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
      case 'last6months':
        start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
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

  const formatSelectedValues = (values: string[]) => {
    if (values.length === 0) return '';
    if (values.length === 1) return values[0];
    return values.join(', ');
  };

  const hasFiltersChanged = () => {
    const dateChanged =
      localFilters.dateRange.start !== filters.dateRange.start ||
      localFilters.dateRange.end !== filters.dateRange.end;

    const typesChanged =
      localFilters.transactionTypes.length !== filters.transactionTypes.length ||
      !localFilters.transactionTypes.every(type => filters.transactionTypes.includes(type));

    const statusesChanged =
      localFilters.transactionStatuses.length !== filters.transactionStatuses.length ||
      !localFilters.transactionStatuses.every(status => filters.transactionStatuses.includes(status));

    return dateChanged || typesChanged || statusesChanged;
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
              <div className="date-input-wrapper">
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
                <svg
                  className="date-picker-arrow"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="date-input-wrapper">
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
                <svg
                  className="date-picker-arrow"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Transaction Type */}
          <div className="filter-section">
            <h3 className="filter-section__title">Transaction Type</h3>
            <div className="multi-select-dropdown" ref={typeDropdownRef}>
              <div
                className={`multi-select-input ${isTypeDropdownOpen ? 'multi-select-input--open' : ''}`}
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              >
                <span className={`multi-select-value ${localFilters.transactionTypes.length === 0 ? 'multi-select-value--placeholder' : ''}`}>
                  {formatSelectedValues(localFilters.transactionTypes) || 'Select transaction types'}
                </span>
                <svg
                  className={`multi-select-arrow ${isTypeDropdownOpen ? 'multi-select-arrow--open' : ''}`}
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {isTypeDropdownOpen && (
                <div className="multi-select-dropdown-menu">
                  {TRANSACTION_TYPES.map(type => (
                    <label key={type} className="multi-select-option">
                      <input
                        type="checkbox"
                        checked={localFilters.transactionTypes.includes(type)}
                        onChange={() => handleTransactionTypeToggle(type)}
                      />
                      <span className="multi-select-option-label">{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Transaction Status */}
          <div className="filter-section">
            <h3 className="filter-section__title">Transaction Status</h3>
            <div className="multi-select-dropdown" ref={statusDropdownRef}>
              <div
                className={`multi-select-input ${isStatusDropdownOpen ? 'multi-select-input--open' : ''}`}
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <span className={`multi-select-value ${localFilters.transactionStatuses.length === 0 ? 'multi-select-value--placeholder' : ''}`}>
                  {formatSelectedValues(localFilters.transactionStatuses) || 'Select transaction statuses'}
                </span>
                <svg
                  className={`multi-select-arrow ${isStatusDropdownOpen ? 'multi-select-arrow--open' : ''}`}
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {isStatusDropdownOpen && (
                <div className="multi-select-dropdown-menu">
                  {TRANSACTION_STATUSES.map(status => (
                    <label key={status} className="multi-select-option">
                      <input
                        type="checkbox"
                        checked={localFilters.transactionStatuses.includes(status)}
                        onChange={() => handleTransactionStatusToggle(status)}
                      />
                      <span className="multi-select-option-label">{status}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="filter-sidebar__actions">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!hasFiltersChanged()}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};
