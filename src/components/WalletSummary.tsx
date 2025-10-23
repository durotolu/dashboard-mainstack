import React from 'react';
import { useWallet } from '../hooks/useApi';
import { Button } from './ui/Button';
import { Loading } from './ui/Loading';
import './WalletSummary.css';
import { RevenueChart } from './RevenueChart';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    currencyDisplay: "code",
  }).format(amount);
};

export const WalletSummary: React.FC = () => {
  const { data: wallet, loading, error } = useWallet();

  if (loading) {
    return (
      <div className="wallet-summary">
        <Loading size="large" text="Loading wallet data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-summary">
        <div className="error-message">
          <p>Failed to load wallet data: {error}</p>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return null;
  }

  return (
    <div className="wallet-summary">
      <div className="wallet-summary__main">
        <div className="">
          <div className="wallet-summary__balance">
            <div className="balance-card balance-card--primary">
              <div className="balance-card__header">
                <span className="balance-card__label">Available Balance</span>
              </div>
              <div className="balance-card__amount">
                {formatCurrency(wallet.balance)}
              </div>
            </div>
            <div className="balance-card__action">
              <Button variant="primary" size="medium">
                Withdraw
              </Button>
            </div>
          </div>
          <RevenueChart />
        </div>

        <div className="wallet-summary__stats">
          <div className="stat-card">
            <div className="stat-card__header">
              <span className="stat-card__label">Ledger Balance</span>
              <button className="stat-card__info" aria-label="More info">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="5" r="1" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="stat-card__amount">
              {formatCurrency(wallet.ledger_balance)}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__header">
              <span className="stat-card__label">Total Payout</span>
              <button className="stat-card__info" aria-label="More info">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="5" r="1" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="stat-card__amount">
              {formatCurrency(wallet.total_payout)}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__header">
              <span className="stat-card__label">Total Revenue</span>
              <button className="stat-card__info" aria-label="More info">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="5" r="1" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="stat-card__amount">
              {formatCurrency(wallet.total_revenue)}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__header">
              <span className="stat-card__label">Pending Payout</span>
              <button className="stat-card__info" aria-label="More info">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="5" r="1" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="stat-card__amount">
              {formatCurrency(wallet.pending_payout)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
