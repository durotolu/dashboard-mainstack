import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useUser, useWallet, useTransactions } from '../useApi';
import { apiService } from '../../services/api';
import { ApiError } from '../../types/api';
import type { User, Wallet, Transaction } from '../../types/api';

// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    getUser: vi.fn(),
    getWallet: vi.fn(),
    getTransactions: vi.fn(),
  },
}));

const mockApiService = vi.mocked(apiService);

describe('useApi hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useUser', () => {
    const mockUser: User = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
    };

    it('should return loading state initially', () => {
      mockApiService.getUser.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useUser());

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.refetch).toBe('function');
    });

    it('should fetch user data successfully', async () => {
      mockApiService.getUser.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockUser);
      expect(result.current.error).toBeNull();
      expect(mockApiService.getUser).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to fetch user';
      mockApiService.getUser.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe(errorMessage);
    });

    it('should handle ApiError instances', async () => {
      const apiError = new ApiError('User not found', 404);
      mockApiService.getUser.mockRejectedValue(apiError);

      const { result } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('User not found');
    });

    it('should handle unknown errors', async () => {
      mockApiService.getUser.mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('An unknown error occurred');
    });

    it('should refetch data when refetch is called', async () => {
      mockApiService.getUser.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockApiService.getUser).toHaveBeenCalledTimes(1);

      // Call refetch
      await act(async () => {
        await result.current.refetch();
      });

      expect(mockApiService.getUser).toHaveBeenCalledTimes(2);
      expect(result.current.data).toEqual(mockUser);
    });

    it('should handle refetch errors', async () => {
      mockApiService.getUser.mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockUser);
      expect(result.current.error).toBeNull();

      // Mock error for refetch
      const errorMessage = 'Refetch failed';
      mockApiService.getUser.mockRejectedValueOnce(new Error(errorMessage));

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });

      // Data should remain from previous successful fetch (hook doesn't clear data on error)
      expect(result.current.data).toEqual(mockUser);
    });
  });

  describe('useWallet', () => {
    const mockWallet: Wallet = {
      balance: 5000.50,
      total_payout: 15000.75,
      total_revenue: 25000.25,
      pending_payout: 1500.00,
      ledger_balance: 3500.25,
    };

    it('should return loading state initially', () => {
      mockApiService.getWallet.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useWallet());

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.refetch).toBe('function');
    });

    it('should fetch wallet data successfully', async () => {
      mockApiService.getWallet.mockResolvedValue(mockWallet);

      const { result } = renderHook(() => useWallet());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockWallet);
      expect(result.current.error).toBeNull();
      expect(mockApiService.getWallet).toHaveBeenCalledTimes(1);
    });

    it('should handle wallet fetch errors', async () => {
      const errorMessage = 'Failed to fetch wallet';
      mockApiService.getWallet.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useWallet());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe(errorMessage);
    });

    it('should handle wallet data with zero values', async () => {
      const zeroWallet: Wallet = {
        balance: 0,
        total_payout: 0,
        total_revenue: 0,
        pending_payout: 0,
        ledger_balance: 0,
      };
      mockApiService.getWallet.mockResolvedValue(zeroWallet);

      const { result } = renderHook(() => useWallet());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(zeroWallet);
      expect(result.current.error).toBeNull();
    });
  });

  describe('useTransactions', () => {
    const mockTransactions: Transaction[] = [
      {
        amount: 1000,
        date: '2024-01-01T10:00:00Z',
        type: 'deposit',
        status: 'successful',
        payment_reference: 'ref123',
        metadata: {
          name: 'John Doe',
          type: 'payment',
          email: 'john@example.com',
          quantity: 1,
          country: 'US',
          product_name: 'Test Product',
        },
      },
      {
        amount: 500,
        date: '2024-01-02T15:30:00Z',
        type: 'withdrawal',
        status: 'pending',
      },
    ];

    it('should return loading state initially', () => {
      mockApiService.getTransactions.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useTransactions());

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.refetch).toBe('function');
    });

    it('should fetch transactions data successfully', async () => {
      mockApiService.getTransactions.mockResolvedValue(mockTransactions);

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockTransactions);
      expect(result.current.error).toBeNull();
      expect(mockApiService.getTransactions).toHaveBeenCalledTimes(1);
    });

    it('should handle empty transactions array', async () => {
      mockApiService.getTransactions.mockResolvedValue([]);

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should handle transactions fetch errors', async () => {
      const errorMessage = 'Failed to fetch transactions';
      mockApiService.getTransactions.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe(errorMessage);
    });

    it('should handle transactions with minimal data', async () => {
      const minimalTransactions: Transaction[] = [
        {
          amount: 100,
          date: '2024-01-01T00:00:00Z',
          type: 'deposit',
          status: 'successful',
        },
      ];
      mockApiService.getTransactions.mockResolvedValue(minimalTransactions);

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(minimalTransactions);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Hook state transitions', () => {
    it('should transition from loading to success state', async () => {
      const mockUser: User = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
      };

      mockApiService.getUser.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useUser());

      // Initial loading state
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();

      // Wait for success state
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockUser);
      expect(result.current.error).toBeNull();
    });

    it('should transition from loading to error state', async () => {
      const errorMessage = 'Network error';
      mockApiService.getUser.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useUser());

      // Initial loading state
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();

      // Wait for error state
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe(errorMessage);
    });

    it('should reset to loading state when refetching', async () => {
      const mockUser: User = {
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob.johnson@example.com',
      };

      mockApiService.getUser.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockUser);

      // Trigger refetch and wait for loading state to be set
      let refetchPromise: Promise<void>;
      act(() => {
        refetchPromise = result.current.refetch();
      });

      // Wait for loading state to be updated
      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      expect(result.current.error).toBeNull();

      await act(async () => {
        await refetchPromise!;
      });

      // Should return to success state
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.data).toEqual(mockUser);
    });
  });
});
