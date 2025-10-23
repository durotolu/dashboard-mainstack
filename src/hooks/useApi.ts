import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { User, Wallet, Transaction, LoadingState } from '../types/api';

// Generic hook for API calls
function useApiCall<T>(apiCall: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      setLoading({ isLoading: true, error: null });
      const result = await apiCall();
      setData(result);
      setLoading({ isLoading: false, error: null });
    } catch (error) {
      setLoading({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading: loading.isLoading,
    error: loading.error,
    refetch: fetchData,
  };
}

// Specific hooks for each API endpoint
export function useUser() {
  return useApiCall<User>(() => apiService.getUser());
}

export function useWallet() {
  return useApiCall<Wallet>(() => apiService.getWallet());
}

export function useTransactions() {
  return useApiCall<Transaction[]>(() => apiService.getTransactions());
}
