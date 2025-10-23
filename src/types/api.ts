// API Response Types based on actual API responses

export interface User {
  first_name: string;
  last_name: string;
  email: string;
}

export interface Wallet {
  balance: number;
  total_payout: number;
  total_revenue: number;
  pending_payout: number;
  ledger_balance: number;
}

export interface TransactionMetadata {
  name: string;
  type: string;
  email: string;
  quantity: number;
  country: string;
  product_name?: string;
}

export interface Transaction {
  amount: number;
  metadata?: TransactionMetadata;
  payment_reference?: string;
  status: 'successful' | 'pending' | 'failed';
  type: 'deposit' | 'withdrawal';
  date: string;
}

// Filter types for transaction filtering
export interface TransactionFilters {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  transactionTypes: string[];
  transactionStatuses: string[];
}

// API Error class
export class ApiError extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Loading state type
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
