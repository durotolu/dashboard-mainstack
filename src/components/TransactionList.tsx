import React, { useState, useMemo } from "react";
import { useTransactions } from "../hooks/useApi";
import type { Transaction, TransactionFilters } from "../types/api";
import { Button } from "./ui/Button";
import { Loading } from "./ui/Loading";
import { FilterModal } from "./FilterModal";
import { format } from "date-fns";
import "./TransactionList.css";

const formatCurrency = (amount: number): string => {
  const hasDecimals = amount % 1 !== 0;
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
    currencyDisplay: "code",
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return dateString;
  }
};

const getTransactionIcon = (transaction: Transaction) => {
  if (transaction.type === "withdrawal") {
    return (
      <div className="transaction-icon transaction-icon--withdrawal">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="24" r="24" fill="#F9E3E0" />
          <mask
            id="mask0_19139_258"
            maskUnits="userSpaceOnUse"
            x="14"
            y="14"
            width="20"
            height="20"
          >
            <rect x="14" y="14" width="20" height="20" fill="#C4C4C4" />
          </mask>
          <g mask="url(#mask0_19139_258)">
            <path
              d="M18.4998 30.0833L17.9165 29.5L27.9998 19.4167H21.9165V18.5833H29.4165V26.0833H28.5832V20L18.4998 30.0833Z"
              fill="#961100"
            />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className="transaction-icon transaction-icon--deposit">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24" cy="24" r="24" fill="#E3FCF2" />
        <mask
          id="mask0_19139_173"
          maskUnits="userSpaceOnUse"
          x="14"
          y="14"
          width="20"
          height="20"
        >
          <rect x="14" y="14" width="20" height="20" fill="#C4C4C4" />
        </mask>
        <g mask="url(#mask0_19139_173)">
          <path
            d="M18.75 29.25V21.75H19.5833V27.8333L29.6667 17.75L30.25 18.3333L20.1667 28.4167H26.25V29.25H18.75Z"
            fill="#075132"
          />
        </g>
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

    return transactions.filter((transaction) => {
      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const transactionDate = new Date(transaction.date);
        if (
          filters.dateRange.start &&
          transactionDate < filters.dateRange.start
        )
          return false;
        if (filters.dateRange.end && transactionDate > filters.dateRange.end)
          return false;
      }

      // Transaction type filter
      if (filters.transactionTypes.length > 0) {
        const transactionType = transaction.metadata?.type || transaction.type;
        if (!filters.transactionTypes.includes(transactionType)) return false;
      }

      // Transaction status filter
      if (filters.transactionStatuses.length > 0) {
        if (!filters.transactionStatuses.includes(transaction.status))
          return false;
      }

      return true;
    });
  }, [transactions, filters]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.transactionTypes.length > 0 ||
      filters.transactionStatuses.length > 0
    );
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
            className={hasActiveFilters ? "filter-active" : ""}
          >
            Filter
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_1_1413"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="20"
                height="20"
              >
                <rect width="20" height="20" fill="#C4C4C4" />
              </mask>
              <g mask="url(#mask0_1_1413)">
                <path
                  d="M9.99942 13.0211C9.8789 13.0211 9.76673 13.0019 9.66289 12.9634C9.55904 12.925 9.46032 12.8589 9.36674 12.7653L4.87252 8.27112C4.73405 8.13267 4.66322 7.95864 4.66002 7.74902C4.6568 7.53941 4.72763 7.36217 4.87252 7.2173C5.01738 7.07243 5.19302 7 5.39942 7C5.60582 7 5.78145 7.07243 5.92632 7.2173L9.99942 11.2904L14.0725 7.2173C14.211 7.07885 14.385 7.00802 14.5946 7.0048C14.8042 7.0016 14.9814 7.07243 15.1263 7.2173C15.2712 7.36217 15.3436 7.53781 15.3436 7.74422C15.3436 7.95062 15.2712 8.12626 15.1263 8.27112L10.6321 12.7653C10.5385 12.8589 10.4398 12.925 10.3359 12.9634C10.2321 13.0019 10.1199 13.0211 9.99942 13.0211Z"
                  fill="#131316"
                />
              </g>
            </svg>
            {hasActiveFilters && <span className="filter-badge">•</span>}
          </Button>
          <Button variant="outline">
            Export list
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_1_1419"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="20"
                height="20"
              >
                <rect width="20" height="20" fill="#C4C4C4" />
              </mask>
              <g mask="url(#mask0_1_1419)">
                <path
                  d="M10.0001 12.6875L7.04175 9.75L7.64591 9.14583L9.58341 11.0833V3.875H10.4167V11.0833L12.3542 9.14583L12.9584 9.75L10.0001 12.6875ZM5.52091 15.8333C5.13203 15.8333 4.80925 15.705 4.55258 15.4483C4.29536 15.1911 4.16675 14.8681 4.16675 14.4792V12.5H5.00008V14.4792C5.00008 14.6181 5.0523 14.7394 5.15675 14.8433C5.26064 14.9478 5.38203 15 5.52091 15H14.4792C14.6181 15 14.7395 14.9478 14.8434 14.8433C14.9479 14.7394 15.0001 14.6181 15.0001 14.4792V12.5H15.8334V14.4792C15.8334 14.8681 15.7051 15.1911 15.4484 15.4483C15.1912 15.705 14.8681 15.8333 14.4792 15.8333H5.52091Z"
                  fill="#131316"
                />
              </g>
            </svg>
          </Button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect
                x="8"
                y="12"
                width="32"
                height="24"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 20H32M16 28H24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h3>No matching transaction found</h3>
          <p>Change your filters to see more results, or add a new product.</p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  dateRange: { start: null, end: null },
                  transactionTypes: [],
                  transactionStatuses: [],
                })
              }
            >
              Clear Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="transaction-list__content">
          {filteredTransactions.map((transaction, index) => (
            <div
              key={transaction.payment_reference || index}
              className="transaction-item"
            >
              {getTransactionIcon(transaction)}
              <div className="transaction-item__content">
                <div className="transaction-item__main">
                  <h4 className="transaction-item__title">
                    {transaction.metadata?.product_name ||
                      (transaction.type === "withdrawal"
                        ? "Cash withdrawal"
                        : "Payment received")}
                  </h4>
                  <p className="transaction-item__subtitle">
                    {transaction.metadata?.name || getStatusBadge(transaction.status)}
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
