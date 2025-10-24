# Mainstack Dashboard

A modern, responsive financial dashboard built with React, TypeScript, and Vite. This application provides a comprehensive view of wallet balances, revenue analytics, and transaction management with advanced filtering capabilities.

## 🚀 Features

- **Real-time Data Integration**: Connects to Mainstack API endpoints for live data
- **Responsive Design**: Pixel-perfect implementation matching Figma designs
- **Advanced Filtering**: Multi-criteria transaction filtering with date ranges, types, and statuses
- **Interactive Charts**: Revenue visualization with smooth animations
- **Comprehensive Testing**: Unit and integration tests with Vitest

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: CSS Modules with custom design system
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns, react-datepicker
- **Testing**: Vitest, React Testing Library, Happy DOM
- **API Integration**: Custom hooks with error handling and loading states

## 📋 Prerequisites

- Node.js 20.11.0 or higher
- npm 10.2.4 or higher

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/durotolu/dashboard-mainstack.git
   cd dashboard-mainstack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:ui
```

Run tests once:
```bash
npm run test:run
```

## 🏗️ Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   ├── Header.tsx      # Navigation header
│   ├── WalletSummary.tsx
│   ├── RevenueChart.tsx
│   ├── TransactionList.tsx
│   └── FilterModal.tsx
├── hooks/              # Custom React hooks
│   └── useApi.ts       # API integration hooks
├── services/           # API services
│   └── api.ts          # HTTP client and API calls
├── types/              # TypeScript type definitions
│   └── api.ts          # API response types
├── test/               # Test configuration
│   └── setup.ts        # Test setup file
└── App.tsx             # Main application component
```

## 🔌 API Integration

The application integrates with the following Mainstack API endpoints:

- `GET /user` - User profile information
- `GET /wallet` - Wallet balance and financial data
- `GET /transactions` - Transaction history

Base URL: `https://fe-task-api.mainstack.io`

## 🧩 Key Components

### WalletSummary
Displays financial overview including available balance, ledger balance, total payout, total revenue, and pending payout.

### TransactionList
Shows transaction history with advanced filtering capabilities including date range, transaction type, and status filters.

### FilterModal
Provides comprehensive filtering options with:
- Quick date filters (Today, Last 7 days, This month, Last 3 months)
- Custom date range selection
- Multi-select transaction types
- Multi-select transaction statuses

### RevenueChart
Interactive line chart showing revenue trends over time using Recharts library.

## 🔧 Development

### Testing Strategy
- Unit tests for individual components
- Integration tests for API calls
- Accessibility testing
- Responsive design testing

## 📝 License

This project is licensed under the MIT License.

## 🎯 Implementation Highlights

This dashboard was built with attention to:

- **Performance**: Optimized API calls with proper loading states
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **User Experience**: Intuitive filtering, responsive design, smooth animations
- **Code Quality**: TypeScript, comprehensive testing, clean architecture
- **Maintainability**: Modular components, consistent patterns, clear documentation

The application successfully integrates with the Mainstack API to provide a comprehensive financial dashboard experience that matches the provided Figma designs pixel-perfectly while maintaining excellent performance and user experience standards.
