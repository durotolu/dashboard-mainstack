import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiService } from '../api';
import { ApiError } from '../../types/api';
import type { User, Wallet, Transaction } from '../../types/api';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchWithErrorHandling', () => {
    it('should make successful API calls with correct headers', async () => {
      const mockData = { test: 'data' };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.getUser();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://fe-task-api.mainstack.io/user',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should throw ApiError for HTTP errors', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.getUser()).rejects.toThrow(ApiError);
      await expect(apiService.getUser()).rejects.toThrow('HTTP error! status: 404');
      
      try {
        await apiService.getUser();
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
      }
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(apiService.getUser()).rejects.toThrow(ApiError);
      await expect(apiService.getUser()).rejects.toThrow('Network error');
      
      try {
        await apiService.getUser();
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(0);
      }
    });

    it('should handle unknown errors', async () => {
      mockFetch.mockRejectedValue('Unknown error');

      await expect(apiService.getUser()).rejects.toThrow(ApiError);
      await expect(apiService.getUser()).rejects.toThrow('An unknown error occurred');
      
      try {
        await apiService.getUser();
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(0);
      }
    });

    it('should re-throw ApiError instances without modification', async () => {
      const apiError = new ApiError('Custom API error', 500);
      mockFetch.mockRejectedValue(apiError);

      await expect(apiService.getUser()).rejects.toThrow(apiError);
      
      try {
        await apiService.getUser();
      } catch (error) {
        expect(error).toBe(apiError);
        expect((error as ApiError).status).toBe(500);
        expect((error as ApiError).message).toBe('Custom API error');
      }
    });
  });

  describe('getUser', () => {
    it('should fetch user data successfully', async () => {
      const mockUser: User = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
      };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockUser),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.getUser();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://fe-task-api.mainstack.io/user',
        expect.objectContaining({
          headers: { 'Accept': 'application/json' },
        })
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle user fetch errors', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.getUser()).rejects.toThrow(ApiError);
      await expect(apiService.getUser()).rejects.toThrow('HTTP error! status: 401');
    });
  });

  describe('getWallet', () => {
    it('should fetch wallet data successfully', async () => {
      const mockWallet: Wallet = {
        balance: 5000.50,
        total_payout: 15000.75,
        total_revenue: 25000.25,
        pending_payout: 1500.00,
        ledger_balance: 3500.25,
      };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockWallet),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.getWallet();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://fe-task-api.mainstack.io/wallet',
        expect.objectContaining({
          headers: { 'Accept': 'application/json' },
        })
      );
      expect(result).toEqual(mockWallet);
    });

    it('should handle wallet fetch errors', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.getWallet()).rejects.toThrow(ApiError);
      await expect(apiService.getWallet()).rejects.toThrow('HTTP error! status: 403');
    });
  });

  describe('getTransactions', () => {
    it('should fetch transactions data successfully', async () => {
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
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockTransactions),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.getTransactions();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://fe-task-api.mainstack.io/transactions',
        expect.objectContaining({
          headers: { 'Accept': 'application/json' },
        })
      );
      expect(result).toEqual(mockTransactions);
    });

    it('should handle empty transactions array', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.getTransactions();

      expect(result).toEqual([]);
    });

    it('should handle transactions fetch errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.getTransactions()).rejects.toThrow(ApiError);
      await expect(apiService.getTransactions()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.getUser()).rejects.toThrow(ApiError);
      await expect(apiService.getUser()).rejects.toThrow('Invalid JSON');
    });

    it('should handle different HTTP status codes', async () => {
      const statusCodes = [400, 401, 403, 404, 422, 500, 502, 503];
      
      for (const status of statusCodes) {
        const mockResponse = {
          ok: false,
          status,
        };
        mockFetch.mockResolvedValue(mockResponse);

        try {
          await apiService.getUser();
        } catch (error) {
          expect(error).toBeInstanceOf(ApiError);
          expect((error as ApiError).status).toBe(status);
          expect((error as ApiError).message).toBe(`HTTP error! status: ${status}`);
        }
      }
    });

    it('should handle fetch timeout/abort errors', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValue(abortError);

      await expect(apiService.getUser()).rejects.toThrow(ApiError);
      await expect(apiService.getUser()).rejects.toThrow('The operation was aborted');
    });
  });
});
