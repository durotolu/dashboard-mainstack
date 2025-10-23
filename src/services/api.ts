import type { User, Wallet, Transaction } from '../types/api';
import { ApiError } from '../types/api';

const BASE_URL = 'https://fe-task-api.mainstack.io';

class ApiService {
  private async fetchWithErrorHandling<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors or other fetch errors
      throw new ApiError(
        error instanceof Error ? error.message : 'An unknown error occurred',
        0
      );
    }
  }

  async getUser(): Promise<User> {
    return this.fetchWithErrorHandling<User>('/user');
  }

  async getWallet(): Promise<Wallet> {
    return this.fetchWithErrorHandling<Wallet>('/wallet');
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.fetchWithErrorHandling<Transaction[]>('/transactions');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export { ApiService };
