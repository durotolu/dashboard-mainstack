import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useApi';
import type { Transaction, TransactionFilters } from '../types/api';
import { Button } from './ui/Button';
import { Loading } from './ui/Loading';
import { FilterModal } from './FilterModal';
import { format } from 'date-fns';
import './TransactionList.css';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

const getTransactionIcon = (transaction: Transaction) => {
  if (transaction.type === 'withdrawal') {
    return (
      <div className="transaction-icon transaction-icon--withdrawal">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2V14M3 9L8 14L13 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }
  
  return (
    <div className="transaction-icon transaction-icon--deposit">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 14V2M13 7L8 2L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

const getStatusBadge = (status: string) => {
  const statusClass = `status-badge status-badge--${status}`;
  return <span className={statusClass}>{status}</span>;
};

export const TransactionList: React.FC = () => {
  const { data: transactions, loading, error } = useTransactions();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: { start: null, end: null },
    transactionTypes: [],
    transactionStatuses: [],
  });

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    
    return transactions.filter(transaction => {
      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const transactionDate = new Date(transaction.date);
        if (filters.dateRange.start && transactionDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && transactionDate > filters.dateRange.end) return false;
      }
      
      // Transaction type filter
      if (filters.transactionTypes.length > 0) {
        const transactionType = transaction.metadata?.type || transaction.type;
        if (!filters.transactionTypes.includes(transactionType)) return false;
      }
      
      // Transaction status filter
      if (filters.transactionStatuses.length > 0) {
        if (!filters.transactionStatuses.includes(transaction.status)) return false;
      }
      
      return true;
    });
  }, [transactions, filters]);

  const hasActiveFilters = useMemo(() => {
    return filters.dateRange.start || filters.dateRange.end || 
           filters.transactionTypes.length > 0 || 
           filters.transactionStatuses.length > 0;
  }, [filters]);

  if (loading) {
    return (
      <div className="transaction-list">
        <Loading size="large" text="Loading transactions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-list">
        <div className="error-message">
          <p>Failed to load transactions: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="transaction-list__header">
        <div className="transaction-list__title">
          <h2>{filteredTransactions.length} Transactions</h2>
          <p>Your transactions for the last 7 days</p>
        </div>
        <div className="transaction-list__actions">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className={hasActiveFilters ? 'filter-active' : ''}
          >
            Filter
            {hasActiveFilters && <span className="filter-badge">•</span>}
          </Button>
          <Button variant="outline">
            Export list
          </Button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 20H32M16 28H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>No matching transaction found</h3>
          <p>Change your filters to see more results, or add a new product.</p>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={() => setFilters({
                dateRange: { start: null, end: null },
                transactionTypes: [],
                transactionStatuses: [],
              })}
            >
              Clear Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="transaction-list__content">
          {filteredTransactions.map((transaction, index) => (
            <div key={transaction.payment_reference || index} className="transaction-item">
              {getTransactionIcon(transaction)}
              <div className="transaction-item__content">
                <div className="transaction-item__main">
                  <h4 className="transaction-item__title">
                    {transaction.metadata?.product_name || 
                     (transaction.type === 'withdrawal' ? 'Cash withdrawal' : 'Payment received')}
                  </h4>
                  <p className="transaction-item__subtitle">
                    {transaction.metadata?.name || 'Unknown'}
                  </p>
                </div>
                <div className="transaction-item__meta">
                  <span className="transaction-item__amount">
                    {formatCurrency(transaction.amount)}
                  </span>
                  <span className="transaction-item__date">
                    {formatDate(transaction.date)}
                  </span>
                </div>
              </div>
              <div className="transaction-item__status">
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          ))}
        </div>
      )}

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        transactions={transactions || []}
      />
    </div>
  );
};
